import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'

export interface Lead {
  id: number
  name: string
  company: string
  email: string
  phone: string
  status: string
  priority: string
  notes: string
  assignedUser?: { id: number; name: string; lastName: string; email: string }
  assignedUserId?: number | ''
  createdAt: string
}

interface User {
  id: number
  name: string
  lastName: string
  email: string
}

interface ModalLeadsProps {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit' | 'view'
  lead: Lead | null
  users: User[]
  onSubmit: (data: Partial<Lead>) => Promise<void>
}

const ModalLeads = ({ open, onClose, mode, lead, users, onSubmit }: ModalLeadsProps) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    priority: 'Medium',
    notes: '',
    assignedUserId: '' as any
  })

  useEffect(() => {
    if (open && lead && mode !== 'create') {
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
    } else if (open && mode === 'create') {
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'New',
        priority: 'Medium',
        notes: '',
        assignedUserId: '' as any
      })
    }
  }, [open, lead, mode])

  const handleFormChange = (field: keyof Lead | 'assignedUserId', value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    // Send data to parent component
    const submitData = { ...formData }
    if (submitData.assignedUserId === '') {
      submitData.assignedUserId = null as any
    }
    await onSubmit(submitData)
    onClose()
  }

  const isReadOnly = mode === 'view'

  const getTitle = () => {
    if (mode === 'create') return 'Nuevo Lead'
    if (mode === 'edit') return 'Editar Lead'

    return 'Detalles del Lead'
  }

  const getIcon = () => {
    if (mode === 'create') return 'tabler:user-plus'
    if (mode === 'edit') return 'tabler:edit'

    return 'tabler:eye'
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon icon={getIcon()} fontSize={24} />
          <Typography variant='h6'>{getTitle()}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Nombre'
              value={formData.name}
              onChange={e => handleFormChange('name', e.target.value)}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Compañía'
              value={formData.company}
              onChange={e => handleFormChange('company', e.target.value)}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Email'
              type='email'
              value={formData.email}
              onChange={e => handleFormChange('email', e.target.value)}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Teléfono'
              value={formData.phone}
              onChange={e => handleFormChange('phone', e.target.value)}
              disabled={isReadOnly}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.status}
                label='Estado'
                onChange={e => handleFormChange('status', e.target.value)}
              >
                <MenuItem value='New'>Nuevo</MenuItem>
                <MenuItem value='Contacted'>Contactado</MenuItem>
                <MenuItem value='Proposal'>Propuesta</MenuItem>
                <MenuItem value='Negotiation'>Negociación</MenuItem>
                <MenuItem value='Closed'>Cerrado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={formData.priority}
                label='Prioridad'
                onChange={e => handleFormChange('priority', e.target.value)}
              >
                <MenuItem value='Low'>Baja</MenuItem>
                <MenuItem value='Medium'>Media</MenuItem>
                <MenuItem value='High'>Alta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Usuario Asignado</InputLabel>
              <Select
                value={formData.assignedUserId}
                label='Usuario Asignado'
                onChange={e => handleFormChange('assignedUserId', e.target.value)}
              >
                <MenuItem value=''>
                  <em>Sin asignar</em>
                </MenuItem>
                {users.map(user => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} {user.lastName} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label='Notas'
              value={formData.notes}
              onChange={e => handleFormChange('notes', e.target.value)}
              disabled={isReadOnly}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary' variant='outlined'>
          {mode === 'view' ? 'Cerrar' : 'Cancelar'}
        </Button>
        {!isReadOnly && (
          <Button
            onClick={handleSubmit}
            variant='contained'
            disabled={!formData.name || !formData.company || !formData.email}
          >
            {mode === 'create' ? 'Crear Lead' : 'Guardar Cambios'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ModalLeads
