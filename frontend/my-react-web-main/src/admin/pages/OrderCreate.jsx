import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Breadcrumbs,
  Link,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Divider,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Avatar,
  Pagination,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CheckIcon from '@mui/icons-material/Check'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { fetchCatalogProducts, createOrderApi } from '../api.js'

const countries = ['Pakistan', 'United States', 'Canada', 'United Kingdom', 'India', 'Australia', 'Germany']
const cities = ['Karachi', 'Lahore', 'Islamabad', 'New York', 'Toronto', 'London', 'Mumbai', 'Sydney', 'Berlin']
const paymentMethods = ['Cash on Delivery', 'Online Payment', 'Card', 'COD', 'UPI', 'PayPal']
const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function OrderCreate() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [productSearch, setProductSearch] = useState('')
  const [catalogProducts, setCatalogProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [dialogSearch, setDialogSearch] = useState('')
  const [dialogPage, setDialogPage] = useState(1)
  const productsPerPage = 6

  useEffect(() => {
    fetchCatalogProducts().then((list) => {
      setCatalogProducts(list || [])
    })
  }, [])

  const [firstName, setFirstName] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [pinCode, setPinCode] = useState('')
  const [city, setCity] = useState('Karachi')
  const [country, setCountry] = useState('Pakistan')
  const [payment, setPayment] = useState('Cash on Delivery')
  const [status, setStatus] = useState('Pending')
  const [errors, setErrors] = useState({})
  const [productError, setProductError] = useState('')

  const validators = {
    firstName: (v) => (!v.trim() ? 'Customer name is required' : ''),
    email: (v) =>
      !v.trim()
        ? 'Email is required'
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? ''
        : 'Enter a valid email address',
    phone: (v) => (!v.trim() ? 'Phone number is required' : ''),
    address: (v) => (!v.trim() ? 'Address is required' : ''),
  }

  const fieldValues = { firstName, email, phone, address }

  const validateField = (name, value) => {
    if (!validators[name]) return ''
    const message = validators[name](value)
    setErrors((prev) => ({ ...prev, [name]: message }))
    return message
  }

  const validateAll = () => {
    const newErrors = {}
    Object.keys(validators).forEach((name) => {
      const message = validators[name](fieldValues[name])
      if (message) newErrors[name] = message
    })
    setErrors(newErrors)

    const productMsg = selectedProducts.length === 0 ? 'Please select at least one product' : ''
    setProductError(productMsg)

    return Object.keys(newErrors).length === 0 && !productMsg
  }

  const filteredProducts = catalogProducts.filter(
    (p) =>
      !selectedProducts.some((sp) => sp.id === p.id) &&
      p.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  const addProduct = (product) => {
    setSelectedProducts((prev) => [...prev, { ...product, quantity: 1 }])
    setProductSearch('')
    setProductError('')
  }

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const toggleProductInDialog = (product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      if (exists) {
        return prev.filter((p) => p.id !== product.id)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setProductError('')
  }

  const dialogFilteredProducts = catalogProducts.filter((p) =>
    p.name.toLowerCase().includes(dialogSearch.toLowerCase())
  )
  const dialogPageCount = Math.max(1, Math.ceil(dialogFilteredProducts.length / productsPerPage))
  const dialogPagedProducts = dialogFilteredProducts.slice(
    (dialogPage - 1) * productsPerPage,
    dialogPage * productsPerPage
  )

  const openProductDialog = () => {
    setDialogSearch('')
    setDialogPage(1)
    setProductDialogOpen(true)
  }

  const updateQuantity = (id, qty) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p))
    )
  }

  const total = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0)

  const handleAdd = async () => {
    if (!validateAll()) return
    const fullAddress = [address.trim(), city, country, pinCode.trim() ? `- ${pinCode.trim()}` : '']
      .filter(Boolean)
      .join(', ')
    try {
      await createOrderApi({
        customerName: firstName.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        shippingAddress: fullAddress,
        paymentMethod: payment || 'Cash on Delivery',
        status: status || 'Pending',
        items: selectedProducts.map((p) => ({
          productId: p._id || p.id,
          name: p.name,
          price: p.price,
          quantity: p.quantity,
          image: p.image || '',
        })),
      })
      enqueueSnackbar('Order created in database!', { variant: 'success' })
      navigate('/order')
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to create order in database', { variant: 'error' })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Create Order
        </Typography>
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
            Create
          </Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Select Product
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Autocomplete
            freeSolo
            options={filteredProducts}
            getOptionLabel={(o) => (typeof o === 'string' ? o : o.name)}
            inputValue={productSearch}
            onInputChange={(e, val) => setProductSearch(val)}
            onChange={(e, val) => {
              if (val && typeof val !== 'string') addProduct(val)
            }}
            sx={{ width: { xs: '100%', sm: 320 } }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Search Product"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={openProductDialog}>
            Add Product
          </Button>
        </Box>
        {productError && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
            {productError}
          </Typography>
        )}

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={p.image} alt={p.name} variant="rounded" sx={{ width: 38, height: 38 }} />
                      {p.name}
                    </Box>
                  </TableCell>
                  <TableCell>#{p.code || String(p.id).slice(-6)}</TableCell>
                  <TableCell>${Number(p.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      value={p.quantity}
                      onChange={(e) => updateQuantity(p.id, Number(e.target.value))}
                      sx={{ width: 80 }}
                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => removeProduct(p.id)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>No products selected yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Click &quot;Add Product&quot; or search above to select items from the database.
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Subtotal: ${total.toFixed(2)} (+ $15 Delivery)
          </Typography>
        </Box>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Customer Details
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Customer Name <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter customer full name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                if (errors.firstName) validateField('firstName', e.target.value)
              }}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              User Name (Optional)
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter user name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Email <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter customer email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) validateField('email', e.target.value)
              }}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Phone Number <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="03001234567"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                if (errors.phone) validateField('phone', e.target.value)
              }}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
            />
          </Box>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Address Information
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Shipping Address <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter shipping address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              if (errors.address) validateField('address', e.target.value)
            }}
            error={Boolean(errors.address)}
            helperText={errors.address}
          />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Pin Code
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="75500"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              City
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={city} onChange={(e) => setCity(e.target.value)}>
                {cities.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Country
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={country} onChange={(e) => setCountry(e.target.value)}>
                {countries.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Payment &amp; Status
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Payment Method
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CreditCardIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                {paymentMethods.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Order Status
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {orderStatuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button color="error" onClick={() => navigate('/order')}>
            Discard
          </Button>
          <Button variant="contained" onClick={handleAdd}>
            Create Order
          </Button>
        </Box>
      </Card>

      <Dialog
        open={productDialogOpen}
        onClose={() => setProductDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                All Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add products to this order.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={() => setProductDialogOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Done
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search product"
            value={dialogSearch}
            onChange={(e) => {
              setDialogSearch(e.target.value)
              setDialogPage(1)
            }}
            sx={{ mb: 1, mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'grey.50' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'grey.500' }} />
                </InputAdornment>
              ),
            }}
          />

          {dialogPagedProducts.map((product) => {
            const checked = selectedProducts.some((p) => p.id === product.id)
            return (
              <Box
                key={product.id}
                onClick={() => toggleProductInDialog(product)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:last-of-type': { borderBottom: 'none' },
                }}
              >
                <Checkbox checked={checked} onClick={(e) => e.stopPropagation()} onChange={() => toggleProductInDialog(product)} />
                <Avatar src={product.image} variant="rounded" sx={{ width: 40, height: 40, mr: 1.5 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ${Number(product.price).toFixed(2)} • {product.category}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  #{product.code}
                </Typography>
              </Box>
            )
          })}

          {dialogPagedProducts.length === 0 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No products found.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 1.5 }}>
          <Button
            startIcon={<ArrowBackIcon fontSize="small" />}
            disabled={dialogPage === 1}
            onClick={() => setDialogPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Pagination
            count={dialogPageCount}
            page={dialogPage}
            onChange={(e, value) => setDialogPage(value)}
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
          />
          <Button
            endIcon={<ArrowForwardIcon fontSize="small" />}
            disabled={dialogPage === dialogPageCount}
            onClick={() => setDialogPage((p) => Math.min(dialogPageCount, p + 1))}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
