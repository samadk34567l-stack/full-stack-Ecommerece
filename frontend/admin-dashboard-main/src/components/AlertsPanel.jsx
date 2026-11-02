import React, { useState, useEffect } from 'react'
import { Card, CardContent, Box, Typography, IconButton, Chip, Divider } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useNavigate } from 'react-router-dom'
import { fetchOrders } from '../api.js'

export default function AlertsPanel() {
  const [recentOrders, setRecentOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders().then((list) => {
      setRecentOrders((list || []).slice(0, 5))
    })
  }, [])

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Recent Orders (Database)
            </Typography>
            <Chip
              label={`${recentOrders.length} Orders`}
              size="small"
              sx={{ bgcolor: '#e0f2f1', color: '#00695c', fontWeight: 700, height: 22 }}
            />
          </Box>
          <IconButton size="small">
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        </Box>

        {recentOrders.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
            No orders placed yet.
          </Typography>
        ) : (
          recentOrders.map((ord, i) => (
            <Box key={ord.id || i}>
              <Box
                onClick={() => navigate(`/order/details/${ord.id}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  py: 1.4,
                  cursor: 'pointer',
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#e0f2f1',
                    color: '#00897b',
                    flexShrink: 0,
                  }}
                >
                  <FactCheckOutlinedIcon fontSize="small" />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Order #{ord.displayId} — {ord.customerName}
                    </Typography>
                    <Chip
                      label={`$${ord.totalAmount}`}
                      size="small"
                      sx={{
                        bgcolor: '#e0f2f1',
                        color: '#00897b',
                        fontWeight: 600,
                        fontSize: 11,
                        height: 20,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
                    {ord.customerEmail} • {ord.quantity} item(s) • {ord.paymentType}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'grey.500', display: 'block', mt: 0.3 }}>
                    {ord.orderDate} ({ord.rawStatus || ord.status})
                  </Typography>
                </Box>
              </Box>
              {i < recentOrders.length - 1 && <Divider />}
            </Box>
          ))
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
          <Box
            onClick={() => navigate('/order')}
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
            View All Orders
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
