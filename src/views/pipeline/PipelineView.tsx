import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Box, Card, CardContent, CardHeader, CircularProgress } from '@mui/material'
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
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

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
      const response: any = await apiConnector.get('/leads', { page: 0, pageSize: 1000 })
      const payload = response?.data ?? response
      setLeads(Array.isArray(payload) ? payload : [])
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

  const leadStatusMap = useMemo(() => {
    return leads.reduce<Record<string, string>>((map, lead) => {
      map[lead.id.toString()] = lead.status

      return map
    }, {})
  }, [leads])

  const getLeadsByStatus = useCallback(
    (status: string) => leads.filter(lead => lead.status === status),
    [leads]
  )

  const findContainer = (id: string) => {
    if (STATUS_COLUMNS.some(c => c.id === id)) {
      return id
    }

    return leadStatusMap[id] ?? null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeLead = active.data.current as Lead
    const overId = over.id as string
    const overContainer = findContainer(overId)

    if (!activeLead || !overContainer || activeLead.status === overContainer) {
      return
    }

    setLeads(prev => prev.map(lead => (lead.id === activeLead.id ? { ...lead, status: overContainer } : lead)))
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeLead = active.data.current as Lead
    const overContainer = findContainer(over.id as string)

    if (!activeLead || !overContainer || activeLead.status === overContainer) {
      return
    }

    try {
      await apiConnector.patch(`/leads/${activeLead.id}`, {
        status: overContainer
      })
    } catch (error) {
      console.error('Failed to update lead status on backend', error)
      fetchLeads()
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
