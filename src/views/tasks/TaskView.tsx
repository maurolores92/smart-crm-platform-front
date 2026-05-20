import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import apiConnector from 'src/services/api.service'
import TaskToolbar from './components/TaskToolbar'
import TaskTable from './components/TaskTable'
import TaskDetailsDrawer from './components/TaskDetailsDrawer'
import ConfirmDeleteDialog from 'src/components/dialogs/ConfirmDeleteDialog'
import { Lead, Task, TaskPriority, TaskStatus, User } from './types'

const TaskView = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('')

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0)
    }, 500)

    return () => clearTimeout(handler)
  }, [search])

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      })

      if (debouncedSearch) params.append('search', debouncedSearch)
      if (statusFilter) params.append('status', statusFilter)
      if (priorityFilter) params.append('priority', priorityFilter)

      const response: any = await apiConnector.get(`/tasks?${params.toString()}`)
      const payload = response?.data ?? response
      setTasks(Array.isArray(payload) ? payload : payload.data || [])
      setTotal(payload.total ?? 0)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, debouncedSearch, statusFilter, priorityFilter])

  const fetchUsers = useCallback(async () => {
    try {
      const response: any = await apiConnector.get('/users/all')
      setUsers(Array.isArray(response) ? response : response.data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }, [])

  const fetchLeads = useCallback(async () => {
    try {
      const response: any = await apiConnector.get('/leads?page=0&pageSize=1000')
      const payload = response?.data ?? response
      setLeads(Array.isArray(payload) ? payload : payload.data || [])
    } catch (error) {
      console.error('Error fetching leads:', error)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    fetchUsers()
    fetchLeads()
  }, [fetchUsers, fetchLeads])

  const openCreateDrawer = () => {
    setDrawerMode('create')
    setSelectedTask(null)
    setDrawerOpen(true)
  }

  const openEditDrawer = (task: Task) => {
    setDrawerMode('edit')
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  const openViewDrawer = (task: Task) => {
    setDrawerMode('view')
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setSelectedTask(null)
  }

  const handleSubmitTask = async (payload: any) => {
    try {
      setSaving(true)
      if (drawerMode === 'create') {
        await apiConnector.post('/tasks', payload)
      } else if (drawerMode === 'edit' && selectedTask) {
        await apiConnector.patch(`/tasks/${selectedTask.id}`, payload)
      }
      closeDrawer()
      fetchTasks()
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setSaving(false)
    }
  }

  const openDeleteDialog = (task: Task) => {
    setSelectedTask(task)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setSelectedTask(null)
  }

  const handleDeleteTask = async () => {
    if (!selectedTask) return
    try {
      await apiConnector.remove(`/tasks/${selectedTask.id}`)
      closeDeleteDialog()
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const taskCountLabel = useMemo(() => {
    if (loading) return 'Cargando tareas...'

    return `${total} tarea${total === 1 ? '' : 's'}`
  }, [loading, total])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Tareas'
            subheader='Gestiona todas las tareas del CRM asociados a leads y usuarios.'
          />
          <CardContent>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant='subtitle2' color='text.secondary'>{taskCountLabel}</Typography>
              <Button variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={openCreateDrawer}>
                Nueva tarea
              </Button>
            </Box>
            <TaskToolbar
              search={search}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onSearchChange={value => setSearch(value)}
              onStatusChange={value => {
                setStatusFilter(value)
                setPage(0)
              }}
              onPriorityChange={value => {
                setPriorityFilter(value)
                setPage(0)
              }}
              onCreate={openCreateDrawer}
            />
            <TaskTable
              tasks={tasks}
              loading={loading}
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={newPage => setPage(newPage)}
              onPageSizeChange={newSize => {
                setPageSize(newSize)
                setPage(0)
              }}
              onView={openViewDrawer}
              onEdit={openEditDrawer}
              onDelete={openDeleteDialog}
            />
          </CardContent>
        </Card>
      </Grid>
      <TaskDetailsDrawer
        open={drawerOpen}
        mode={drawerMode}
        task={selectedTask}
        users={users}
        leads={leads}
        onClose={closeDrawer}
        onSubmit={handleSubmitTask}
        loading={saving}
      />
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        title='Eliminar tarea'
        action={handleDeleteTask}
        titleAction='Eliminar'
      >
        <Typography>¿Deseas eliminar esta tarea?</Typography>
      </ConfirmDeleteDialog>
    </Grid>
  )
}

export default TaskView
