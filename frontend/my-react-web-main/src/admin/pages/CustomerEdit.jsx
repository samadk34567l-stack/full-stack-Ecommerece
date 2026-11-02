import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import UploadIcon from '@mui/icons-material/Upload'
import { fetchCustomerById, updateCustomerApi } from '../api.js'

const countries = ['Pakistan', 'United States', 'Canada', 'United Kingdom', 'Australia', 'India']
const cities = ['Karachi', 'Lahore', 'Islamabad', 'New York', 'Toronto', 'London', 'Sydney', 'Delhi']

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function CustomerEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
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
  const [pictureDeleted, setPictureDeleted] = useState(false)

  useEffect(() => {
    fetchCustomerById(id).then((c) => {
      if (!c) return
      const [fName, ...rest] = (c.name || '').split(' ')
      setForm((prev) => ({
        ...prev,
        firstName: fName || '',
        lastName: rest.join(' ') || '',
        userName: c.company || (c.name || 'user').toLowerCase().replace(/\s+/g, '_'),
        email: c.email || '',
        contact: String(c.phone || ''),
        address: c.address || c.location || '',
        pinCode: c.pinCode || '',
        city: cities.includes(c.city) ? c.city : 'Karachi',
        country: countries.includes(c.country) ? c.country : 'Pakistan',
        status: c.status || 'Active',
        notes: c.notes || '',
        avatar: c.avatar || '',
      }))
    })
  }, [id])

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
      setPictureDeleted(false)
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

  const handleDeletePicture = () => {
    setPictureDeleted(true)
    setForm((prev) => ({ ...prev, avatar: '' }))
  }

  const handleUpdate = async () => {
    setSubmitted(true)
    const newErrors = validateAll()
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    const fullName = `${form.firstName} ${form.lastName}`.trim()
    const locationStr = [form.city, form.country].filter(Boolean).join(', ') || form.address.trim()

    try {
      await updateCustomerApi(id, {
        name: fullName,
        email: form.email.trim(),
        phone: form.contact.trim(),
        location: locationStr || form.country,
        address: form.address.trim(),
        city: form.city,
        country: form.country,
        pinCode: form.pinCode.trim(),
        company: form.userName.trim(),
        notes: form.notes.trim(),
        status: form.status || 'Active',
        avatar: pictureDeleted ? '' : form.avatar,
      })
      enqueueSnackbar('Customer updated in database!', { variant: 'success' })
      navigate('/customer')
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to update customer', { variant: 'error' })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Edit Customer
        </Typography>
        <Breadcrumbs>
          <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate('/admin')}>
            Home
          </Link>
          <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate('/customer')}>
            Customer
          </Link>
          <Typography color="text.primary">Edit</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Edit Customer
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={pictureDeleted ? undefined : form.avatar}
              alt={form.firstName}
              sx={{ width: 72, height: 72, bgcolor: 'grey.200' }}
            />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Personal Information</Typography>
              <Typography variant="body2" color="text.secondary">
                Update or remove customer profile picture
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => fileInputRef.current?.click()}>
              Upload
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={handleDeletePicture}
              disabled={pictureDeleted}
            >
              {pictureDeleted ? 'Picture Deleted' : 'Delete Picture'}
            </Button>
          </Box>
        </Box>

        <Typography sx={{ fontWeight: 700, mb: 2 }}>Personal Information</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              First Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
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
            value={form.notes}
            onChange={handleChange('notes')}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button color="error" onClick={() => navigate('/customer')}>
            Discard
          </Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update Customer
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
