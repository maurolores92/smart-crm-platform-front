import { useEffect, useState } from 'react'
import { Box, CircularProgress, Divider, Typography } from '@mui/material'
import MuiTimeline from '@mui/lab/Timeline'
import ActivityItem from './ActivityItem'
import CreateActivityForm from './CreateActivityForm'
import apiConnector from 'src/services/api.service'
import { useAuth } from 'src/hooks/useAuth'
import { Activity, ActivityCreatePayload } from './types'

interface ActivityTimelineProps {
  leadId?: number | null
}

const ActivityTimeline = ({ leadId }: ActivityTimelineProps) => {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async () => {
    if (!leadId) {
      setActivities([])

      return
    }

    setLoading(true)
    setError(null)

    try {
      const response: any = await apiConnector.get(`/leads/${leadId}/activities`, { page: 0, pageSize: 100 })
      const payload = response?.data ?? response
      const items = Array.isArray(payload) ? payload : payload.data ?? []
      const normalized: Activity[] = items.map((activity: any) => ({
        id: activity.id,
        content: activity.content,
        type: activity.type,
        createdAt: activity.createdAt,
        user: activity.user,
      }))
      normalized.sort((a: Activity, b: Activity) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setActivities(normalized)
    } catch (err) {
      console.error('Error fetching activities:', err)
      setError('No se pudieron cargar las actividades')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId])

  const handleCreate = async (payload: ActivityCreatePayload) => {
    if (!leadId || !user?.id) {
      return false
    }

    setCreating(true)
    try {
      const response: any = await apiConnector.post('/activities', {
        leadId,
        userId: user.id,
        type: payload.type,
        content: payload.content,
      })
      const created = response?.data ?? response
      const activity: Activity = {
        id: created.id,
        content: created.content,
        type: created.type,
        createdAt: created.createdAt,
        user: created.user ?? { id: user.id, name: user.name, lastName: user.lastName, email: user.email },
      }
      setActivities(prev => [activity, ...prev])

      return true
    } catch (err) {
      console.error('Error creating activity:', err)
      setError('No se pudo crear la actividad')

      return false
    } finally {
      setCreating(false)
    }
  }

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <CreateActivityForm onSubmit={handleCreate} loading={creating} disabled={!leadId || !user?.id} />
      <Box sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', border: theme => `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant='h6'>Activity Timeline</Typography>
            <Typography variant='body2' color='text.secondary'>Historial de interacciones del lead, ordenado por fecha.</Typography>
          </Box>
          <Typography variant='caption' color='text.secondary'>Más reciente primero</Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color='error'>{error}</Typography>
        ) : activities.length === 0 ? (
          <Typography color='text.secondary'>Aún no hay actividades para este lead.</Typography>
        ) : (
          <MuiTimeline position='right'>
            {activities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </MuiTimeline>
        )}
      </Box>
    </Box>
  )
}

export default ActivityTimeline
