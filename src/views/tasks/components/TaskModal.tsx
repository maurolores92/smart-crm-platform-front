import React, { useEffect, useState } from 'react'
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import FormDialog from 'src/components/dialogs/FormDialog'
import { Lead, Task, TaskFormState, TaskPriority, TaskStatus, User } from '../types'

export interface TaskModalProps {
  open: boolean
  mode: 'create' | 'edit' | 'view'
  task: Task | null
  users: User[]
  leads: Lead[]
  onClose: () => void
  onSubmit: (data: TaskFormState) => Promise<void>
  loading?: boolean
}

const getEmptyForm = (): TaskFormState => ({
  title: '',
  description: '',
  status: 'Pending',
  priority: 'Medium',
  dueDate: '',
  assignedUserId: undefined,
  leadId: undefined
})

const TaskModal: React.FC<TaskModalProps> = ({ open, mode, task, users, leads, onClose, onSubmit, loading }) => {
  const [formState, setFormState] = useState<TaskFormState>(getEmptyForm())
  const isView = mode === 'view'
  const titleAction = isView ? 'Cerrar' : mode === 'create' ? 'Crear tarea' : 'Guardar cambios'
  const titleLabel = mode === 'create' ? 'Nueva tarea' : mode === 'edit' ? 'Editar tarea' : 'Detalle de tarea'

  useEffect(() => {
    if (!open) return

    if (task) {
      setFormState({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        assignedUserId: task.assignedUserId ?? task.assignedUser?.id ?? undefined,
        leadId: task.leadId ?? task.lead?.id ?? undefined
      })
    } else {
      setFormState(getEmptyForm())
    }
  }, [open, task])

  const handleChange = (field: keyof TaskFormState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isView) {
      onClose()

      return
    }
    await onSubmit(formState)
  }

  const isValid = Boolean(formState.title.trim())

  return (
    <FormDialog open={open} onClose={onClose} title={titleLabel} onSubmit={handleSubmit} titleAction={titleAction} isValid={isValid || isView} loading={loading}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size='small'
            label='Título'
            value={formState.title}
            disabled={isView}
            onChange={e => handleChange('title', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size='small'>
            <TextField
              select
              label='Estado'
              value={formState.status}
              disabled={isView}
              onChange={e => handleChange('status', e.target.value as TaskStatus)}
            >
              <MenuItem value='Pending'>Pending</MenuItem>
              <MenuItem value='In Progress'>In Progress</MenuItem>
              <MenuItem value='Completed'>Completed</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size='small'>
            <TextField
              select
              label='Prioridad'
              value={formState.priority}
              disabled={isView}
              onChange={e => handleChange('priority', e.target.value as TaskPriority)}
            >
              <MenuItem value='Low'>Low</MenuItem>
              <MenuItem value='Medium'>Medium</MenuItem>
              <MenuItem value='High'>High</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size='small'
            type='date'
            label='Fecha de vencimiento'
            InputLabelProps={{ shrink: true }}
            value={formState.dueDate}
            disabled={isView}
            onChange={e => handleChange('dueDate', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size='small'>
            <TextField
              select
              label='Asignado a'
              value={formState.assignedUserId ?? ''}
              disabled={isView}
              onChange={e => handleChange('assignedUserId', e.target.value ? Number(e.target.value) : undefined)}
            >
              <MenuItem value=''>Sin asignar</MenuItem>
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} {user.lastName}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size='small'>
            <TextField
              select
              label='Lead relacionado'
              value={formState.leadId ?? ''}
              disabled={isView}
              onChange={e => handleChange('leadId', e.target.value ? Number(e.target.value) : undefined)}
            >
              <MenuItem value=''>Sin lead</MenuItem>
              {leads.map(lead => (
                <MenuItem key={lead.id} value={lead.id}>
                  {lead.name} - {lead.company}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size='small'
            label='Descripción'
            multiline
            rows={4}
            value={formState.description}
            disabled={isView}
            onChange={e => handleChange('description', e.target.value)}
          />
        </Grid>
        {isView && task && (
          <Grid item xs={12}>
            <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper', border: theme => `1px solid ${theme.palette.divider}` }}>
              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                Información adicional
              </Typography>
              <Typography variant='body2'>Tarea creada: {new Date(task.createdAt).toLocaleString()}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </FormDialog>
  )
}

export default TaskModal
