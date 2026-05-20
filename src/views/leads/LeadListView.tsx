import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import apiConnector from 'src/services/api.service'
import ModalLeads, { Lead } from './components/ModalLeads'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const statusColors: Record<string, any> = {
  New: 'info',
  Contacted: 'warning',
  Proposal: 'primary',
  Negotiation: 'secondary',
  Closed: 'success'
}

const statusLabels: Record<string, string> = {
  New: 'Nuevo',
  Contacted: 'Contactado',
  Proposal: 'Propuesta',
  Negotiation: 'Negociación',
  Closed: 'Cerrado'
}

const priorityColors: Record<string, any> = {
  Low: 'success',
  Medium: 'warning',
  High: 'error'
}

const priorityLabels: Record<string, string> = {
  Low: 'Baja',
  Medium: 'Media',
  High: 'Alta'
}

const LeadListView = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Pagination
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // Filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // Delete Dialog State
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0) // Reset to first page on new search
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      })
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (statusFilter) params.append('status', statusFilter)
      if (priorityFilter) params.append('priority', priorityFilter)

      const response: any = await apiConnector.get(`/leads?${params.toString()}`)
      
      setLeads(response.data || [])
      setTotal(response.total || 0)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, debouncedSearch, statusFilter, priorityFilter])

  const fetchUsers = async () => {
    try {
      const response: any = await apiConnector.get('/users/all')
      setUsers(response || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  useEffect(() => {
    fetchUsers()
  }, [])

  // Action Handlers
  const handleOpenModal = (mode: 'create' | 'edit' | 'view', lead: Lead | null = null) => {
    setModalMode(mode)
    setSelectedLead(lead)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLead(null)
  }

  const handleSubmitLead = async (data: Partial<Lead>) => {
    try {
      if (modalMode === 'create') {
        await apiConnector.post('/leads', data)
      } else if (modalMode === 'edit' && selectedLead) {
        await apiConnector.put(`/leads/${selectedLead.id}`, data)
      }
      fetchLeads()
    } catch (error) {
      console.error('Error saving lead:', error)
    }
  }

  const handleOpenDeleteDialog = (lead: Lead) => {
    setSelectedLead(lead)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedLead(null)
  }

  const handleDeleteLead = async () => {
    if (!selectedLead) return
    try {
      await apiConnector.remove(`/leads/${selectedLead.id}`)
      fetchLeads()
      handleCloseDeleteDialog()
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Gestión de Leads'
            subheader='Administra y da seguimiento a tus clientes potenciales'
            action={
              <Button
                variant='contained'
                startIcon={<Icon icon='tabler:plus' />}
                onClick={() => handleOpenModal('create')}
              >
                Nuevo Lead
              </Button>
            }
          />
          <CardContent>
            {/* Filters */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size='small'
                  label='Buscar lead (Nombre, Empresa, Email)'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <Icon icon='tabler:search' fontSize={20} style={{ marginRight: 8 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={statusFilter}
                    label='Estado'
                    onChange={e => {
                      setStatusFilter(e.target.value)
                      setPage(0)
                    }}
                  >
                    <MenuItem value=''>
                      <em>Todos</em>
                    </MenuItem>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Prioridad</InputLabel>
                  <Select
                    value={priorityFilter}
                    label='Prioridad'
                    onChange={e => {
                      setPriorityFilter(e.target.value)
                      setPage(0)
                    }}
                  >
                    <MenuItem value=''>
                      <em>Todas</em>
                    </MenuItem>
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Table */}
            <TableContainer component={Paper} variant='outlined'>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Compañía</TableCell>
                      <TableCell>Email / Tel</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Prioridad</TableCell>
                      <TableCell>Asignado A</TableCell>
                      <TableCell>Fecha Creación</TableCell>
                      <TableCell align='right'>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align='center'>
                          No se encontraron leads.
                        </TableCell>
                      </TableRow>
                    ) : (
                      leads.map(lead => (
                        <TableRow key={lead.id} hover>
                          <TableCell>
                            <Typography variant='body2' sx={{ fontWeight: 600 }}>
                              {lead.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{lead.company}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant='body2'>{lead.email}</Typography>
                              <Typography variant='caption' color='textSecondary'>{lead.phone || '-'}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={statusLabels[lead.status] || lead.status}
                              color={statusColors[lead.status] || 'default'}
                              size='small'
                              variant='outlined'
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={priorityLabels[lead.priority] || lead.priority}
                              color={priorityColors[lead.priority] || 'default'}
                              size='small'
                            />
                          </TableCell>
                          <TableCell>
                            {lead.assignedUser ? (
                              <Typography variant='body2'>
                                {lead.assignedUser.name} {lead.assignedUser.lastName}
                              </Typography>
                            ) : (
                              <Typography variant='body2' color='textSecondary'>
                                <em>Sin asignar</em>
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>
                              {format(new Date(lead.createdAt), "d 'de' MMM, yyyy", { locale: es })}
                            </Typography>
                          </TableCell>
                          <TableCell align='right'>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton size='small' color='secondary' onClick={() => handleOpenModal('view', lead)}>
                                <Icon icon='tabler:eye' />
                              </IconButton>
                              <IconButton size='small' color='primary' onClick={() => handleOpenModal('edit', lead)}>
                                <Icon icon='tabler:edit' />
                              </IconButton>
                              <IconButton size='small' color='error' onClick={() => handleOpenDeleteDialog(lead)}>
                                <Icon icon='tabler:trash' />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
              <TablePagination
                component='div'
                count={total}
                rowsPerPage={pageSize}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={e => {
                  setPageSize(parseInt(e.target.value, 10))
                  setPage(0)
                }}
                labelRowsPerPage='Filas por página:'
              />
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Leads Modal */}
      <ModalLeads
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        lead={selectedLead}
        users={users}
        onSubmit={handleSubmitLead}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth='xs' fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon='tabler:alert-triangle' fontSize={24} color='error' />
            Confirmar Eliminación
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar el lead{' '}
            <strong>
              {selectedLead?.name} ({selectedLead?.company})
            </strong>
            ?
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
            Esta acción no se puede deshacer y se perderán todos los datos asociados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color='secondary'>
            Cancelar
          </Button>
          <Button onClick={handleDeleteLead} variant='contained' color='error'>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default LeadListView
