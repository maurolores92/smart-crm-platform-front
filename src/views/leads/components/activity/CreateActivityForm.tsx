import { useState } from 'react'
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { ActivityCreatePayload, ActivityType } from './types'

interface CreateActivityFormProps {
  onSubmit: (payload: ActivityCreatePayload) => Promise<boolean>
  loading: boolean
  disabled: boolean
}

const activityTypes: ActivityType[] = ['Note', 'Call', 'Meeting', 'Email', 'Follow Up']

const CreateActivityForm = ({ onSubmit, loading, disabled }: CreateActivityFormProps) => {
  const [type, setType] = useState<ActivityType>('Note')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Ingrese el contenido de la actividad')

      return
    }

    setError('')
    const success = await onSubmit({ type, content: content.trim() })
    if (success) {
      setType('Note')
      setContent('')
    }
  }

  return (
    <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', border: theme => `1px solid ${theme.palette.divider}` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant='h6'>Nueva actividad</Typography>
          <Typography variant='body2' color='text.secondary'>Agrega una nota, llamada, reunión o email al historial del lead.</Typography>
        </Box>
        <Icon icon='tabler:history' fontSize='1.25rem' />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth size='small'>
            <InputLabel>Tipo</InputLabel>
            <Select value={type} label='Tipo' onChange={e => setType(e.target.value as ActivityType)} disabled={disabled}>
              {activityTypes.map(activityType => (
                <MenuItem key={activityType} value={activityType}>
                  {activityType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size='small'
            label='Contenido'
            multiline
            minRows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            disabled={disabled}
          />
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography variant='caption' color='error.main'>
              {error}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button variant='contained' fullWidth onClick={handleSubmit} disabled={disabled || loading}>
            {loading ? 'Guardando...' : 'Agregar actividad'}
          </Button>
        </Grid>
      </Grid>
      {disabled && (
        <Typography variant='caption' color='text.secondary' sx={{ mt: 2, display: 'block' }}>
          Debes abrir un lead válido y tener sesión iniciada para crear actividades.
        </Typography>
      )}
    </Box>
  )
}

export default CreateActivityForm
