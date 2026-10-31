import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Button,
  Link,
  Divider,
  LinearProgress,
  Grid,
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { useSnackbar } from 'notistack'
import { apiSignup } from '../api.js'

const BerryLogo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="berryGradS1" x1="4" y1="4" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#26c6da" />
          <stop offset="100%" stopColor="#00897b" />
        </linearGradient>
        <linearGradient id="berryGradS2" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00acc1" />
          <stop offset="100%" stopColor="#00695c" />
        </linearGradient>
      </defs>
      <circle cx="17" cy="22" r="13" fill="url(#berryGradS1)" />
      <circle cx="25" cy="14" r="9" fill="url(#berryGradS2)" />
      <path d="M20 6c1.5-2 4-3 6.5-2.6" stroke="#43a047" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <ellipse cx="27" cy="4.5" rx="3.2" ry="2" fill="#66bb6a" transform="rotate(-25 27 4.5)" />
    </svg>
    <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1, color: '#1a2027' }}>
      BERRY
    </Typography>
  </Box>
)

function getPasswordStrength(password) {
  if (!password) return { label: '', value: 0, color: 'grey.300' }
  let score = 0
  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 1) return { label: 'Weak', value: 25, color: 'warning.main' }
  if (score <= 3) return { label: 'Normal', value: 60, color: 'primary.main' }
  return { label: 'Strong', value: 100, color: 'success.main' }
}

export default function Signup() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(true)
  const [errors, setErrors] = useState({})

  const strength = getPasswordStrength(password)

  const validate = () => {
    const newErrors = {}
    if (!firstName.trim()) newErrors.firstName = 'First name is required'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!email.trim()) {
      newErrors.email = 'Email / Username is required'
    } else if (email.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!agree) newErrors.agree = 'You must agree to the Terms & Conditions'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await apiSignup({
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim(),
        password,
      })
      sessionStorage.setItem('berry_last_signup_email', email.trim())
      enqueueSnackbar('Account created successfully! Please sign in.', { variant: 'success' })
      navigate('/login')
    } catch (err) {
      setErrors({ email: err.message || 'Registration failed' })
      enqueueSnackbar(err.message || 'Could not create account', { variant: 'error' })
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#eef2f6',
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 476,
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
        }}
      >
        <BerryLogo />

        <Typography variant="h4" sx={{ color: '#00695c', fontWeight: 700, textAlign: 'center', mt: 3 }}>
          Sign up
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 1 }}>
          Enter your details to continue
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', mt: 1, mb: 3 }}>
          Sign up with Email address
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Email Address / Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small">
                    {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {password && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1, mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={strength.value}
                sx={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': { bgcolor: strength.color, borderRadius: 3 },
                }}
              />
              <Typography variant="body2" sx={{ color: strength.color, fontWeight: 600, minWidth: 50 }}>
                {strength.label}
              </Typography>
            </Box>
          )}

          <FormControlLabel
            sx={{ mt: 1.5, mb: errors.agree ? 0 : 2 }}
            control={
              <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} size="small" />
            }
            label={
              <Typography variant="body2">
                Agree with{' '}
                <Link href="#" underline="always" sx={{ fontWeight: 600, color: '#00897b' }}>
                  Terms &amp; Condition.
                </Link>
              </Typography>
            }
          />
          {errors.agree && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mb: 2 }}>
              {errors.agree}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ py: 1.2, mb: 2, bgcolor: '#00897b', '&:hover': { bgcolor: '#00695c' } }}
          >
            Sign Up
          </Button>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 600, color: '#00897b' }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
