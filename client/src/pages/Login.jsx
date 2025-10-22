import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
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
  Google,
  GitHub,
} from '@mui/icons-material'
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import api from "../api/index.js";
import { useAuthStore } from "../store";

// Revolutionary Login Keyframe Animations
const keyframes = `
  @keyframes loginFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(2deg); }
  }

  @keyframes loginGlow {
    0%, 100% { box-shadow: 0 0 30px rgba(102, 126, 234, 0.4); }
    50% { box-shadow: 0 0 60px rgba(102, 126, 234, 0.8), 0 0 90px rgba(118, 75, 162, 0.6); }
  }

  @keyframes loginShimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes loginPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }

  @keyframes loginWave {
    0%, 100% { transform: translateX(0px) translateY(0px); }
    25% { transform: translateX(5px) translateY(-5px); }
    75% { transform: translateX(-5px) translateY(5px); }
  }

  @keyframes loginGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes loginSlide {
    0% { transform: translateX(-100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  @keyframes loginZoom {
    0% { transform: scale(0.8) rotate(-5deg); opacity: 0; }
    50% { transform: scale(1.05) rotate(2deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  @keyframes loginRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Inject keyframes into document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
}

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
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const loginMutation = useMutation({
    mutationFn: (credentials) => api.post('/api/auth/login', credentials),
    onSuccess: (data) => {
      login(data.data)
      navigate('/dashboard')
    },
  })

  const handleGoogleLogin = () => {
    // Handle Google OAuth login
    console.log('Google login clicked')
  }

  const handleGithubLogin = () => {
    // Handle GitHub OAuth login
    console.log('GitHub login clicked')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        backgroundSize: '400% 400%',
        animation: 'loginGradient 12s ease infinite',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -50,
          left: -50,
          width: 100,
          height: 100,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'loginFloat 6s ease-in-out infinite',
        }
      }}
    >
      {/* Floating Particles */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
        {[...Array(25)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 8 + 3 + 'px',
              height: Math.random() * 8 + 3 + 'px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `loginFloat ${Math.random() * 4 + 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 6,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.3)',
            position: 'relative',
            overflow: 'hidden',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
            transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1)',
            animation: 'loginGlow 3s ease-in-out infinite',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: 'linear-gradient(90deg, #ffffff 0%, #f0f8ff 50%, #ffffff 100%)',
              backgroundSize: '200% 100%',
              animation: 'loginShimmer 3s ease-in-out infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 20,
              right: 20,
              width: 60,
              height: 60,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              animation: 'loginPulse 4s ease-in-out infinite',
            }
          }}
        >
          {/* Revolutionary Header */}
          <Box sx={{ textAlign: 'center', mb: 5, position: 'relative', zIndex: 2 }}>
            {/* Floating Welcome Icon */}
            <Box 
              sx={{ 
                fontSize: '4rem', 
                mb: 2,
                animation: 'loginFloat 3s ease-in-out infinite',
                display: 'inline-block'
              }}
            >
              🎓
            </Box>
            
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 900,
                mb: 3,
                background: 'linear-gradient(45deg, #ffffff 20%, #f0f8ff 50%, #ffffff 80%)',
                backgroundSize: '200% 200%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'loginShimmer 4s ease-in-out infinite',
                textShadow: '0 4px 20px rgba(255,255,255,0.3)',
                letterSpacing: '-1px',
              }}
            >
              Welcome Back
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                animation: 'loginWave 3s ease-in-out infinite',
              }}
            >
              Sign in to continue your amazing learning journey ✨
            </Typography>

            {/* Decorative Elements */}
            <Box sx={{ position: 'absolute', top: 0, left: '10%', animation: 'loginFloat 4s ease-in-out infinite' }}>
              <Typography sx={{ fontSize: '1.5rem', opacity: 0.7 }}>📚</Typography>
            </Box>
            <Box sx={{ position: 'absolute', top: 20, right: '15%', animation: 'loginFloat 3.5s ease-in-out infinite reverse' }}>
              <Typography sx={{ fontSize: '1.2rem', opacity: 0.6 }}>⭐</Typography>
            </Box>
          </Box>

          {/* Revolutionary Social Login Buttons */}
          <Stack spacing={3} sx={{ mb: 4 }}>
            <Button
              fullWidth
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              sx={{
                py: 2,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #4285f4 0%, #34a853 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 0.6s',
                },
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 15px 30px rgba(66, 133, 244, 0.4)',
                  '&::before': {
                    transform: 'translateX(100%)',
                  }
                },
                animation: 'loginPulse 3s ease-in-out infinite',
              }}
            >
              Continue with Google
            </Button>
            <Button
              fullWidth
              startIcon={<GitHub />}
              onClick={handleGithubLogin}
              sx={{
                py: 2,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #24292e 0%, #444d56 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 0.6s',
                },
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 15px 30px rgba(36, 41, 46, 0.4)',
                  '&::before': {
                    transform: 'translateX(100%)',
                  }
                },
                animation: 'loginPulse 3s ease-in-out infinite 0.5s',
              }}
            >
              Continue with GitHub
            </Button>
          </Stack>

          <Divider 
            sx={{ 
              my: 4,
              '&::before, &::after': {
                borderColor: 'rgba(255,255,255,0.3)',
                borderWidth: 2,
              }
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                px: 3,
                py: 1,
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 600,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                animation: 'loginGlow 2s ease-in-out infinite',
              }}
            >
              ✉️ or continue with email
            </Typography>
          </Divider>

          {/* Login Form */}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              loginMutation.mutate(values)
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
                          <Email sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
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
                          <Lock sx={{ color: '#667eea' }} />
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />

                  <Box sx={{ textAlign: 'right' }}>
                    <MuiLink
                      component={Link}
                      to="/forgot-password"
                      sx={{
                        color: '#667eea',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Forgot password?
                    </MuiLink>
                  </Box>

                  {loginMutation.isError && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                      {loginMutation.error?.response?.data?.message || 'Login failed. Please try again.'}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loginMutation.isPending}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      bgcolor: '#667eea',
                      '&:hover': {
                        bgcolor: '#5a6fd8',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
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
                  color: '#667eea',
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
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Email: student@cway.com
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Password: password123
            </Typography>
          </Paper>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login