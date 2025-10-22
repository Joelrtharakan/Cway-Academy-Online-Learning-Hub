import { useState } from 'react'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Menu, MenuItem, Avatar, Switch, FormControlLabel } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import SchoolIcon from '@mui/icons-material/School'
import ChatIcon from '@mui/icons-material/Chat'
import PersonIcon from '@mui/icons-material/Person'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useAuthStore, useUIStore } from '../store'

const drawerWidth = 240

function Layout() {
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, isAuthenticated, logout } = useAuthStore()
  const { theme, toggleTheme } = useUIStore()
  const navigate = useNavigate()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
    navigate('/')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Clean Minimal Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              mr: 4,
            }}
          >
            Cway Academy
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, mr: 'auto' }}>
            <Button
              component={Link}
              to="/"
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: 'transparent',
                }
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/courses"
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: 'transparent',
                }
              }}
            >
              Courses
            </Button>
            {isAuthenticated && (
              <Button
                component={Link}
                to="/dashboard"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'transparent',
                  }
                }}
              >
                Dashboard
              </Button>
            )}
          </Box>

          {/* Theme Toggle */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              mr: 2,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              }
            }}
          >
            {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Auth Section */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={handleMenu}
                sx={{
                  p: 0,
                  border: '2px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                  }
                }}
              >
                {user?.avatarUrl ? (
                  <Avatar src={user.avatarUrl} sx={{ width: 32, height: 32 }} />
                ) : (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                )}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  '& .MuiPaper-root': {
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    mt: 1,
                  }
                }}
              >
                <MenuItem onClick={handleClose} sx={{ color: 'text.primary' }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'text.primary' }}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: 'text.secondary',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'transparent',
                  }
                }}
              >
                Log in
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: 'none',
                  }
                }}
              >
                Sign up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout