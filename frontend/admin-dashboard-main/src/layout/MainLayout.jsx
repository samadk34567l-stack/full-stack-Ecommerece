import React, { useRef, useState } from 'react'
import { Box, Toolbar } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Sidebar, { drawerWidth } from './Sidebar.jsx'
import Navbar from './Navbar.jsx'

export default function MainLayout({ children, mobileOpen, setMobileOpen }) {
  const location = useLocation()
  const nodeRef = useRef(null)
  const [desktopOpen, setDesktopOpen] = useState(true)

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar
        onMenuClick={() => setMobileOpen(true)}
        onToggleSidebar={() => setDesktopOpen((prev) => !prev)}
        desktopOpen={desktopOpen}
      />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} desktopOpen={desktopOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 1.5, sm: 2.5, md: 3 },
          width: { xs: '100%', sm: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          minHeight: '100vh',
          bgcolor: 'background.default',
          overflowX: 'hidden',
          position: 'relative',
          zIndex: 0,
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.2, 1)',
          '& .page-fade-enter': { opacity: 0, transform: 'translateY(8px)' },
          '& .page-fade-enter-active': {
            opacity: 1,
            transform: 'translateY(0)',
            transition: 'opacity 280ms ease, transform 280ms ease',
          },
          '& .page-fade-exit': { opacity: 1 },
          '& .page-fade-exit-active': { opacity: 0, transition: 'opacity 150ms ease' },
        }}
      >
        <Toolbar />
        <TransitionGroup>
          <CSSTransition key={location.pathname} classNames="page-fade" timeout={280} nodeRef={nodeRef}>
            <Box ref={nodeRef}>{children}</Box>
          </CSSTransition>
        </TransitionGroup>
      </Box>
    </Box>
  )
}
