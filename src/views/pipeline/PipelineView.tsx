import React, { useEffect, useState, useCallback } from 'react'
import { Box, Card, CardContent, CardHeader, CircularProgress, Typography } from '@mui/material'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'

import apiConnector from 'src/services/api.service'
import { Lead } from '../leads/components/ModalLeads'

import PipelineBoard from './components/PipelineBoard'
import PipelineColumn from './components/PipelineColumn'
import LeadCard from './components/LeadCard'

const STATUS_COLUMNS = [
  { id: 'New', title: 'Nuevo' },
  { id: 'Contacted', title: 'Contactado' },
  { id: 'Proposal', title: 'Propuesta' },
  { id: 'Negotiation', title: 'Negociación' },
  { id: 'Closed', title: 'Cerrado' }
]

const PipelineView = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5 // require 5px movement before drag starts (helps click events pass through)
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      // Fetch a large number of leads to populate the pipeline
      const response: any = await apiConnector.get('/leads?page=0&pageSize=1000')
      setLeads(response.data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  // Get active lead for overlay
  const activeLead = activeId ? leads.find(l => l.id.toString() === activeId) : null

  // Group leads by status
  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status)
  }

  // Find which status column an item belongs to
  const findContainer = (id: string) => {
    if (STATUS_COLUMNS.map(c => c.id).includes(id)) {
      return id // It's a column ID
    }
    const lead = leads.find(l => l.id.toString() === id)
    return lead ? lead.status : null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeContainer = findContainer(activeId)
    const overContainer = findContainer(overId)

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    // Moving between columns
    setLeads(prev => {
      const activeItems = prev.filter(l => l.status === activeContainer)
      const overItems = prev.filter(l => l.status === overContainer)

      const activeIndex = activeItems.findIndex(l => l.id.toString() === activeId)
      const overIndex = overItems.findIndex(l => l.id.toString() === overId)

      const newIndex =
        overIndex >= 0
          ? overIndex
          : overItems.length + 1

      const activeLead = prev.find(l => l.id.toString() === activeId)
      if (!activeLead) return prev

      // Create a new array with the modified lead
      const nextLeads = prev.filter(l => l.id.toString() !== activeId)
      
      const modifiedLead = { ...activeLead, status: overContainer }
      
      // We aren't doing strict insertion ordering here for the global array,
      // but just updating the status so it renders in the new column
      return [...nextLeads, modifiedLead]
    })
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeIdStr = active.id as string
    const activeLead = leads.find(l => l.id.toString() === activeIdStr)
    const overContainer = findContainer(over.id as string)

    if (activeLead && overContainer) {
      const prevStatus = activeLead.status
      
      // Visual reordering within the same column
      const activeContainer = findContainer(activeIdStr)
      if (activeContainer === overContainer) {
        const containerItems = leads.filter(l => l.status === activeContainer)
        const activeIndex = containerItems.findIndex(l => l.id.toString() === activeIdStr)
        const overIndex = containerItems.findIndex(l => l.id.toString() === over.id as string)
        
        if (activeIndex !== overIndex) {
          // You could reorder the array here if you need strict index matching,
          // but for status updates we just care if it changed columns.
        }
      }

      // If it changed columns during the drag, update backend
      // (The local state is already updated via handleDragOver, but we might want to check the original vs new)
      // Actually, since local state is instantly updated in handleDragOver, 
      // activeLead.status might already be overContainer. 
      // Let's rely on firing the API if it moved.
      
      // To reliably detect change, we can fetch or just always PATCH with the overContainer
      try {
        await apiConnector.put(`/leads/${activeIdStr}`, {
          status: overContainer
        })
      } catch (error) {
        console.error('Failed to update lead status on backend', error)
        // Ideally we would revert the state on failure
        fetchLeads() 
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Pipeline de Leads'
        subheader='Arrastra y suelta los leads para cambiar su estado'
      />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <PipelineBoard>
              {STATUS_COLUMNS.map(column => (
                <PipelineColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  leads={getLeadsByStatus(column.id)}
                />
              ))}
            </PipelineBoard>

            {/* Drag Overlay creates the visual copy when dragging */}
            <DragOverlay>
              {activeLead ? (
                <Box sx={{ opacity: 0.8, transform: 'rotate(2deg)' }}>
                  <LeadCard lead={activeLead} />
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}

export default PipelineView
