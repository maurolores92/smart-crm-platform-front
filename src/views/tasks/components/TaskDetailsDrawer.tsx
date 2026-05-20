import React, { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import TaskStatusChip from './TaskStatusChip'
import TaskPriorityChip from './TaskPriorityChip'
import { Lead, Task, TaskFormState, TaskPriority, TaskStatus, User } from '../types'

interface TaskDetailsDrawerProps {
  open: boolean
  mode: 'create' | 'edit' | 'view'
  task: Task | null
  users: User[]
  leads: Lead[]
  onClose: () => void
  onSubmit: (data: TaskFormState) => Promise<void>
  loading?: boolean
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(5, 4),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const getEmptyForm = (): TaskFormState => ({
  title: '',
  description: '',
  status: 'Pending',
  priority: 'Medium',
  dueDate: '',
  assignedUserId: undefined,
  leadId: undefined
})

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return <div role='tabpanel' hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>
}

const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({ open, mode, task, users, leads, onClose, onSubmit, loading = false }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [formState, setFormState] = useState<TaskFormState>(getEmptyForm())
  const isReadOnly = mode === 'view'

  useEffect(() => {
    if (!open) return
    if (task && mode !== 'create') {
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
  }, [open, task, mode])

  const handleFormChange = (field: keyof TaskFormState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    await onSubmit(formState)
    onClose()
  }

  const getTitle = () => {
    if (mode === 'create') return 'Nueva tarea'
    if (mode === 'edit') return 'Editar tarea'

    return 'Detalle de tarea'
  }

  const renderTaskInfo = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant='subtitle2' color='text.secondary'>Resumen de tarea</Typography>
        <Typography variant='h6' sx={{ mt: 1 }}>{formState.title || task?.title || 'Sin título'}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <TaskStatusChip status={formState.status || task?.status || 'Pending'} />
        <TaskPriorityChip priority={formState.priority || task?.priority || 'Medium'} />
        <Typography variant='body2' color='text.secondary'>Vence: {formState.dueDate || task?.dueDate ? new Date(formState.dueDate || task?.dueDate || '').toLocaleDateString() : 'N/A'}</Typography>
      </Box>
      <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', border: theme => `1px solid ${theme.palette.divider}` }}>
        <Typography variant='subtitle2' sx={{ mb: 1 }}>Descripción</Typography>
        <Typography variant='body2' color='text.secondary'>{formState.description || task?.description || 'No hay descripción disponible.'}</Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2 }}>
        <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', border: theme => `1px solid ${theme.palette.divider}` }}>
          <Typography variant='subtitle2'>Asignado a</Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>{(users.find(user => user.id === formState.assignedUserId) || task?.assignedUser)?.name || 'Sin asignar'} {(users.find(user => user.id === formState.assignedUserId) || task?.assignedUser)?.lastName || ''}</Typography>
          <Typography variant='caption' color='text.secondary'>{(users.find(user => user.id === formState.assignedUserId) || task?.assignedUser)?.email || ''}</Typography>
        </Box>
        <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', border: theme => `1px solid ${theme.palette.divider}` }}>
          <Typography variant='subtitle2'>Lead relacionado</Typography>
          {task?.lead || leads.find(lead => lead.id === formState.leadId) ? (
            <Box sx={{ mt: 1 }}>
              <Typography variant='body2'>{task?.lead?.name || leads.find(lead => lead.id === formState.leadId)?.name}</Typography>
              <Typography variant='caption' color='text.secondary'>{task?.lead?.company || leads.find(lead => lead.id === formState.leadId)?.company}</Typography>
            </Box>
          ) : (
            <Typography variant='body2' color='text.secondary'>No hay lead asignado</Typography>
          )}
        </Box>
      </Box>
    </Box>
  )

  const renderForm = () => (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          size='small'
          label='Título'
          value={formState.title}
          disabled={isReadOnly}
          onChange={e => handleFormChange('title', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth size='small'>
          <InputLabel>Estado</InputLabel>
          <Select value={formState.status} label='Estado' disabled={isReadOnly} onChange={e => handleFormChange('status', e.target.value as TaskStatus)}>
            <MenuItem value='Pending'>Pending</MenuItem>
            <MenuItem value='In Progress'>In Progress</MenuItem>
            <MenuItem value='Completed'>Completed</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth size='small'>
          <InputLabel>Prioridad</InputLabel>
          <Select value={formState.priority} label='Prioridad' disabled={isReadOnly} onChange={e => handleFormChange('priority', e.target.value as TaskPriority)}>
            <MenuItem value='Low'>Low</MenuItem>
            <MenuItem value='Medium'>Medium</MenuItem>
            <MenuItem value='High'>High</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          size='small'
          type='date'
          label='Fecha de vencimiento'
          InputLabelProps={{ shrink: true }}
          value={formState.dueDate}
          disabled={isReadOnly}
          onChange={e => handleFormChange('dueDate', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth size='small'>
          <InputLabel>Asignado a</InputLabel>
          <Select value={formState.assignedUserId ?? ''} label='Asignado a' disabled={isReadOnly} onChange={e => handleFormChange('assignedUserId', e.target.value ? Number(e.target.value) : undefined)}>
            <MenuItem value=''>Sin asignar</MenuItem>
            {users.map(user => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} {user.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth size='small'>
          <InputLabel>Lead relacionado</InputLabel>
          <Select value={formState.leadId ?? ''} label='Lead relacionado' disabled={isReadOnly} onChange={e => handleFormChange('leadId', e.target.value ? Number(e.target.value) : undefined)}>
            <MenuItem value=''>Sin lead</MenuItem>
            {leads.map(lead => (
              <MenuItem key={lead.id} value={lead.id}>
                {lead.name} - {lead.company}
              </MenuItem>
            ))}
          </Select>
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
          disabled={isReadOnly}
          onChange={e => handleFormChange('description', e.target.value)}
        />
      </Grid>
    </Grid>
  )

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 320, sm: 520, md: 640 } } }}
    >
      <Header>
        <Box>
          <Typography variant='h5'>{getTitle()}</Typography>
          <Typography variant='body2' color='text.secondary'>
            {task?.title ? `#${task.id}` : 'Nueva tarea'}
          </Typography>
        </Box>
        <IconButton size='small' onClick={onClose} sx={{ color: 'text.primary', backgroundColor: 'action.selected', '&:hover': { backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)` } }}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} sx={{ mb: 3 }}>
          <Tab label='Detalles' />
          <Tab label='Lead relacionado' />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          {mode === 'view' ? renderTaskInfo() : renderForm()}
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', border: theme => `1px solid ${theme.palette.divider}` }}>
            <Typography variant='subtitle2'>Lead relacionado</Typography>
            {task?.lead || formState.leadId ? (
              <Box sx={{ mt: 2 }}>
                <Typography variant='body2'>
                  {task?.lead?.name || leads.find(lead => lead.id === formState.leadId)?.name}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {task?.lead?.company || leads.find(lead => lead.id === formState.leadId)?.company}
                </Typography>
              </Box>
            ) : (
              <Typography variant='body2' color='text.secondary'>No hay lead relacionado.</Typography>
            )}
          </Box>
        </TabPanel>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Button variant='outlined' onClick={onClose} sx={{ minWidth: 120 }}>
            Cerrar
          </Button>
          {!isReadOnly && (
            <Button variant='contained' onClick={handleSubmit} sx={{ minWidth: 120 }} disabled={loading}>
              Guardar
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}

export default TaskDetailsDrawer
