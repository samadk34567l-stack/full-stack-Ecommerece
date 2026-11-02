import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { fetchCustomers, updateCustomerApi, deleteCustomerApi } from '../api.js'

const statusColor = {
  Active: { bg: '#e6f4ea', color: '#1e7e34' },
  Pending: { bg: '#fff4e0', color: '#b26a00' },
  Inactive: { bg: '#fdeaea', color: '#c62828' },
  Blocked: { bg: '#fdeaea', color: '#c62828' },
}

export default function CustomerList() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [customers, setCustomers] = useState([])
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuRowId, setMenuRowId] = useState(null)

  useEffect(() => {
    fetchCustomers().then((list) => {
      setCustomers(list || [])
    })
  }, [])

  const filtered = customers.filter(
    (c) =>
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.country || '').toLowerCase().includes(search.toLowerCase())
  )
  const pageRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    const pageIds = pageRows.map((r) => r.id)
    const allSelected = pageIds.every((id) => selected.includes(id))
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...pageIds])))
    }
  }

  const deleteSelected = async () => {
    const count = selected.length
    await Promise.all(selected.map((id) => deleteCustomerApi(id)))
    setCustomers((prev) => prev.filter((c) => !selected.includes(c.id)))
    setSelected([])
    enqueueSnackbar(`${count} customer(s) deleted from database!`, { variant: 'success' })
  }

  const deleteOne = async (id) => {
    const ok = await deleteCustomerApi(id)
    if (ok) {
      setCustomers((prev) => prev.filter((c) => c.id !== id))
      setSelected((prev) => prev.filter((x) => x !== id))
      enqueueSnackbar('Customer deleted from database!', { variant: 'success' })
    } else {
      enqueueSnackbar('Could not delete customer', { variant: 'error' })
    }
    setMenuAnchor(null)
  }

  const handleStatusChange = async (customer, newStatus) => {
    try {
      const updated = await updateCustomerApi(customer.id, { status: newStatus })
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, ...updated, status: newStatus } : c))
      )
      enqueueSnackbar(`Customer status updated to ${newStatus}!`, { variant: 'success' })
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to update status', { variant: 'error' })
    }
  }

  const handleDownloadCsv = () => {
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Status', 'Total Orders', 'Total Spent']
    const rows = filtered.map((c) => [
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${(c.location || c.country || '').replace(/"/g, '""')}"`,
      c.status || 'Active',
      c.totalOrders || 0,
      c.totalSpent || 0,
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'customers.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const allOnPageSelected =
    pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id))

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Customer List
        </Typography>
        <Breadcrumbs>
          <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate('/admin')}>
            Home
          </Link>
          <Typography color="text.secondary">Customer</Typography>
          <Typography color="text.primary">List</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3 }}>
        {selected.length > 0 ? (
          <Toolbar disableGutters sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 600 }}>{selected.length} selected</Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={deleteSelected}
            >
              Delete Selected
            </Button>
          </Toolbar>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search customer by name, email, phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 320 } }}
            />
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadCsv}>
                Download
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/customer/create')}
              >
                Add New Customer
              </Button>
            </Box>
          </Box>
        )}

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allOnPageSelected}
                    indeterminate={
                      pageRows.some((r) => selected.includes(r.id)) && !allOnPageSelected
                    }
                    onChange={toggleAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Orders / Spent</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((c) => {
                const currentColor = statusColor[c.status] || statusColor.Active
                return (
                  <TableRow key={c.id} hover selected={selected.includes(c.id)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(c.id)}
                        onChange={() => toggleOne(c.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                        onClick={() => navigate(`/customer/details/${c.id}`)}
                      >
                        <Avatar src={c.avatar} alt={c.name} />
                        <Box>
                          <Typography
                            sx={{ fontWeight: 600, '&:hover': { textDecoration: 'underline', color: 'primary.main' } }}
                          >
                            {c.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {c.company || c.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone || 'N/A'}</TableCell>
                    <TableCell>{c.location || c.country || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {c.totalOrders || 0} order(s)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${Number(c.totalSpent || 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={c.status || 'Active'}
                        onChange={(e) => handleStatusChange(c, e.target.value)}
                        sx={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          bgcolor: currentColor.bg,
                          color: currentColor.color,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          '& .MuiSelect-select': { py: 0.5, px: 1.5 },
                        }}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => navigate(`/customer/details/${c.id}`)}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Customer">
                          <IconButton size="small" color="primary" onClick={() => navigate(`/customer/edit/${c.id}`)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Customer">
                          <IconButton size="small" color="error" onClick={() => deleteOne(c.id)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setMenuAnchor(e.currentTarget)
                            setMenuRowId(c.id)
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })}
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No customers found in database. Click &quot;Add New Customer&quot; or place an order on SHOP.CO!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem
            onClick={() => {
              navigate(`/customer/edit/${menuRowId}`)
              setMenuAnchor(null)
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/customer/details/${menuRowId}`)
              setMenuAnchor(null)
            }}
          >
            Details
          </MenuItem>
          <MenuItem sx={{ color: 'error.main' }} onClick={() => deleteOne(menuRowId)}>
            Delete
          </MenuItem>
        </Menu>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Rows per page:
          </Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setPage(1)
            }}
            sx={{ minWidth: 70 }}
          >
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
          <Typography variant="body2" color="text.secondary">
            {filtered.length === 0
              ? '0 of 0'
              : `${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, filtered.length)} of ${filtered.length}`}
          </Typography>
          <IconButton
            size="small"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {'<'}
          </IconButton>
          <IconButton
            size="small"
            disabled={page * rowsPerPage >= filtered.length}
            onClick={() => setPage((p) => p + 1)}
          >
            {'>'}
          </IconButton>
        </Box>
      </Card>
    </Box>
  )
}
