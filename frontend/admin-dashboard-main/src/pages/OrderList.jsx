import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
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
import HomeIcon from '@mui/icons-material/Home'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { fetchOrders, updateOrderApi, deleteOrderApi } from '../api.js'

const statusColor = {
  Pending: { bg: '#fff5df', color: '#b98900' },
  Processing: { bg: '#e8f1fd', color: '#1565c0' },
  Hold: { bg: '#e8f1fd', color: '#1565c0' },
  Shipped: { bg: '#ede7f6', color: '#5e35b1' },
  Delivered: { bg: '#e6f4ea', color: '#1e7e34' },
  Complete: { bg: '#e6f4ea', color: '#1e7e34' },
  Cancelled: { bg: '#fdeaea', color: '#c62828' },
  Cancel: { bg: '#fdeaea', color: '#c62828' },
}

export default function OrderList() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuRowId, setMenuRowId] = useState(null)

  useEffect(() => {
    fetchOrders().then((list) => {
      setOrders(list || [])
    })
  }, [])

  const filtered = orders.filter(
    (o) =>
      (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (o.customerEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      String(o.displayId || o.id).toLowerCase().includes(search.toLowerCase()) ||
      (o.branch || '').toLowerCase().includes(search.toLowerCase())
  )
  const pageRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const toggleOne = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
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
    await Promise.all(selected.map((id) => deleteOrderApi(id)))
    setOrders((prev) => prev.filter((o) => !selected.includes(o.id)))
    setSelected([])
    enqueueSnackbar(`${count} order(s) deleted from database!`, { variant: 'success' })
  }

  const deleteOne = async (id) => {
    const ok = await deleteOrderApi(id)
    if (ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id))
      setSelected((prev) => prev.filter((x) => x !== id))
      enqueueSnackbar('Order deleted from database!', { variant: 'success' })
    } else {
      enqueueSnackbar('Failed to delete order', { variant: 'error' })
    }
    setMenuAnchor(null)
  }

  const handleStatusChange = async (order, newStatus) => {
    try {
      const updated = await updateOrderApi(order.id, { status: newStatus })
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, ...updated, rawStatus: newStatus } : o))
      )
      enqueueSnackbar(`Order #${order.displayId || order.id} status updated to ${newStatus}!`, {
        variant: 'success',
      })
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to update order status', { variant: 'error' })
    }
  }

  const handleDownloadCsv = () => {
    const headers = ['Order ID', 'Customer Name', 'Email', 'Address', 'Payment', 'Qty', 'Total', 'Date', 'Status']
    const rows = filtered.map((o) => [
      `"#${o.displayId || o.id}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${(o.customerEmail || '').replace(/"/g, '""')}"`,
      `"${(o.shippingAddress || o.branch || '').replace(/"/g, '""')}"`,
      `"${(o.paymentType || '').replace(/"/g, '""')}"`,
      o.quantity || 1,
      o.totalAmount || 0,
      `"${o.orderDate || ''}"`,
      o.rawStatus || o.status || 'Pending',
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'orders.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id))

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Order List
        </Typography>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate('/admin')}
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <HomeIcon fontSize="small" />
          </Link>
          <Typography color="text.secondary">Order</Typography>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            List
          </Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3 }}>
        {selected.length > 0 ? (
          <Toolbar disableGutters sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 600 }}>{selected.length} selected</Typography>
            <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} onClick={deleteSelected}>
              Delete Selected
            </Button>
          </Toolbar>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search order by ID, customer, address..."
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
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/order/create')}>
                Add New Order
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
                    indeterminate={pageRows.some((r) => selected.includes(r.id)) && !allOnPageSelected}
                    onChange={toggleAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Shipping Address</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Qty
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Total
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((o) => {
                const rawStat = o.rawStatus || o.status || 'Pending'
                const badgeColor = statusColor[rawStat] || statusColor[o.status] || statusColor.Pending
                return (
                  <TableRow key={o.id} hover selected={selected.includes(o.id)}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.includes(o.id)} onChange={() => toggleOne(o.id)} />
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, cursor: 'pointer', color: 'primary.main' }}
                      onClick={() => navigate(`/order/details/${o.id}`)}
                    >
                      #{o.displayId || o.id}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {o.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {o.customerEmail}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>{o.branch}</TableCell>
                    <TableCell>{o.paymentType}</TableCell>
                    <TableCell align="right">{o.quantity}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      ${Number(o.totalAmount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>{o.orderDate}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={
                          ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(rawStat)
                            ? rawStat
                            : 'Pending'
                        }
                        onChange={(e) => handleStatusChange(o, e.target.value)}
                        sx={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          bgcolor: badgeColor.bg,
                          color: badgeColor.color,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          '& .MuiSelect-select': { py: 0.5, px: 1.5 },
                        }}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Shipped">Shipped</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="Order Details">
                          <IconButton size="small" onClick={() => navigate(`/order/details/${o.id}`)}>
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Order">
                          <IconButton size="small" color="primary" onClick={() => navigate(`/order/edit/${o.id}`)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Order">
                          <IconButton size="small" color="error" onClick={() => deleteOne(o.id)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setMenuAnchor(e.currentTarget)
                            setMenuRowId(o.id)
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
                  <TableCell colSpan={10} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No orders found in database. Place an order from SHOP.CO or click &quot;Add New Order&quot;!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem
            onClick={() => {
              navigate(`/order/edit/${menuRowId}`)
              setMenuAnchor(null)
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/order/details/${menuRowId}`)
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
          <IconButton size="small" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
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
