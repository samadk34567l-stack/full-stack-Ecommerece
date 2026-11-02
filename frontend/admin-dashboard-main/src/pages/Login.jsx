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
} from '@mui/material'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { useSnackbar } from 'notistack'
import { apiLogin } from '../api.js'

const BerryLogo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="berryGradL1" x1="4" y1="4" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#26c6da" />
          <stop offset="100%" stopColor="#00897b" />
        </linearGradient>
        <linearGradient id="berryGradL2" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00acc1" />
          <stop offset="100%" stopColor="#00695c" />
        </linearGradient>
      </defs>
      <circle cx="17" cy="22" r="13" fill="url(#berryGradL1)" />
      <circle cx="25" cy="14" r="9" fill="url(#berryGradL2)" />
      <path d="M20 6c1.5-2 4-3 6.5-2.6" stroke="#43a047" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <ellipse cx="27" cy="4.5" rx="3.2" ry="2" fill="#66bb6a" transform="rotate(-25 27 4.5)" />
    </svg>
    <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1, color: '#1a2027' }}>
      BERRY
    </Typography>
  </Box>
)

export default function Login() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [showPassword, setShowPassword] = useState(false)
  const savedSignupEmail = sessionStorage.getItem('berry_last_signup_email') || ''
  const [email, setEmail] = useState(savedSignupEmail || 'admin@example.com')
  const [password, setPassword] = useState(savedSignupEmail ? '' : 'password123')
  const [keepLoggedIn, setKeepLoggedIn] = useState(true)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = 'Email / Username is required'
    } else if (email.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      await apiLogin(email.trim(), password)
      localStorage.setItem('berry_keep_logged_in', keepLoggedIn ? 'true' : 'false')
      enqueueSnackbar('Signed in successfully!', { variant: 'success' })
      navigate('/admin')
      return
    } catch (err) {
      setErrors({ password: err.message || 'Invalid email/username or password' })
      enqueueSnackbar(err.message || 'Invalid credentials!', { variant: 'error' })
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
          Hi, Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 1, mb: 3 }}>
          Enter your credentials to continue
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
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
            sx={{ mb: 1.5 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  size="small"
                />
              }
              label={<Typography variant="body2">Keep me logged in</Typography>}
            />
            <Link href="#" underline="hover" variant="body2" sx={{ fontWeight: 600, color: '#00897b' }}>
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ py: 1.2, mb: 2, bgcolor: '#00897b', '&:hover': { bgcolor: '#00695c' } }}
          >
            Sign In
          </Button>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to="/signup" underline="hover" sx={{ fontWeight: 600, color: '#00897b' }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
