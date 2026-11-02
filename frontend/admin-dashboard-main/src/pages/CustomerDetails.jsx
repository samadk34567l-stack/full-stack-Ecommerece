import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import {
  Box,
  Card,
  Typography,
  TextField,
  Breadcrumbs,
  Link,
  Avatar,
  Divider,
  Grid,
  Badge,
  Button,
} from '@mui/material'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { fetchCustomerById, deleteCustomerApi } from '../api.js'

export default function CustomerDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [customer, setCustomer] = useState(null)

  useEffect(() => {
    fetchCustomerById(id).then((c) => {
      if (c) setCustomer(c)
    })
  }, [id])

  if (!customer) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Loading customer details...</Typography>
      </Box>
    )
  }

  const handleDelete = async () => {
    const ok = await deleteCustomerApi(customer.id)
    if (ok) {
      enqueueSnackbar('Customer deleted from database!', { variant: 'success' })
      navigate('/customer')
    } else {
      enqueueSnackbar('Failed to delete customer', { variant: 'error' })
    }
  }

  const [firstName, ...restName] = (customer.name || '').split(' ')
  const lastName = restName.join(' ')
  const addressText = customer.address || customer.location || customer.country || 'N/A'
  const joinedDate = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Recently'

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Customer Details
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditOutlinedIcon />}
            onClick={() => navigate(`/customer/edit/${customer.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteOutlineIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Breadcrumbs>
            <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate('/admin')}>
              Home
            </Link>
            <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate('/customer')}>
              Customer
            </Link>
            <Typography color="text.primary">Details</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Card sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      bgcolor: '#4caf50',
                      border: '2px solid #fff',
                    }}
                  />
                }
              >
                <Avatar src={customer.avatar} alt={customer.name} sx={{ width: 96, height: 96 }} />
              </Badge>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 2 }}>
                {customer.name}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                mt: 3,
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden',
                bgcolor: '#eef2fb',
              }}
            >
              <Box sx={{ flex: 1, textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Order
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>{customer.totalOrders ?? 0}</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ flex: 1, textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Order Values
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>${Number(customer.totalSpent ?? 0).toFixed(2)}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: '#e3edfb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PhoneIcon sx={{ fontSize: 18, color: '#2196f3' }} />
              </Box>
              <Typography variant="body2">{customer.phone || 'N/A'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: '#ede7f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <EmailIcon sx={{ fontSize: 18, color: '#673ab7' }} />
              </Box>
              <Typography variant="body2">{customer.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  bgcolor: '#e6f4ea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 16, color: '#4caf50' }} />
              </Box>
              <Typography variant="body2">Joined {joinedDate}</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>Location / Address</Typography>
              <Typography variant="body2" color="text.secondary">
                {addressText}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Basic Information</Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  First Name
                </Typography>
                <TextField fullWidth value={firstName || ''} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Last Name
                </Typography>
                <TextField fullWidth value={lastName || ''} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Company / Username
                </Typography>
                <TextField
                  fullWidth
                  value={customer.company || customer.name.toLowerCase().replace(/\s+/g, '_')}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Email
                </Typography>
                <TextField fullWidth value={customer.email} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Contact
                </Typography>
                <TextField fullWidth value={customer.phone || 'N/A'} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Status
                </Typography>
                <TextField fullWidth value={customer.status || 'Active'} disabled />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            <Typography sx={{ fontWeight: 700, mb: 2 }}>Address Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Location / Shipping Address
                </Typography>
                <TextField fullWidth value={addressText} disabled />
              </Grid>
              {customer.notes && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Notes
                  </Typography>
                  <TextField fullWidth multiline rows={2} value={customer.notes} disabled />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Box>
  )
}
