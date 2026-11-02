import React from 'react'
import { AppBar, Toolbar, IconButton, Box, Paper, InputBase, Button, Chip } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useNavigate } from 'react-router-dom'
import { drawerWidth } from './Sidebar.jsx'
import { getCurrentAdminUser, logoutAdmin } from '../api.js'

export default function Navbar({ onMenuClick, onToggleSidebar, desktopOpen }) {
  const navigate = useNavigate()
  const adminUser = getCurrentAdminUser()

  const handleLogout = () => {
    logoutAdmin()
    navigate('/login')
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="inherit"
      sx={{
        width: { xs: '100%', sm: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
        ml: { xs: 0, sm: desktopOpen ? `${drawerWidth}px` : 0 },
        bgcolor: 'background.default',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: 'width 225ms cubic-bezier(0.4, 0, 0.2, 1), margin 225ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Toolbar sx={{ gap: { xs: 1, sm: 1.5 }, flexWrap: 'nowrap' }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <IconButton
          color="inherit"
          edge="start"
          onClick={onToggleSidebar}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            bgcolor: 'secondary.light',
            color: 'secondary.dark',
            borderRadius: 2,
            width: 36,
            height: 36,
            transition: 'background-color 0.18s ease, transform 0.18s ease',
            '&:hover': { transform: 'scale(1.06)' },
          }}
        >
          <MenuIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Paper
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            bgcolor: '#fff',
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'grey.200',
            width: { sm: 220, md: 280, lg: 340 },
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 0 0 3px rgba(33,150,243,0.12)' },
          }}
        >
          <SearchIcon sx={{ color: 'grey.400', mr: 1, fontSize: 20 }} />
          <InputBase placeholder="Search" sx={{ fontSize: 14, width: '100%' }} />
          <IconButton size="small" sx={{ bgcolor: 'secondary.light', color: 'secondary.dark', borderRadius: 1.5 }}>
            <TuneIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Paper>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {adminUser?.name && (
            <Chip
              label={adminUser.name}
              size="small"
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                bgcolor: '#e0f2f1',
                color: '#00695c',
                fontWeight: 700,
              }}
            />
          )}
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<LogoutOutlinedIcon fontSize="small" />}
            onClick={handleLogout}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
