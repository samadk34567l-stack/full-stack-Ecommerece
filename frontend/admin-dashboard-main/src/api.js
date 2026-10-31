import { initialCustomers } from './data/customers.js'
import { initialOrders, sampleProducts } from './data/orders.js'
import { users as staticUsers } from './data/users.js'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

let tokenPromise = null

export async function ensureAdminToken() {
  const existing = localStorage.getItem('berry_token')
  if (existing) return existing

  if (!tokenPromise) {
    tokenPromise = fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password123',
      }),
    })
      .then(async (res) => {
        if (!res.ok) return null
        const data = await res.json()
        if (data?.token) {
          localStorage.setItem('berry_token', data.token)
          localStorage.setItem('berry_current_user', JSON.stringify(data))
          localStorage.setItem('berry_is_logged_in', 'true')
          return data.token
        }
        return null
      })
      .catch(() => null)
      .finally(() => {
        tokenPromise = null
      })
  }
  return tokenPromise
}

async function authHeaders() {
  const token = await ensureAdminToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

// --- AUTH ---
export async function apiLogin(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Invalid credentials')
  if (data.token) {
    localStorage.setItem('berry_token', data.token)
    localStorage.setItem('berry_current_user', JSON.stringify(data))
    localStorage.setItem('berry_is_logged_in', 'true')
  }
  return data
}

export async function apiSignup({ name, email, password, phone }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Signup failed')
  if (data.token) {
    localStorage.setItem('berry_token', data.token)
    localStorage.setItem('berry_current_user', JSON.stringify(data))
  }
  return data
}

// --- DASHBOARD ---
export async function fetchDashboardStats() {
  try {
    const headers = await authHeaders()
    const res = await fetch(`${API_URL}/orders/dashboard/stats`, { headers })
    if (!res.ok) throw new Error('Failed to load stats')
    return await res.json()
  } catch {
    return null
  }
}

// --- CUSTOMERS ---
export function normalizeCustomer(c, index = 0) {
  if (!c) return null
  return {
    ...c,
    id: String(c._id || c.id),
    _id: c._id || null,
    name: c.name || 'Unknown Customer',
    email: c.email || '',
    phone: c.phone || '',
    country: c.location || c.country || 'India',
    company: c.company || '',
    status: c.status === 'Blocked' ? 'Inactive' : c.status || 'Active',
    totalOrders: Number(c.totalOrders) || 0,
    totalSpent: Number(c.totalSpent) || 0,
    avatar: c.avatar || `https://i.pravatar.cc/150?img=${(index % 60) + 1}`,
  }
}

export async function fetchCustomers() {
  try {
    const headers = await authHeaders()
    const res = await fetch(`${API_URL}/customers`, { headers })
    if (!res.ok) throw new Error('Failed to fetch customers')
    const data = await res.json()
    if (Array.isArray(data)) {
      return data.map((c, idx) => normalizeCustomer(c, idx))
    }
  } catch (err) {
    console.warn('Using fallback customers:', err.message)
  }
  return initialCustomers
}

export async function fetchCustomerById(id) {
  try {
    if (/^[0-9a-fA-F]{24}$/.test(String(id))) {
      const headers = await authHeaders()
      const res = await fetch(`${API_URL}/customers/${id}`, { headers })
      if (res.ok) {
        return normalizeCustomer(await res.json())
      }
    }
  } catch {
    // fallback below
  }
  const all = await fetchCustomers()
  return all.find((c) => String(c.id) === String(id)) || initialCustomers[0]
}

export async function createCustomerApi(payload) {
  const headers = await authHeaders()
  const res = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create customer')
  return normalizeCustomer(data)
}

export async function updateCustomerApi(id, payload) {
  if (!/^[0-9a-fA-F]{24}$/.test(String(id))) {
    return payload
  }
  const headers = await authHeaders()
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update customer')
  return normalizeCustomer(data)
}

export async function deleteCustomerApi(id) {
  if (!/^[0-9a-fA-F]{24}$/.test(String(id))) return true
  const headers = await authHeaders()
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: 'DELETE',
    headers,
  })
  return res.ok
}

// --- ORDERS ---
function mapOrderStatusToUi(status) {
  if (status === 'Delivered' || status === 'Complete') return 'Complete'
  if (status === 'Cancelled' || status === 'Cancel') return 'Cancel'
  if (status === 'Processing' || status === 'Shipped' || status === 'Hold') return 'Hold'
  return 'Pending'
}

export function normalizeOrder(o) {
  if (!o) return null
  const id = String(o._id || o.id)
  const items = Array.isArray(o.items) ? o.items : []
  const totalQty =
    items.length > 0
      ? items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0)
      : Number(o.quantity) || 1

  const dateStr =
    o.orderDate ||
    (o.createdAt
      ? new Date(o.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Today')

  return {
    ...o,
    id,
    _id: o._id || null,
    displayId: id.length === 24 ? id.slice(-6).toUpperCase() : id,
    customerName: o.customerName || 'Guest Customer',
    customerEmail: o.customerEmail || 'customer@example.com',
    customerPhone: o.customerPhone || '',
    shippingAddress: o.shippingAddress || o.branch || 'Main Branch',
    branch: o.shippingAddress || o.branch || 'Main Branch',
    paymentType: o.paymentMethod || o.paymentType || 'COD',
    quantity: totalQty,
    orderDate: dateStr,
    status: mapOrderStatusToUi(o.status),
    rawStatus: o.status || 'Pending',
    subtotal: Number(o.subtotal) || 0,
    deliveryFee: Number(o.deliveryFee) || 15,
    discountAmount: Number(o.discountAmount) || 0,
    totalAmount: Number(o.totalAmount) || 0,
    items,
  }
}

export async function fetchOrders() {
  try {
    const headers = await authHeaders()
    const res = await fetch(`${API_URL}/orders`, { headers })
    if (!res.ok) throw new Error('Failed to fetch orders')
    const data = await res.json()
    if (Array.isArray(data)) {
      return data.map(normalizeOrder)
    }
  } catch (err) {
    console.warn('Using fallback orders:', err.message)
  }
  return initialOrders.map(normalizeOrder)
}

export async function fetchOrderById(id) {
  try {
    if (/^[0-9a-fA-F]{24}$/.test(String(id))) {
      const headers = await authHeaders()
      const res = await fetch(`${API_URL}/orders/${id}`, { headers })
      if (res.ok) {
        return normalizeOrder(await res.json())
      }
    }
  } catch {
    // fallback
  }
  const all = await fetchOrders()
  return all.find((o) => String(o.id) === String(id)) || normalizeOrder(initialOrders[0])
}

export async function createOrderApi(payload) {
  const headers = await authHeaders()
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to create order')
  return normalizeOrder(data)
}

export async function updateOrderApi(id, payload) {
  if (!/^[0-9a-fA-F]{24}$/.test(String(id))) return payload
  const headers = await authHeaders()
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update order')
  return normalizeOrder(data)
}

export async function deleteOrderApi(id) {
  if (!/^[0-9a-fA-F]{24}$/.test(String(id))) return true
  const headers = await authHeaders()
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: 'DELETE',
    headers,
  })
  return res.ok
}

// --- PRODUCTS (for OrderCreate / OrderEdit) ---
export async function fetchCatalogProducts() {
  try {
    const res = await fetch(`${API_URL}/products`)
    if (!res.ok) throw new Error('Failed to fetch products')
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      return data.map((p, idx) => ({
        id: String(p._id || p.id),
        _id: p._id,
        name: p.name,
        price: Number(p.price) || 0,
        code: String(p._id || `P-${1001 + idx}`).slice(-8).toUpperCase(),
        image: p.image || `https://i.pravatar.cc/80?img=${(idx % 50) + 1}`,
      }))
    }
  } catch {
    // fallback
  }
  return sampleProducts
}

// --- USERS ---
export async function fetchUsers() {
  try {
    const headers = await authHeaders()
    const res = await fetch(`${API_URL}/auth/users`, { headers })
    if (!res.ok) throw new Error('Failed to fetch users')
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      return data.map((u, idx) => ({
        id: String(u._id || u.id),
        name: u.name,
        email: u.email,
        country: u.phone || 'India',
        friends: u.role === 'admin' ? 'Admin' : 'Customer',
        followers: u.role === 'admin' ? 'Full Access' : 'Store User',
        status: u.status || 'Active',
        verified: true,
        avatar: u.avatar || `https://i.pravatar.cc/150?img=${(idx % 60) + 10}`,
      }))
    }
  } catch (err) {
    console.warn('Using fallback users:', err.message)
  }
  return staticUsers
}

