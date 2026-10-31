import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  MenuItem,
  Select,
  FormControl,
  IconButton,
  Badge,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { initialCustomers } from '../data/customers.js'
import { fetchCustomerById } from '../api.js'

export default function CustomerDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [customer, setCustomer] = useState(
    () => initialCustomers.find((c) => String(c.id) === String(id)) || initialCustomers[0]
  )

  useEffect(() => {
    fetchCustomerById(id).then((c) => {
      if (c) setCustomer(c)
    })
  }, [id])

  const [firstName, lastName] = customer.name.split(' ')
  const shippingAddress = 'Florida Square, Wouruno, New York, United States - 393010'
  const billingAddress = 'Florida Square, Wouruno, New York, United States - 393010'

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Details
        </Typography>
        <Breadcrumbs>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.secondary">Customer</Typography>
          <Typography color="text.primary">Details</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Left column */}
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
                <Typography sx={{ fontWeight: 700 }}>185</Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ flex: 1, textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Order Values
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>7421</Typography>
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
              <Typography variant="body2">{customer.phone}</Typography>
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
              <Typography variant="body2">Joined 4 Sep 2026</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>Shipping Address</Typography>
                <IconButton size="small" sx={{ border: '1px solid', borderColor: 'primary.main' }}>
                  <EditIcon sx={{ fontSize: 16 }} color="primary" />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {shippingAddress}
              </Typography>
            </Box>

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>Billing Address</Typography>
                <IconButton size="small" sx={{ border: '1px solid', borderColor: 'primary.main' }}>
                  <EditIcon sx={{ fontSize: 16 }} color="primary" />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {billingAddress}
              </Typography>
            </Box>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} md={8}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Basic Information</Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  First Name
                </Typography>
                <TextField fullWidth value={firstName} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Last Name
                </Typography>
                <TextField fullWidth value={lastName || ''} disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  User Name
                </Typography>
                <TextField
                  fullWidth
                  value={customer.name.toLowerCase().replace(' ', '_')}
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
                  Contact <Box component="span" sx={{ color: 'error.main' }}>*</Box>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl sx={{ width: 90 }}>
                    <Select value="US" disabled>
                      <MenuItem value="US">US</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField fullWidth value={customer.phone} disabled />
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            <Typography sx={{ fontWeight: 700, mb: 2 }}>Address Information</Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Address
                </Typography>
                <TextField fullWidth value="Florida Square, Wouruno" disabled />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Pin Code
                </Typography>
                <TextField fullWidth value="393010" disabled />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  City
                </Typography>
                <FormControl fullWidth>
                  <Select value="New York" disabled>
                    <MenuItem value="New York">New York</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Country
                </Typography>
                <FormControl fullWidth>
                  <Select value={customer.country} disabled>
                    <MenuItem value={customer.country}>{customer.country}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            <Typography sx={{ fontWeight: 700, mb: 2 }}>Additional Notes</Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Note
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value="Sample description text for user profile."
              disabled
            />
          </Grid>
        </Grid>
      </Card>
    </Box>
  )
}
