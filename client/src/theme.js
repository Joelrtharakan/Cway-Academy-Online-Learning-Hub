import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light', // Will be controlled by Zustand store
    primary: {
      main: '#fbbf24', // Golden yellow from homepage
      light: '#fcd34d',
      dark: '#f59e0b',
      contrastText: '#1f2937',
    },
    secondary: {
      main: '#111827', // Dark gray from homepage
      light: '#374151',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
    // Custom colors for consistency
    golden: {
      main: '#fbbf24',
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    dark: {
      main: '#111827',
      light: '#374151',
      dark: '#000000',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e5e5',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 4px 6px rgba(0, 0, 0, 0.1)',
    '0px 4px 12px rgba(0, 0, 0, 0.15)',
    '0px 6px 16px rgba(0, 0, 0, 0.2)',
    '0px 8px 24px rgba(0, 0, 0, 0.15)',
    '0px 12px 32px rgba(0, 0, 0, 0.2)',
    '0px 16px 40px rgba(0, 0, 0, 0.25)',
    ...Array(17).fill('0px 16px 40px rgba(0, 0, 0, 0.25)'),
  ],
})

// Dark theme variant
export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#fbbf24',
      light: '#fcd34d',
      dark: '#f59e0b',
      contrastText: '#1f2937',
    },
    secondary: {
      main: '#ffffff',
      light: '#f3f4f6',
      dark: '#d1d5db',
      contrastText: '#111827',
    },
    background: {
      default: '#111827',
      paper: '#1f2937',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d1d5db',
    },
  },
})

export default theme