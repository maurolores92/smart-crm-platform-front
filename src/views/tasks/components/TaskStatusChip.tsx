import CustomChip from 'src/@core/components/mui/chip'

const STATUS_CONFIG: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info' }> = {
  Pending: { label: 'Pendiente', color: 'warning' },
  'In Progress': { label: 'En progreso', color: 'info' },
  Completed: { label: 'Completado', color: 'success' }
}

interface TaskStatusChipProps {
  status: string
}

const TaskStatusChip = ({ status }: TaskStatusChipProps) => {
  const config = STATUS_CONFIG[status] ?? { label: status, color: 'default' as any }

  return <CustomChip skin='light' size='small' color={config.color as any} label={config.label} />
}

export default TaskStatusChip
