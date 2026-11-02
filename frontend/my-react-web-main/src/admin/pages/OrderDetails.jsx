import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Typography,
  Breadcrumbs,
  Link,
  Avatar,
  Divider,
  Select,
  MenuItem,
  Button,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useParams, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { fetchOrderById, updateOrderApi, deleteOrderApi } from '../api.js'

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    fetchOrderById(id).then((ord) => {
      if (ord) setOrder(ord)
    })
  }, [id])

  if (!order) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Loading order details...</Typography>
      </Box>
    )
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await updateOrderApi(order.id, { status: newStatus })
      setOrder((prev) => ({ ...prev, ...updated, rawStatus: newStatus }))
      enqueueSnackbar(`Order status updated to ${newStatus}!`, { variant: 'success' })
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to update status', { variant: 'error' })
    }
  }

  const handleDelete = async () => {
    const ok = await deleteOrderApi(order.id)
    if (ok) {
      enqueueSnackbar('Order deleted from database!', { variant: 'success' })
      navigate('/order')
    } else {
      enqueueSnackbar('Failed to delete order', { variant: 'error' })
    }
  }

  const subtotal = order.subtotal || 0.0
  const shipping = order.deliveryFee || 0.0
  const discount = order.discountAmount || 0.0
  const total = order.totalAmount || subtotal - discount + shipping
  const currentStatus = order.rawStatus || order.status || 'Pending'

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Order Details
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditOutlinedIcon />}
            onClick={() => navigate(`/order/edit/${order.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteOutlineIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate('/admin')}
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <HomeIcon fontSize="small" />
            </Link>
            <Link underline="hover" color="inherit" onClick={() => navigate('/order')} sx={{ cursor: 'pointer' }}>
              Order
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 600 }}>
              Details
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Order: #{order.displayId || order.id}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Status:
            </Typography>
            <Select
              size="small"
              value={
                ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(currentStatus)
                  ? currentStatus
                  : 'Pending'
              }
              onChange={(e) => handleStatusChange(e.target.value)}
              sx={{ fontWeight: 600, minWidth: 135 }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          <Box>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Products Ordered</Typography>
            {order.items?.length > 0 && (
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, mb: 2 }}>
                {order.items.map((item, idx) => (
                  <Box
                    key={item._id || idx}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: idx < order.items.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {item.image && (
                        <Avatar src={item.image} alt={item.name} variant="rounded" sx={{ width: 44, height: 44 }} />
                      )}
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty: {item.quantity || 1}
                          {item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}
                          {item.selectedColor ? ` • Color: ${item.selectedColor}` : ''}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontWeight: 700 }}>
                      ${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2.5, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              {discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="text.secondary">Discount</Typography>
                  <Typography color="error.main">-${discount.toFixed(2)}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography>${shipping.toFixed(2)}</Typography>
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

            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Order Information</Typography>
            <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2.5 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Order Date:</strong> {order.orderDate}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Payment Method:</strong> {order.paymentType}
              </Typography>
              <Typography variant="body2">
                <strong>Order Status:</strong> {currentStatus}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Customer Details</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 2 }}>
              <Avatar alt={order.customerName}>
                {(order.customerName || 'C').charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{order.customerName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.customerEmail}
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
              <Typography variant="body2">{order.customerPhone || 'N/A'}</Typography>
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
              <Typography variant="body2">{order.customerEmail}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography sx={{ fontWeight: 700, mb: 1 }}>Shipping Address</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {order.shippingAddress || 'N/A'}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
