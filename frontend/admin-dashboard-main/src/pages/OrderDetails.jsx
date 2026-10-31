import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Typography,
  Breadcrumbs,
  Link,
  Avatar,
  Divider,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import { useParams } from 'react-router-dom'
import { fetchOrderById } from '../api.js'

const activity = [
  {
    date: 'Saturday, 10 January',
    events: [
      { time: '01:43 PM', title: 'Parcel has been delivered', subtitle: 'Recipient: Steve Sutton', link: true },
      { time: '09:02 AM', title: 'Parcel is out for delivery' },
      { time: '06:45 AM', title: 'Parcel has arrived at delivery station' },
    ],
  },
  {
    date: 'Friday, 09 January',
    events: [
      { time: '12:16 PM', title: 'Parcel has been picked up by courier' },
      { time: '09:32 AM', title: 'Seller is preparing to ship your parcel' },
    ],
  },
]

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    fetchOrderById(id).then((ord) => {
      if (ord) setOrder(ord)
    })
  }, [id])

  const subtotal = order ? order.subtotal : 0.0
  const shipping = order ? order.deliveryFee : 20.0
  const tax = order ? 0.0 : 105.0
  const total = order ? order.totalAmount : subtotal + shipping + tax

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Details
        </Typography>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon fontSize="small" />
          </Link>
          <Typography color="text.secondary">Order</Typography>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            Details
          </Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Order: #{order?.displayId || id || '790955'}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Products Ordered</Typography>
            <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2.5, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography>${shipping.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Tax</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ fontWeight: 700, mb: 2 }}>Activity</Typography>
            {activity.map((group) => (
              <Box key={group.date} sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, mb: 1.5 }}>{group.date}</Typography>
                <Box>
                  {group.events.map((ev, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 70 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                          {ev.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            bgcolor: '#fff',
                            mt: 0.3,
                          }}
                        />
                        {idx !== group.events.length - 1 && (
                          <Box sx={{ width: '1px', flex: 1, bgcolor: 'divider', minHeight: 28 }} />
                        )}
                      </Box>
                      <Box sx={{ pb: 3 }}>
                        {ev.link ? (
                          <Link underline="hover" sx={{ fontWeight: 600, cursor: 'pointer' }}>
                            {ev.title}
                          </Link>
                        ) : (
                          <Typography sx={{ fontWeight: 600 }}>{ev.title}</Typography>
                        )}
                        {ev.subtitle && (
                          <Typography variant="body2" color="text.secondary">
                            {ev.subtitle}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Customer Details</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 2 }}>
              <Avatar src="https://i.pravatar.cc/150?img=12" alt={order?.customerName || 'Joseph William'} />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{order?.customerName || 'Joseph William'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  @{String(order?.customerName || 'joseph_william').toLowerCase().replace(/\s+/g, '_')}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: 'primary.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PhoneIcon fontSize="small" color="primary" />
              </Box>
              <Typography variant="body2">{order?.customerPhone || '+1 5623598742'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: 'secondary.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <EmailIcon fontSize="small" color="secondary" />
              </Box>
              <Typography variant="body2">{order?.customerEmail || 'john.doe@example.com'}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography sx={{ fontWeight: 700, mb: 1 }}>Shipping Address</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {order?.shippingAddress || '123 Main Street, New York, 100011, US'}
            </Typography>

            <Typography sx={{ fontWeight: 700, mb: 1 }}>Billing Address</Typography>
            <Typography variant="body2" color="text.secondary">
              123 Main Street
              <br />
              New York
              <br />
              100011
              <br />
              us
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
