import React from 'react'
import { Card, Box, Typography, Avatar } from '@mui/material'
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth'

export default function IncomeCard({ dark = true, icon, value = '$45.2k', label = 'Total Income' }) {
  return (
    <Card
      sx={{
        height: '100%',
        color: dark ? '#fff' : 'text.primary',
        bgcolor: dark ? '#f9a825' : '#fff',
        border: dark ? 'none' : '1px solid',
        borderColor: 'grey.200',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {!dark && (
        <Box
          sx={{
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: '50%',
            bottom: -60,
            right: -30,
            bgcolor: 'warning.light',
            opacity: 0.5,
          }}
        />
      )}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
        <Avatar
          sx={{
            bgcolor: dark ? 'rgba(255,255,255,0.2)' : 'warning.light',
            color: dark ? '#fff' : 'warning.dark',
            width: 40,
            height: 40,
          }}
        >
          {icon || <CalendarViewMonthIcon fontSize="small" />}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
          <Typography variant="body2" sx={{ opacity: dark ? 0.85 : 0.7 }}>
            {label}
          </Typography>
        </Box>
      </Box>
    </Card>
  )
}
