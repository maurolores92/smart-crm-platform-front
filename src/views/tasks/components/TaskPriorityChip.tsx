import CustomChip from 'src/@core/components/mui/chip'

const PRIORITY_CONFIG: Record<string, { label: string; color: 'success' | 'warning' | 'error' }> = {
  Low: { label: 'Baja', color: 'success' },
  Medium: { label: 'Media', color: 'warning' },
  High: { label: 'Alta', color: 'error' }
}

interface TaskPriorityChipProps {
  priority: string
}

const TaskPriorityChip = ({ priority }: TaskPriorityChipProps) => {
  const config = PRIORITY_CONFIG[priority] ?? { label: priority, color: 'warning' }

  return <CustomChip skin='light' size='small' color={config.color as any} label={config.label} />
}

export default TaskPriorityChip
