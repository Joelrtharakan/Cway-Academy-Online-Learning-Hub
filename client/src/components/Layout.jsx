import { useState } from 'react'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Menu, MenuItem, Avatar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import SchoolIcon from '@mui/icons-material/School'
import ChatIcon from '@mui/icons-material/Chat'
import PersonIcon from '@mui/icons-material/Person'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useAuthStore } from '../store'

const drawerWidth = 240

function Layout() {
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, isAuthenticated, logout } = useAuthStore()
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
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Clean Minimal Navbar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e5e5e5',
          color: '#374151',
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
              color: '#111827',
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
                color: '#6b7280',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: '#111827',
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
                color: '#6b7280',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  color: '#111827',
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
                  color: '#6b7280',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#111827',
                    bgcolor: 'transparent',
                  }
                }}
              >
                Dashboard
              </Button>
            )}
          </Box>

          {/* Auth Section */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={handleMenu}
                sx={{
                  p: 0,
                  border: '2px solid #e5e5e5',
                  '&:hover': {
                    borderColor: '#d1d5db',
                  }
                }}
              >
                {user?.avatarUrl ? (
                  <Avatar src={user.avatarUrl} sx={{ width: 32, height: 32 }} />
                ) : (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#9ca3af' }}>
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
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    mt: 1,
                  }
                }}
              >
                <MenuItem onClick={handleClose} sx={{ color: '#374151' }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: '#374151' }}>
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
                  color: '#6b7280',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#111827',
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
                  bgcolor: '#111827',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 3,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#1f2937',
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