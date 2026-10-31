import React from 'react'
import { Card, Box, Typography, IconButton, Avatar } from '@mui/material'
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

export default function EarningCard({ amount }) {
  const displayAmount =
    amount !== undefined && amount !== null
      ? `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '$8,450.00'
  return (
    <Card
      sx={{
        height: '100%',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(210.04deg, #ef5350 -50.94%, #ff8a65 95.49%)',
      }}
    >
      <Box sx={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', top: -60, right: -40, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', bottom: -50, right: 30, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ p: 2.5, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', width: 44, height: 44 }}>
            <LocalAtmOutlinedIcon />
          </Avatar>
          <IconButton size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.15)' }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{displayAmount}</Typography>
          <Avatar sx={{ width: 20, height: 20, bgcolor: 'rgba(255,255,255,0.25)' }}>
            <ArrowUpwardIcon sx={{ fontSize: 12 }} />
          </Avatar>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>Monthly Revenue</Typography>
      </Box>
    </Card>
  )
}
