import React, { forwardRef } from 'react'
import { Box, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useSnackbar } from 'notistack'

const SuccessSnackbar = forwardRef(function SuccessSnackbar({ id, message }, ref) {
  const { closeSnackbar } = useSnackbar()

  return (
    <Box
      ref={ref}
      onClick={() => closeSnackbar(id)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        bgcolor: '#fff',
        borderRadius: 2.5,
        boxShadow: '0 8px 24px rgba(0,0,0,0.14)',
        px: 2.5,
        py: 1.5,
        minWidth: 280,
        cursor: 'pointer',
        borderLeft: '4px solid',
        borderColor: 'success.main',
        animation: 'toastSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        '@keyframes toastSlideIn': {
          '0%': { opacity: 0, transform: 'translateX(24px) scale(0.95)' },
          '100%': { opacity: 1, transform: 'translateX(0) scale(1)' },
        },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          minWidth: 32,
          borderRadius: '50%',
          bgcolor: 'success.light',
          color: 'success.dark',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'tickPop 0.4s ease 0.1s backwards',
          '@keyframes tickPop': {
            '0%': { transform: 'scale(0)' },
            '60%': { transform: 'scale(1.2)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      >
        <CheckIcon sx={{ fontSize: 20 }} />
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
        {message}
      </Typography>
    </Box>
  )
})

export default SuccessSnackbar
