import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
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
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useNavigate } from 'react-router-dom'
import { initialOrders } from '../data/orders.js'
import { fetchOrders, deleteOrderApi } from '../api.js'

const statusColor = {
  Pending: { bg: '#fff5df', color: '#b98900' },
  Complete: { bg: '#e6f4ea', color: '#1e7e34' },
  Delivered: { bg: '#e6f4ea', color: '#1e7e34' },
  Cancel: { bg: '#fdeaea', color: '#c62828' },
  Cancelled: { bg: '#fdeaea', color: '#c62828' },
  Hold: { bg: '#e8f1fd', color: '#1565c0' },
  Processing: { bg: '#e8f1fd', color: '#1565c0' },
}

export default function OrderList() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState(initialOrders)
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuRowId, setMenuRowId] = useState(null)
  const rowsPerPage = 7

  useEffect(() => {
    fetchOrders().then((list) => {
      if (list?.length) setOrders(list)
    })
  }, [])

  const filtered = orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search) ||
      o.branch.toLowerCase().includes(search.toLowerCase())
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
    await Promise.all(selected.map((id) => deleteOrderApi(id)))
    setOrders((prev) => prev.filter((o) => !selected.includes(o.id)))
    setSelected([])
  }

  const deleteOne = async (id) => {
    await deleteOrderApi(id)
    setOrders((prev) => prev.filter((o) => o.id !== id))
    setSelected((prev) => prev.filter((x) => x !== id))
    setMenuAnchor(null)
  }

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id))

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          List
        </Typography>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
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
              Delete
            </Button>
          </Toolbar>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search"
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
              <Button variant="outlined" startIcon={<DownloadIcon />}>
                Download
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/order/create')}>
                Add New
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
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Branch</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Payment Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Quantity
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Order Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((o) => (
                <TableRow key={o.id} hover selected={selected.includes(o.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(o.id)} onChange={() => toggleOne(o.id)} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>#{o.displayId || o.id}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell>{o.branch}</TableCell>
                  <TableCell>{o.paymentType}</TableCell>
                  <TableCell align="right">{o.quantity}</TableCell>
                  <TableCell>{o.orderDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={o.status}
                      size="small"
                      sx={{
                        backgroundColor: statusColor[o.status]?.bg,
                        color: statusColor[o.status]?.color,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setMenuAnchor(e.currentTarget)
                        setMenuRowId(o.id)
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No orders found
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
          <Select size="small" defaultValue={7} sx={{ minWidth: 70 }}>
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
