import { Box, Button, FormControl, Grid, InputAdornment, MenuItem, TextField } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { TaskPriority, TaskStatus } from '../types'

interface TaskToolbarProps {
  search: string
  statusFilter: TaskStatus | ''
  priorityFilter: TaskPriority | ''
  onSearchChange: (value: string) => void
  onStatusChange: (value: TaskStatus | '') => void
  onPriorityChange: (value: TaskPriority | '') => void
  onCreate: () => void
}

const STATUS_OPTIONS: Array<TaskStatus> = ['Pending', 'In Progress', 'Completed']
const PRIORITY_OPTIONS: Array<TaskPriority> = ['Low', 'Medium', 'High']

const TaskToolbar = ({
  search,
  statusFilter,
  priorityFilter,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCreate
}: TaskToolbarProps) => {
  return (
    <Box sx={{ mb: 4, px: { xs: 0, md: 1 } }}>
      <Grid container spacing={3} alignItems='center'>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size='small'
            placeholder='Buscar tareas...'
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Icon icon='tabler:search' fontSize='1.25rem' />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size='small'>
            <TextField
              select
              fullWidth
              size='small'
              label='Estado'
              value={statusFilter}
              onChange={e => onStatusChange(e.target.value as TaskStatus | '')}
            >
              <MenuItem value=''>Todos</MenuItem>
              {STATUS_OPTIONS.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size='small'>
            <TextField
              select
              fullWidth
              size='small'
              label='Prioridad'
              value={priorityFilter}
              onChange={e => onPriorityChange(e.target.value as TaskPriority | '')}
            >
              <MenuItem value=''>Todas</MenuItem>
              {PRIORITY_OPTIONS.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant='contained'
            startIcon={<Icon icon='tabler:plus' />}
            onClick={onCreate}
            sx={{ height: { xs: 'auto', md: 40 } }}
          >
            Nueva tarea
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TaskToolbar
