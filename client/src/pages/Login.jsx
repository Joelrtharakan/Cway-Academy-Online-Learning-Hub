import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  Link as MuiLink,
} from '@mui/material'
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useAuthStore } from "../store"

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
})

function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Mock authentication function
  const handleLogin = async (credentials) => {
    setIsLoading(true)
    setError('')

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock user data
    const mockUsers = {
      'ali.student@cway.ac': {
        _id: 'student123',
        name: 'Ali Student',
        email: 'ali.student@cway.ac',
        role: 'student',
        avatar: '/student-ali.jpg'
      },
      'tutor.ai@cway.ac': {
        _id: 'tutor123',
        name: 'AI Tutor',
        email: 'tutor.ai@cway.ac',
        role: 'tutor',
        avatar: '/tutor-ai.jpg'
      }
    }

    const mockPassword = 'P@ssw0rd!'

    // Check credentials
    if (credentials.password === mockPassword && mockUsers[credentials.email]) {
      const userData = {
        user: mockUsers[credentials.email],
        accessToken: 'mock-jwt-token-' + Date.now()
      }
      login(userData)
      navigate('/dashboard')
    } else {
      setError('Invalid email or password. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
              }}
            >
              Sign in to continue your learning journey
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Sign in with email
            </Typography>
          </Divider>

          {/* Login Form */}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await handleLogin(values)
            }}
          >
            {({ errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ textAlign: 'right' }}>
                    <MuiLink
                      component={Link}
                      to="/forgot-password"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Forgot password?
                    </MuiLink>
                  </Box>

                  {error && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Don't have an account?{' '}
              <MuiLink
                component={Link}
                to="/register"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign up for free
              </MuiLink>
            </Typography>
          </Box>

          {/* Demo Credentials */}
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Demo Credentials
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Student:</strong> ali.student@cway.ac
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Tutor:</strong> tutor.ai@cway.ac
            </Typography>
            <Typography variant="body2">
              <strong>Password:</strong> P@ssw0rd!
            </Typography>
          </Paper>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login