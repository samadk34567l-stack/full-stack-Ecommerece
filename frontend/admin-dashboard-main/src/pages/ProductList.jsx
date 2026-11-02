import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  Select,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import StarIcon from '@mui/icons-material/Star'
import { useSnackbar } from 'notistack'
import {
  fetchCatalogProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from '../api.js'

const CATEGORIES = ['T-shirts', 'Shirts', 'Jeans', 'Shorts', 'Hoodies', 'Jackets', 'Pants']
const DRESS_STYLES = ['Casual', 'Formal', 'Party', 'Gym']
const DEFAULT_SIZES = ['Small', 'Medium', 'Large', 'X-Large']
const DEFAULT_COLORS = ['#000000', '#31344F', '#2e4a3d']

const emptyProductForm = {
  name: '',
  price: '',
  originalPrice: '',
  discount: 0,
  rating: 4.5,
  category: 'T-shirts',
  dressStyle: 'Casual',
  image: '/image-1.png',
  colors: DEFAULT_COLORS.join(', '),
  sizes: DEFAULT_SIZES.join(', '),
  description: '',
  inStock: true,
  isNewArrival: true,
  isTopSelling: false,
}

export default function ProductList() {
  const { enqueueSnackbar } = useSnackbar()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuRow, setMenuRow] = useState(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyProductForm)

  const loadProducts = () => {
    setLoading(true)
    fetchCatalogProducts()
      .then((list) => {
        setProducts(list || [])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.dressStyle?.toLowerCase().includes(search.toLowerCase())
  )
  const pageRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const toggleOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    const pageIds = pageRows.map((r) => r.id)
    const allSelected = pageIds.every((id) => selected.includes(id))
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...pageIds])))
    }
  }

  const deleteSelected = async () => {
    await Promise.all(selected.map((id) => deleteProductApi(id)))
    setProducts((prev) => prev.filter((p) => !selected.includes(p.id)))
    setSelected([])
    enqueueSnackbar('Selected products deleted from MongoDB!', { variant: 'success' })
  }

  const deleteOne = async (id) => {
    await deleteProductApi(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setSelected((prev) => prev.filter((x) => x !== id))
    setMenuAnchor(null)
    enqueueSnackbar('Product deleted from MongoDB!', { variant: 'success' })
  }

  const openAddDialog = () => {
    setEditingId(null)
    setForm(emptyProductForm)
    setDialogOpen(true)
  }

  const openEditDialog = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      price: product.price ?? '',
      originalPrice: product.originalPrice ?? '',
      discount: product.discount ?? 0,
      rating: product.rating ?? 4.5,
      category: product.category || 'T-shirts',
      dressStyle: product.dressStyle || 'Casual',
      image: product.image || '/image-1.png',
      colors: Array.isArray(product.colors) && product.colors.length > 0
        ? product.colors.join(', ')
        : DEFAULT_COLORS.join(', '),
      sizes: Array.isArray(product.sizes) && product.sizes.length > 0
        ? product.sizes.join(', ')
        : DEFAULT_SIZES.join(', '),
      description: product.description || '',
      inStock: product.inStock !== false,
      isNewArrival: Boolean(product.isNewArrival),
      isTopSelling: Boolean(product.isTopSelling),
    })
    setMenuAnchor(null)
    setDialogOpen(true)
  }

  const handleSaveProduct = async () => {
    if (!form.name.trim() || !form.price) {
      enqueueSnackbar('Product name and price are required', { variant: 'error' })
      return
    }
    const imgPath = form.image.trim() || '/image-1.png'
    const parsedColors = String(form.colors || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const parsedSizes = String(form.sizes || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      discount: Number(form.discount) || 0,
      rating: Math.min(5, Math.max(1, Number(form.rating) || 4.5)),
      category: form.category,
      dressStyle: form.dressStyle,
      image: imgPath,
      images: [imgPath, imgPath, imgPath],
      colors: parsedColors.length > 0 ? parsedColors : DEFAULT_COLORS,
      sizes: parsedSizes.length > 0 ? parsedSizes : DEFAULT_SIZES,
      description: form.description.trim(),
      inStock: Boolean(form.inStock),
      isNewArrival: Boolean(form.isNewArrival),
      isTopSelling: Boolean(form.isTopSelling),
    }

    try {
      if (editingId) {
        await updateProductApi(editingId, payload)
        enqueueSnackbar('Product updated in MongoDB!', { variant: 'success' })
      } else {
        await createProductApi(payload)
        enqueueSnackbar('Product added to MongoDB!', { variant: 'success' })
      }
      setDialogOpen(false)
      loadProducts()
    } catch (err) {
      enqueueSnackbar(err.message || 'Failed to save product', { variant: 'error' })
    }
  }

  const allOnPageSelected =
    pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id))

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Products ({products.length})
        </Typography>
        <Breadcrumbs>
          <Link underline="hover" color="inherit" href="/admin">
            Dashboard
          </Link>
          <Typography color="text.primary">Products</Typography>
        </Breadcrumbs>
      </Box>

      <Card sx={{ p: 3 }}>
        {selected.length > 0 ? (
          <Toolbar disableGutters sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 600 }}>{selected.length} selected</Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={deleteSelected}
            >
              Delete
            </Button>
          </Toolbar>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              mb: 2,
              gap: 2,
            }}
          >
            <TextField
              size="small"
              placeholder="Search products by name, category, dress style..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 360 } }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
            >
              Add New Product
            </Button>
          </Box>
        )}

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allOnPageSelected}
                    indeterminate={
                      pageRows.some((r) => selected.includes(r.id)) && !allOnPageSelected
                    }
                    onChange={toggleAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category &amp; Style</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Colors &amp; Sizes</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Section</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((p) => (
                <TableRow key={p.id} hover selected={selected.includes(p.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(p.id)}
                      onChange={() => toggleOne(p.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={p.image} alt={p.name} variant="rounded" sx={{ width: 48, height: 48 }} />
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>{p.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: #{p.code}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {p.category}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {p.dressStyle}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700 }}>${Number(p.price || 0).toFixed(2)}</Typography>
                    {p.originalPrice && (
                      <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through', mr: 0.5 }}>
                        ${Number(p.originalPrice).toFixed(2)}
                      </Typography>
                    )}
                    {p.discount > 0 && (
                      <Chip
                        label={`-${p.discount}%`}
                        size="small"
                        sx={{ bgcolor: '#ffebee', color: '#c62828', height: 18, fontSize: 10, fontWeight: 700 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                      {(p.colors || DEFAULT_COLORS).map((c, idx) => (
                        <Box
                          key={c + idx}
                          sx={{
                            width: 14,
                            height: 14,
                            borderRadius: '50%',
                            bgcolor: c,
                            border: '1px solid rgba(0,0,0,0.2)',
                          }}
                          title={c}
                        />
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {(p.sizes || DEFAULT_SIZES).join(', ')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                      <StarIcon sx={{ fontSize: 16, color: '#ffc107' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {Number(p.rating || 4.5).toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({p.reviewsCount ?? p.reviews?.length ?? 0})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {p.isNewArrival && (
                        <Chip
                          label="New Arrival"
                          size="small"
                          sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600, fontSize: 11 }}
                        />
                      )}
                      {p.isTopSelling && (
                        <Chip
                          label="Top Selling"
                          size="small"
                          sx={{ bgcolor: '#fff8e1', color: '#ef6c00', fontWeight: 600, fontSize: 11 }}
                        />
                      )}
                      {!p.isNewArrival && !p.isTopSelling && (
                        <Typography variant="caption" color="text.secondary">
                          Catalog
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={p.inStock ? 'In Stock' : 'Out of Stock'}
                      size="small"
                      sx={{
                        backgroundColor: p.inStock ? '#e6f4ea' : '#fdeaea',
                        color: p.inStock ? '#1e7e34' : '#c62828',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setMenuAnchor(e.currentTarget)
                        setMenuRow(p)
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    {loading ? 'Loading products from MongoDB...' : 'No products found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => menuRow && openEditDialog(menuRow)}>Edit</MenuItem>
          <MenuItem sx={{ color: 'error.main' }} onClick={() => menuRow && deleteOne(menuRow.id)}>
            Delete
          </MenuItem>
        </Menu>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Rows per page:
          </Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setPage(1)
            }}
            sx={{ minWidth: 70 }}
          >
            <MenuItem value={7}>7</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
          <Typography variant="body2" color="text.secondary">
            {filtered.length === 0
              ? '0 of 0'
              : `${(page - 1) * rowsPerPage + 1}-${Math.min(page * rowsPerPage, filtered.length)} of ${filtered.length}`}
          </Typography>
          <IconButton
            size="small"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {'<'}
          </IconButton>
          <IconButton
            size="small"
            disabled={page * rowsPerPage >= filtered.length}
            onClick={() => setPage((p) => p + 1)}
          >
            {'>'}
          </IconButton>
        </Box>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingId ? 'Edit Product (MongoDB)' : 'Add New Product (MongoDB)'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Product Name *"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Price ($) *"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Original Price ($)"
                value={form.originalPrice}
                onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Discount (%)"
                value={form.discount}
                onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Dress Style</InputLabel>
                <Select
                  label="Dress Style"
                  value={form.dressStyle}
                  onChange={(e) => setForm((f) => ({ ...f, dressStyle: e.target.value }))}
                >
                  {DRESS_STYLES.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Colors (comma-separated hex)"
                value={form.colors}
                onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Sizes (comma-separated)"
                value={form.sizes}
                onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Image Path or URL (e.g. /image-1.png)"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                label="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.inStock}
                    onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
                  />
                }
                label="In Stock"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isNewArrival}
                    onChange={(e) => setForm((f) => ({ ...f, isNewArrival: e.target.checked }))}
                  />
                }
                label="New Arrival"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isTopSelling}
                    onChange={(e) => setForm((f) => ({ ...f, isTopSelling: e.target.checked }))}
                  />
                }
                label="Top Selling"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveProduct}>
            {editingId ? 'Update Product' : 'Save Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
