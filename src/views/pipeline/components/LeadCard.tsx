import React from 'react'
import { Card, CardContent, Typography, Box, Chip, Avatar, Tooltip } from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Lead } from '../../leads/components/ModalLeads'
import Icon from 'src/@core/components/icon'

interface LeadCardProps {
  lead: Lead
}

const priorityColors: Record<string, any> = {
  Low: 'success',
  Medium: 'warning',
  High: 'error'
}

const priorityLabels: Record<string, string> = {
  Low: 'Baja',
  Medium: 'Media',
  High: 'Alta'
}

const LeadCard = ({ lead }: LeadCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lead.id.toString(), data: lead })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    marginBottom: '16px',
    position: 'relative' as const,
    zIndex: isDragging ? 100 : 1
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: isDragging ? 6 : 1,
        '&:hover': { boxShadow: 3 }
      }}
    >
      <CardContent sx={{ p: '12px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant='subtitle2' sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
            {lead.name}
          </Typography>
          <Chip
            label={priorityLabels[lead.priority] || lead.priority}
            color={priorityColors[lead.priority] || 'default'}
            size='small'
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
          <Icon icon='tabler:building' fontSize={14} style={{ marginRight: 4 }} />
          <Typography variant='caption' noWrap>
            {lead.company}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          {lead.assignedUser ? (
            <Tooltip title={`${lead.assignedUser.name} ${lead.assignedUser.lastName}`}>
              <Avatar
                sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}
              >
                {lead.assignedUser.name.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          ) : (
            <Tooltip title='Sin asignar'>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'action.disabledBackground' }}>
                <Icon icon='tabler:user-off' fontSize={14} />
              </Avatar>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default LeadCard
