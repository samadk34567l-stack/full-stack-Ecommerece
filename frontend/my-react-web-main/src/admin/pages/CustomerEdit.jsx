import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { initialCustomers } from '../data/customers.js'
import { fetchCustomerById, updateCustomerApi } from '../api.js'

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Pakistan', 'India']
const cities = ['New York', 'Toronto', 'London', 'Sydney', 'Karachi', 'Delhi']

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[0-9]{7,15}$/
const pinRegex = /^[0-9]{4,10}$/

export default function CustomerEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const existing =
    initialCustomers.find((c) => String(c.id) === String(id)) || initialCustomers[0]
  const [firstNameInit, lastNameInit] = existing.name.split(' ')

  const initialForm = {
    firstName: firstNameInit || '',
    lastName: lastNameInit || '',
    userName: existing.name.toLowerCase().replace(' ', '_'),
    email: existing.email,
    countryCode: 'US',
    contact: existing.phone,
    address: 'Florida Square, Wouruno',
    pinCode: '393010',
    city: 'New York',
    country: existing.country,
    notes: 'Sample description text for user profile',
    avatar: existing.avatar,
  }

  const [form, setForm] = useState(initialForm)
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
        lastName: rest.join(' ') || 'Customer',
        userName: (c.name || 'user').toLowerCase().replace(/\s+/g, '_'),
        email: c.email || '',
        contact: String(c.phone || '').replace(/\D/g, '') || '9876543210',
        country: countries.includes(c.country) ? c.country : 'India',
        avatar: c.avatar || prev.avatar,
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

  const validateField = (field, value) => {
    switch (field) {
      case 'firstName':
        return value.trim().length === 0 ? 'First name is required' : ''
      case 'lastName':
        return value.trim().length === 0 ? 'Last name is required' : ''
      case 'userName':
        return value.trim().length === 0
          ? 'User name is required'
          : value.trim().length < 3
          ? 'User name must be at least 3 characters'
          : ''
      case 'email':
        if (value.trim().length === 0) return 'Email is required'
        if (!emailRegex.test(value)) return 'Enter a valid email address'
        return ''
      case 'contact':
        if (value.trim().length === 0) return 'Contact number is required'
        if (!phoneRegex.test(value)) return 'Enter a valid phone number (digits only)'
        return ''
      case 'address':
        return value.trim().length === 0 ? 'Address is required' : ''
      case 'pinCode':
        if (value.trim().length === 0) return 'Pin code is required'
        if (!pinRegex.test(value)) return 'Enter a valid pin code'
        return ''
      case 'city':
        return value.trim().length === 0 ? 'Please select a city' : ''
      case 'country':
        return value.trim().length === 0 ? 'Please select a country' : ''
      default:
        return ''
    }
  }

  const validateAll = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'userName',
      'email',
      'contact',
      'address',
      'pinCode',
      'city',
      'country',
    ]
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
      const firstErrorField = document.querySelector('[data-error="true"]')
      if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    await updateCustomerApi(id, {
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email.trim(),
      phone: form.contact.trim(),
      location: form.country,
    }).catch(() => null)

    const idx = initialCustomers.findIndex((c) => String(c.id) === String(id))
    if (idx !== -1) {
      initialCustomers[idx] = {
        ...initialCustomers[idx],
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.contact,
        country: form.country,
        avatar: pictureDeleted
          ? 'https://i.pravatar.cc/150?img=68'
          : form.avatar,
      }
    }
    navigate('/customer')
  }

  const handleDiscard = () => {
    navigate('/customer')
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Edit
        </Typography>
        <Breadcrumbs>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.secondary">Customer</Typography>
          <Typography color="text.primary">Edit</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Edit Customer
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={pictureDeleted ? undefined : form.avatar}
              alt={form.firstName}
              sx={{ width: 72, height: 72, bgcolor: 'grey.200' }}
            />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Personal Information</Typography>
              <Typography variant="body2" color="text.secondary">
                Add a profile picture (optional)
              </Typography>
            </Box>
          </Box>
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
              data-error={Boolean(errors.firstName)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Last Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              value={form.lastName}
              onChange={handleChange('lastName')}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
              data-error={Boolean(errors.lastName)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              User Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              value={form.userName}
              onChange={handleChange('userName')}
              error={Boolean(errors.userName)}
              helperText={errors.userName}
              data-error={Boolean(errors.userName)}
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
              data-error={Boolean(errors.email)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Contact <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl sx={{ width: 90 }}>
                <Select value={form.countryCode} onChange={handleChange('countryCode')}>
                  <MenuItem value="US">US</MenuItem>
                  <MenuItem value="UK">UK</MenuItem>
                  <MenuItem value="CA">CA</MenuItem>
                  <MenuItem value="PK">PK</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                value={form.contact}
                onChange={handleChange('contact')}
                error={Boolean(errors.contact)}
                helperText={errors.contact}
                data-error={Boolean(errors.contact)}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Typography sx={{ fontWeight: 700, mb: 2 }}>Address Information</Typography>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Address <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              value={form.address}
              onChange={handleChange('address')}
              error={Boolean(errors.address)}
              helperText={errors.address}
              data-error={Boolean(errors.address)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Pin Code <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              value={form.pinCode}
              onChange={handleChange('pinCode')}
              error={Boolean(errors.pinCode)}
              helperText={errors.pinCode}
              data-error={Boolean(errors.pinCode)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              City <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <FormControl fullWidth error={Boolean(errors.city)}>
              <Select value={form.city} onChange={handleChange('city')} data-error={Boolean(errors.city)}>
                {cities.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              {errors.city && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.city}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Country <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <FormControl fullWidth error={Boolean(errors.country)}>
              <Select
                value={form.country}
                onChange={handleChange('country')}
                data-error={Boolean(errors.country)}
              >
                {countries.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              {errors.country && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.country}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Typography sx={{ fontWeight: 700, mb: 2 }}>Additional Notes</Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Notes
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={form.notes}
            onChange={handleChange('notes')}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button color="error" onClick={handleDiscard}>
            Discard
          </Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </Box>
      </Card>
    </Box>
  )
}
