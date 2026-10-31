import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Select,
  MenuItem,
  Pagination,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VerifiedIcon from '@mui/icons-material/Verified'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import BlockIcon from '@mui/icons-material/Block'
import { users as staticUsers } from '../data/users.js'
import { fetchUsers } from '../api.js'

const statusColor = {
  Active: { bg: '#e6f4ea', color: '#1e7e34' },
  Pending: { bg: '#fff4e0', color: '#b26a00' },
  Rejected: { bg: '#fdeaea', color: '#c62828' },
}

export default function UserList() {
  const navigate = useNavigate()
  const [userList, setUserList] = useState(staticUsers)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  useEffect(() => {
    fetchUsers().then((list) => {
      if (list?.length) setUserList(list)
    })
  }, [])

  const filtered = userList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Style 01
        </Typography>
        <Breadcrumbs>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/user">
            List
          </Link>
          <Typography color="text.primary">Style 01</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            List
          </Typography>
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
            sx={{ width: { xs: '100%', sm: 260 } }}
          />
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>User Profile</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Country</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Friends</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Followers</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((u, idx) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{String((page - 1) * rowsPerPage + idx + 1).padStart(2, '0')}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/user/${u.id}`)}
                      >
                        <Avatar src={u.avatar} alt={u.name} />
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                '&:hover': { textDecoration: 'underline', color: 'primary.main' },
                              }}
                            >
                              {u.name}
                            </Typography>
                            {u.verified && (
                              <VerifiedIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {u.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{u.country}</TableCell>
                    <TableCell>{u.friends}</TableCell>
                    <TableCell>{u.followers}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColor[u.status].bg,
                          color: statusColor[u.status].color,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" sx={{ color: '#2196f3' }}>
                        <ChatBubbleOutlineIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#f44336' }}>
                        <BlockIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Pagination
            count={Math.max(1, Math.ceil(filtered.length / rowsPerPage))}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
            shape="rounded"
          />
          <Select size="small" defaultValue={10} sx={{ minWidth: 100 }}>
            <MenuItem value={10}>10 Rows</MenuItem>
            <MenuItem value={25}>25 Rows</MenuItem>
            <MenuItem value={50}>50 Rows</MenuItem>
          </Select>
        </Box>
      </Card>
    </Box>
  )
}
