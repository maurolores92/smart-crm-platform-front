import { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import { Box, Button, CircularProgress, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import apiConnector from 'src/services/api.service'
import ActivityTimeline from './activity/ActivityTimeline'
import type { Lead } from './ModalLeads'

interface User {
  id: number
  name: string
  lastName: string
  email: string
}

interface TaskPreview {
  id: number
  title: string
  status: string
  priority: string
  dueDate?: string
}

interface LeadDetailsDrawerProps {
  open: boolean
  mode: 'create' | 'edit' | 'view'
  lead: Lead | null
  users: User[]
  onClose: () => void
  onSubmit: (data: Partial<Lead>) => Promise<void>
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(5, 4),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const defaultFormData: Partial<Lead> = {
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'New',
  priority: 'Medium',
  notes: '',
  assignedUserId: '' as any
}

const TabPanel = ({ children, value, index }: { children: React.ReactNode; value: number; index: number }) => {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const LeadDetailsDrawer = ({ open, mode, lead, users, onClose, onSubmit }: LeadDetailsDrawerProps) => {
  const [tab, setTab] = useState(0)
  const [formData, setFormData] = useState<Partial<Lead>>(defaultFormData)
  const [tasks, setTasks] = useState<TaskPreview[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)

  const isReadOnly = mode === 'view'

  useEffect(() => {
    if (!open) return

    if (lead && mode !== 'create') {
      setFormData({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        priority: lead.priority,
        notes: lead.notes || '',
        assignedUserId: lead.assignedUser?.id || '' as any
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [open, lead, mode])

  useEffect(() => {
    const fetchTasks = async () => {
      if (!lead?.id) {
        setTasks([])

        return
      }

      try {
        setLoadingTasks(true)
        const response: any = await apiConnector.get('/tasks', { leadId: lead.id, page: 0, pageSize: 1000 })
        const payload = response?.data ?? response
        setTasks(Array.isArray(payload) ? payload : payload.data || [])
      } catch (error) {
        console.error('Error fetching lead tasks:', error)
      } finally {
        setLoadingTasks(false)
      }
    }

    if (open && lead?.id) {
      fetchTasks()
    }
  }, [open, lead])

  const handleFormChange = (field: keyof Lead | 'assignedUserId', value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    await onSubmit({ ...formData })
    onClose()
  }

  const getTitle = () => {
    if (mode === 'create') return 'Nuevo Lead'
    if (mode === 'edit') return 'Editar Lead'

    return 'Detalles del Lead'
  }

  const summaryItems = [
    { label: 'Estado', value: `${formData.status || 'New'}` },
    { label: 'Prioridad', value: `${formData.priority || 'Medium'}` },
    { label: 'Asignado', value: lead?.assignedUser ? `${lead.assignedUser.name} ${lead.assignedUser.lastName}` : 'Sin asignar' },
    { label: 'Tareas', value: `${tasks.length}` }
  ]

  const renderLeadInfo = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ p: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
          <Typography variant='overline' color='text.secondary'>Nombre</Typography>
          <Typography variant='body2' sx={{ mt: 1, fontWeight: 600 }}>{lead?.name || 'Sin nombre'}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ p: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
          <Typography variant='overline' color='text.secondary'>Compañía</Typography>
          <Typography variant='body2' sx={{ mt: 1, fontWeight: 600 }}>{lead?.company || 'Sin compañía'}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ p: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
          <Typography variant='overline' color='text.secondary'>Email</Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>{lead?.email || 'Sin email'}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ p: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
          <Typography variant='overline' color='text.secondary'>Teléfono</Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>{lead?.phone || 'Sin teléfono'}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ p: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
          <Typography variant='overline' color='text.secondary'>Estado</Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>{lead?.status || 'New'}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ p: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
          <Typography variant='overline' color='text.secondary'>Prioridad</Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>{lead?.priority || 'Medium'}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
          <Typography variant='overline' color='text.secondary'>Asignado a</Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>{lead?.assignedUser ? `${lead.assignedUser.name} ${lead.assignedUser.lastName}` : 'Sin asignar'}</Typography>
          {lead?.assignedUser?.email && (
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
              {lead.assignedUser.email}
            </Typography>
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 3, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
          <Typography variant='overline' color='text.secondary'>Notas</Typography>
          <Typography variant='body2' sx={{ mt: 1, whiteSpace: 'pre-line' }}>{lead?.notes || 'Sin notas'}</Typography>
        </Box>
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
          {lead && lead.company && (
            <Typography variant='body2' color='text.secondary'>
              {lead.company}
            </Typography>
          )}
        </Box>
        <IconButton size='small' onClick={onClose} sx={{ color: 'text.primary', backgroundColor: 'action.selected', '&:hover': { backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)` } }}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            {summaryItems.map(item => (
              <Grid item xs={6} key={item.label}>
                <Box sx={{ p: 2, borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
                  <Typography variant='overline' color='text.secondary'>
                    {item.label}
                  </Typography>
                  <Typography variant='body2' sx={{ mt: 1, fontWeight: 600 }}>
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 3 }}>
          <Tab label='Lead Info' />
          <Tab label='Tasks' />
          <Tab label='Activity Timeline' />
        </Tabs>
        <TabPanel value={tab} index={0}>
          {isReadOnly ? renderLeadInfo() : (
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='Nombre'
                  value={formData.name}
                  onChange={e => handleFormChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='Compañía'
                  value={formData.company}
                  onChange={e => handleFormChange('company', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='Email'
                  type='email'
                  value={formData.email}
                  onChange={e => handleFormChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size='small'
                  label='Teléfono'
                  value={formData.phone}
                  onChange={e => handleFormChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Estado</InputLabel>
                  <Select value={formData.status} label='Estado' onChange={e => handleFormChange('status', e.target.value)}>
                    <MenuItem value='New'>Nuevo</MenuItem>
                    <MenuItem value='Contacted'>Contactado</MenuItem>
                    <MenuItem value='Proposal'>Propuesta</MenuItem>
                    <MenuItem value='Negotiation'>Negociación</MenuItem>
                    <MenuItem value='Closed'>Cerrado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Prioridad</InputLabel>
                  <Select value={formData.priority} label='Prioridad' onChange={e => handleFormChange('priority', e.target.value)}>
                    <MenuItem value='Low'>Baja</MenuItem>
                    <MenuItem value='Medium'>Media</MenuItem>
                    <MenuItem value='High'>Alta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Usuario asignado</InputLabel>
                  <Select value={formData.assignedUserId ?? ''} label='Usuario asignado' onChange={e => handleFormChange('assignedUserId', e.target.value)}>
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
                <TextField
                  fullWidth
                  size='small'
                  label='Notas'
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={e => handleFormChange('notes', e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </TabPanel>
        <TabPanel value={tab} index={1}>
          {loadingTasks ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : tasks.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color='text.secondary'>No hay tareas relacionadas con este lead.</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Tarea</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Prioridad</TableCell>
                    <TableCell>Vence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map(task => (
                    <TableRow key={task.id} hover>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>{task.priority}</TableCell>
                      <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <ActivityTimeline leadId={lead?.id} />
        </TabPanel>
        <Divider sx={{ my: 4 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Button variant='outlined' onClick={onClose} sx={{ minWidth: 120 }}>
            Cerrar
          </Button>
          {!isReadOnly && (
            <Button variant='contained' onClick={handleSubmit} sx={{ minWidth: 120 }}>
              {mode === 'create' ? 'Crear Lead' : 'Guardar cambios'}
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}

export default LeadDetailsDrawer
