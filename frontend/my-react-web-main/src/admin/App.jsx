import React, { useState, forwardRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import theme from './theme.js'
import SuccessSnackbar from './components/SuccessSnackbar.jsx'
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
import { isAdminAuthenticated } from './api.js'

function RequireAdminAuth({ children }) {
  if (!isAdminAuthenticated()) {
    const hasSignedUp = Boolean(sessionStorage.getItem('berry_last_signup_email'))
    return <Navigate to={hasSignedUp ? '/login' : '/signup'} replace />
  }
  return children
}

export default function AdminApp() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
        Components={{
          success: forwardRef((props, ref) => (
            <SuccessSnackbar ref={ref} id={props.id} message={props.message} />
          )),
        }}
      >
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="*"
            element={
              <RequireAdminAuth>
                <MainLayout mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}>
                  <Routes>
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/user" element={<UserList />} />
                    <Route path="/admin/user" element={<UserList />} />
                    <Route path="/user/:id" element={<UserProfile />} />
                    <Route path="/admin/user/:id" element={<UserProfile />} />
                    <Route path="/customer" element={<CustomerList />} />
                    <Route path="/admin/customer" element={<CustomerList />} />
                    <Route path="/customer/create" element={<CustomerCreate />} />
                    <Route path="/admin/customer/create" element={<CustomerCreate />} />
                    <Route path="/customer/details/:id" element={<CustomerDetails />} />
                    <Route path="/admin/customer/details/:id" element={<CustomerDetails />} />
                    <Route path="/customer/edit/:id" element={<CustomerEdit />} />
                    <Route path="/admin/customer/edit/:id" element={<CustomerEdit />} />
                    <Route path="/order" element={<OrderList />} />
                    <Route path="/admin/order" element={<OrderList />} />
                    <Route path="/order/create" element={<OrderCreate />} />
                    <Route path="/admin/order/create" element={<OrderCreate />} />
                    <Route path="/order/edit/:id" element={<OrderEdit />} />
                    <Route path="/admin/order/edit/:id" element={<OrderEdit />} />
                    <Route path="/order/details/:id" element={<OrderDetails />} />
                    <Route path="/admin/order/details/:id" element={<OrderDetails />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </MainLayout>
              </RequireAdminAuth>
            }
          />
        </Routes>
      </SnackbarProvider>
    </ThemeProvider>
  )
}
