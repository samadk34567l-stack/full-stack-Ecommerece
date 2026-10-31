import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layout/MainLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import UserList from './pages/UserList.jsx'
import UserProfile from './pages/UserProfile.jsx'
import CustomerList from './pages/CustomerList.jsx'
import CustomerCreate from './pages/CustomerCreate.jsx'
import CustomerDetails from './pages/CustomerDetails.jsx'
import CustomerEdit from './pages/CustomerEdit.jsx'
import OrderList from './pages/OrderList.jsx'
import OrderCreate from './pages/OrderCreate.jsx'
import OrderEdit from './pages/OrderEdit.jsx'
import OrderDetails from './pages/OrderDetails.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="*"
        element={
          <MainLayout mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/user" element={<UserList />} />
              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/customer" element={<CustomerList />} />
              <Route path="/customer/create" element={<CustomerCreate />} />
              <Route path="/customer/details/:id" element={<CustomerDetails />} />
              <Route path="/customer/edit/:id" element={<CustomerEdit />} />
              <Route path="/order" element={<OrderList />} />
              <Route path="/order/create" element={<OrderCreate />} />
              <Route path="/order/edit/:id" element={<OrderEdit />} />
              <Route path="/order/details/:id" element={<OrderDetails />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  )
}
