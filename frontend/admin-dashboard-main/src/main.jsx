import React, { forwardRef } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import App from './App.jsx'
import theme from './theme.js'
import SuccessSnackbar from './components/SuccessSnackbar.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </BrowserRouter>,
)
