import { Box, Typography } from '@mui/material'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import CustomTimelineDot from 'src/@core/components/mui/timeline-dot'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import { Activity } from './types'

const activityConfig = {
  Note: { icon: 'tabler:note', color: 'primary', label: 'Note' },
  Call: { icon: 'tabler:phone-call', color: 'info', label: 'Call' },
  Meeting: { icon: 'tabler:calendar-event', color: 'success', label: 'Meeting' },
  Email: { icon: 'tabler:mail', color: 'warning', label: 'Email' },
  'Follow Up': { icon: 'tabler:repeat', color: 'secondary', label: 'Follow Up' }
} as const

interface ActivityItemProps {
  activity: Activity
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const config = activityConfig[activity.type]
  const author = activity.user ? `${activity.user.name}${activity.user.lastName ? ` ${activity.user.lastName}` : ''}` : 'Unknown user'
  const dateLabel = activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'No date'

  return (
    <TimelineItem>
      <TimelineSeparator>
        <CustomTimelineDot skin='light' color={config.color}>
          <Icon icon={config.icon} fontSize={18} />
        </CustomTimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ py: 3, px: 0 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant='subtitle2'>{activity.type}</Typography>
            <CustomChip size='small' skin='light' color={config.color} label={config.label} />
          </Box>
          <Typography variant='caption' color='text.disabled'>
            {dateLabel}
          </Typography>
        </Box>
        <Typography variant='body2' sx={{ mt: 2, color: 'text.secondary', whiteSpace: 'pre-line' }}>
          {activity.content}
        </Typography>
        <Typography variant='caption' sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
          {author}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  )
}

export default ActivityItem
