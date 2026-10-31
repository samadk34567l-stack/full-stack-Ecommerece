import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: '#e3f2fd',
      main: '#2196f3',
      dark: '#1e88e5',
    },
    secondary: {
      light: '#ede7f6',
      main: '#673ab7',
      dark: '#5e35b1',
    },
    success: { light: '#b9f6ca', main: '#00e676', dark: '#00c853' },
    error: { light: '#ef9a9a', main: '#f44336', dark: '#c62828' },
    orange: { light: '#fbe9e7', main: '#ffab91', dark: '#d84315' },
    warning: { light: '#fff8e1', main: '#ffc107', dark: '#ffc107' },
    grey: {
      50: '#f8fafc',
      100: '#eef2f6',
      200: '#e3e8ef',
      300: '#cdd5df',
      500: '#697586',
      600: '#4b5565',
      700: '#364152',
      900: '#121926',
    },
    text: { primary: '#212b36', secondary: '#697586' },
    divider: '#e3e8ef',
    background: { default: '#f8f9fb', paper: '#ffffff' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 600, fontSize: '1.15rem' },
    h6: { fontWeight: 500, fontSize: '1rem' },
    body2: { fontSize: '0.85rem' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          transition: 'background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease',
        },
        containedPrimary: {
          '&:hover': { backgroundColor: '#1565c0', boxShadow: '0 4px 12px rgba(21,101,192,0.3)' },
        },
        containedSecondary: {
          '&:hover': { backgroundColor: '#4527a0', boxShadow: '0 4px 12px rgba(69,39,160,0.3)' },
        },
        outlinedPrimary: {
          '&:hover': { backgroundColor: 'rgba(33,150,243,0.08)', borderColor: '#1565c0', color: '#1565c0' },
        },
        outlinedSecondary: {
          '&:hover': { backgroundColor: 'rgba(103,58,183,0.08)', borderColor: '#4527a0', color: '#4527a0' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.28s cubic-bezier(.4,0,.2,1), transform 0.28s cubic-bezier(.4,0,.2,1)',
          '&:hover': {
            boxShadow: '0 10px 28px rgba(20,30,60,0.10)',
            transform: 'translateY(-3px)',
          },
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, transition: 'transform 0.15s ease', '&:hover': { transform: 'scale(1.04)' } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.18s ease, color 0.18s ease',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.08)' },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease, color 0.2s ease',
          '&:hover': { backgroundColor: 'rgba(33,150,243,0.06)' },
          '&.Mui-selected': {
            backgroundColor: '#ede7f6',
            color: '#5e35b1',
            '& .MuiListItemIcon-root': { color: '#5e35b1' },
            '&:hover': { backgroundColor: '#ede7f6' },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: { transition: 'transform 0.15s ease', '&:hover': { transform: 'scale(1.1)' } },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.18s ease, transform 0.18s ease',
          '&:hover': { backgroundColor: 'rgba(33,150,243,0.045)' },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          transition: 'color 0.2s ease, opacity 0.2s ease',
        },
      },
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
})

theme.typography.h4 = {
  ...theme.typography.h4,
  [theme.breakpoints.down('sm')]: { fontSize: '1.15rem' },
}
theme.typography.h5 = {
  ...theme.typography.h5,
  [theme.breakpoints.down('sm')]: { fontSize: '1rem' },
}
theme.typography.h6 = {
  ...theme.typography.h6,
  [theme.breakpoints.down('sm')]: { fontSize: '0.9rem' },
}

export default theme
