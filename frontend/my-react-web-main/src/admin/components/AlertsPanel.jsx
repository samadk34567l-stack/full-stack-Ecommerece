import React from 'react'
import { Card, CardContent, Box, Typography, IconButton, Chip, Divider } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const severityStyles = {
  high: { bg: '#ffebee', color: '#c62828', label: 'Urgent' },
  medium: { bg: '#fff8e1', color: '#f9a825', label: 'Pending' },
  low: { bg: '#e0f2f1', color: '#00897b', label: 'Info' },
}

const alerts = [
  {
    icon: <Inventory2OutlinedIcon />,
    iconBg: '#ffebee',
    iconColor: '#e53935',
    title: 'Low stock warning',
    detail: '"Vertex Wireless Mouse" has only 4 units left',
    severity: 'high',
    time: '10 min ago',
  },
  {
    icon: <FactCheckOutlinedIcon />,
    iconBg: '#fff8e1',
    iconColor: '#f9a825',
    title: 'Approval pending',
    detail: '3 vendor invoices are awaiting your approval',
    severity: 'medium',
    time: '32 min ago',
  },
  {
    icon: <PaymentsOutlinedIcon />,
    iconBg: '#ffebee',
    iconColor: '#e53935',
    title: 'Payment overdue',
    detail: 'Invoice #IN-2049 is 5 days past due',
    severity: 'high',
    time: '1 hr ago',
  },
  {
    icon: <PersonAddAltOutlinedIcon />,
    iconBg: '#e0f2f1',
    iconColor: '#00897b',
    title: 'New customer request',
    detail: 'Sana Malik requested a new account approval',
    severity: 'low',
    time: '2 hr ago',
  },
  {
    icon: <ErrorOutlineOutlinedIcon />,
    iconBg: '#fff8e1',
    iconColor: '#f9a825',
    title: 'Order needs review',
    detail: 'Order #790961 flagged for address mismatch',
    severity: 'medium',
    time: '3 hr ago',
  },
]

export default function AlertsPanel() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Alerts &amp; Notifications
            </Typography>
            <Chip
              label={`${alerts.length} New`}
              size="small"
              sx={{ bgcolor: '#e0f2f1', color: '#00695c', fontWeight: 700, height: 22 }}
            />
          </Box>
          <IconButton size="small">
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>

        {alerts.map((a, i) => (
          <Box key={a.title + i}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.4 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: a.iconBg,
                  color: a.iconColor,
                  flexShrink: 0,
                }}
              >
                {React.cloneElement(a.icon, { fontSize: 'small' })}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {a.title}
                  </Typography>
                  <Chip
                    label={severityStyles[a.severity].label}
                    size="small"
                    sx={{
                      bgcolor: severityStyles[a.severity].bg,
                      color: severityStyles[a.severity].color,
                      fontWeight: 600,
                      fontSize: 11,
                      height: 20,
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                  {a.detail}
                </Typography>
                <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mt: 0.3 }}>
                  {a.time}
                </Typography>
              </Box>
            </Box>
            {i < alerts.length - 1 && <Divider />}
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#00897b',
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              cursor: 'pointer',
            }}
          >
            View All Alerts
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
