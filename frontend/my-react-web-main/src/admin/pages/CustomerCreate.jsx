import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import {
  Box,
  Card,
  Typography,
  TextField,
  Breadcrumbs,
  Link,
  Button,
  Avatar,
  Divider,
  Grid,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import UploadIcon from '@mui/icons-material/Upload'
import { createCustomerApi } from '../api.js'

const countries = ['Pakistan', 'United States', 'Canada', 'United Kingdom', 'Australia', 'India']
const cities = ['Karachi', 'Lahore', 'Islamabad', 'New York', 'Toronto', 'London', 'Sydney', 'Delhi']

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CustomerCreate() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    countryCode: 'PK',
    contact: '',
    address: '',
    pinCode: '',
    city: 'Karachi',
    country: 'Pakistan',
    status: 'Active',
    notes: '',
    avatar: '',
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (submitted) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatar: String(reader.result || '') }))
    }
    reader.readAsDataURL(file)
  }

  const validateField = (field, value) => {
    const clean = String(value || '').trim()
    switch (field) {
      case 'firstName':
        return clean.length === 0 ? 'First name is required' : ''
      case 'email':
        if (clean.length === 0) return 'Email is required'
        if (!emailRegex.test(clean)) return 'Enter a valid email address'
        return ''
      case 'contact':
        if (clean.length === 0) return 'Contact number is required'
        if (clean.replace(/\D/g, '').length < 6) return 'Enter a valid phone number'
        return ''
      default:
        return ''
    }
  }

  const validateAll = () => {
    const requiredFields = ['firstName', 'email', 'contact']
    const newErrors = {}
    requiredFields.forEach((field) => {
      const err = validateField(field, form[field])
      if (err) newErrors[field] = err
    })
    return newErrors
  }

  const handleAdd = async () => {
    setSubmitted(true)
    const newErrors = validateAll()
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    const fullName = `${form.firstName} ${form.lastName}`.trim()
    const locationStr = [form.city, form.country].filter(Boolean).join(', ') || form.address.trim()

    try {
      await createCustomerApi({
        name: fullName,
        email: form.email.trim(),
        phone: form.contact.trim(),
        location: locationStr || 'Pakistan',
        address: form.address.trim(),
        city: form.city,
        country: form.country,
        pinCode: form.pinCode.trim(),
        company: form.userName.trim() || fullName.toLowerCase().replace(/\s+/g, '_'),
        notes: form.notes.trim(),
        status: form.status || 'Active',
        avatar: form.avatar,
      })
      enqueueSnackbar('Customer created in database!', { variant: 'success' })
      navigate('/customer')
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to create customer in database', { variant: 'error' })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Create Customer
        </Typography>
        <Breadcrumbs>
          <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate('/admin')}>
            Home
          </Link>
          <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate('/customer')}>
            Customer
          </Link>
          <Typography color="text.primary">Create</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          New Customer
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={form.avatar || undefined} sx={{ width: 72, height: 72, bgcolor: 'grey.200' }}>
              <PhotoCameraIcon sx={{ color: 'grey.500' }} />
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Personal Information</Typography>
              <Typography variant="body2" color="text.secondary">
                Add a profile picture (optional)
              </Typography>
            </Box>
          </Box>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => fileInputRef.current?.click()}>
            Upload Picture
          </Button>
        </Box>

        <Typography sx={{ fontWeight: 700, mb: 2 }}>Personal Information</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              First Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter first name"
              value={form.firstName}
              onChange={handleChange('firstName')}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Last Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter last name"
              value={form.lastName}
              onChange={handleChange('lastName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              User Name / Company
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter username or company"
              value={form.userName}
              onChange={handleChange('userName')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Email <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter customer email"
              value={form.email}
              onChange={handleChange('email')}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Contact <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl sx={{ width: 90 }}>
                <Select value={form.countryCode} onChange={handleChange('countryCode')}>
                  <MenuItem value="PK">PK</MenuItem>
                  <MenuItem value="US">US</MenuItem>
                  <MenuItem value="UK">UK</MenuItem>
                  <MenuItem value="CA">CA</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                placeholder="03001234567"
                value={form.contact}
                onChange={handleChange('contact')}
                error={Boolean(errors.contact)}
                helperText={errors.contact}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Status
            </Typography>
            <FormControl fullWidth>
              <Select value={form.status} onChange={handleChange('status')}>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Typography sx={{ fontWeight: 700, mb: 2 }}>Address Information</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Address
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter shipping address"
              value={form.address}
              onChange={handleChange('address')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Pin Code
            </Typography>
            <TextField
              fullWidth
              placeholder="75500"
              value={form.pinCode}
              onChange={handleChange('pinCode')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              City
            </Typography>
            <FormControl fullWidth>
              <Select value={form.city} onChange={handleChange('city')}>
                {cities.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Country
            </Typography>
            <FormControl fullWidth>
              <Select value={form.country} onChange={handleChange('country')}>
                {countries.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Typography sx={{ fontWeight: 700, mb: 2 }}>Additional Notes</Typography>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add any additional information about this customer..."
            value={form.notes}
            onChange={handleChange('notes')}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button color="error" onClick={() => navigate('/customer')}>
            Discard
          </Button>
          <Button variant="contained" onClick={handleAdd}>
            Add Customer
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
