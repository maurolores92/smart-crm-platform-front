import React from 'react'
import { Box, Typography, Badge } from '@mui/material'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import LeadCard from './LeadCard'
import { Lead } from '../../leads/components/ModalLeads'

interface PipelineColumnProps {
  id: string
  title: string
  leads: Lead[]
}

const PipelineColumn = ({ id, title, leads }: PipelineColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id
  })

  return (
    <Box
      sx={{
        width: 320,
        minWidth: 320,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isOver ? 'action.hover' : 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        transition: 'background-color 0.2s ease',
      }}
    >
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}
      >
        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Badge
          badgeContent={leads.length}
          color='primary'
          sx={{
            '& .MuiBadge-badge': {
              position: 'static',
              transform: 'none',
              ml: 2
            }
          }}
        />
      </Box>

      <Box
        ref={setNodeRef}
        sx={{
          p: 2,
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 150 // Ensure there's always space to drop
        }}
      >
        <SortableContext items={leads.map(lead => lead.id.toString())} strategy={verticalListSortingStrategy}>
          {leads.map(lead => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
      </Box>
    </Box>
  )
}

export default PipelineColumn
