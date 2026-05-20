import React from 'react'
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import TaskStatusChip from './TaskStatusChip'
import TaskPriorityChip from './TaskPriorityChip'
import { Task } from '../types'

interface TaskTableProps {
  tasks: Task[]
  loading: boolean
  page: number
  pageSize: number
  total: number
  onPageChange: (newPage: number) => void
  onPageSizeChange: (newSize: number) => void
  onView: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const TaskTable = ({
  tasks,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete
}: TaskTableProps) => {
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 760 }}>
        <Table stickyHeader aria-label='tasks table'>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Lead</TableCell>
              <TableCell>Asignado</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Vence</TableCell>
              <TableCell align='right'>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Box sx={{ py: 10, display: 'flex', justifyContent: 'center' }}>
                    <Typography>Cargando tareas...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Box sx={{ py: 10, display: 'flex', justifyContent: 'center' }}>
                    <Typography>No se encontraron tareas</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              tasks.map(task => (
                <TableRow hover key={task.id}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>{task.title}</Typography>
                    <Typography variant='caption' color='text.secondary'>Creado: {new Date(task.createdAt).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{task.lead?.name || 'Sin lead'}</Typography>
                    <Typography variant='caption' color='text.secondary'>{task.lead?.company || ''}</Typography>
                  </TableCell>
                  <TableCell>{task.assignedUser ? `${task.assignedUser.name} ${task.assignedUser.lastName}` : 'Sin asignar'}</TableCell>
                  <TableCell><TaskPriorityChip priority={task.priority} /></TableCell>
                  <TableCell><TaskStatusChip status={task.status} /></TableCell>
                  <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell align='right'>
                    <IconButton size='small' onClick={() => onView(task)}>
                      <Icon icon='tabler:eye' />
                    </IconButton>
                    <IconButton size='small' onClick={() => onEdit(task)}>
                      <Icon icon='tabler:pencil' />
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => onDelete(task)}>
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        count={total}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={event => onPageSizeChange(parseInt(event.target.value, 10))}
        rowsPerPageOptions={[5, 10, 20, 30]}
      />
    </Paper>
  )
}

export default TaskTable
