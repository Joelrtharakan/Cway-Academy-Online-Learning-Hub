import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import theme, { darkTheme } from './theme'
import { useUIStore } from './store'
import { SocketProvider } from './context/SocketContext'

const queryClient = new QueryClient()

// Theme provider component that uses Zustand store
const ThemedApp = () => {
  const { theme: themeMode } = useUIStore()
  const currentTheme = themeMode === 'dark' ? darkTheme : theme

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <SocketProvider>
        <App />
      </SocketProvider>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemedApp />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)