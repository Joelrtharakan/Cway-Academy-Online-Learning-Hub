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
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google,
  GitHub,
  School,
  CheckCircle,
} from '@mui/icons-material'
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import api from "../api/index.js";
import { useAuthStore } from "../store";

// Revolutionary Register Keyframe Animations
const keyframes = `
  @keyframes registerFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(1deg); }
  }

  @keyframes registerGlow {
    0%, 100% { box-shadow: 0 0 25px rgba(102, 126, 234, 0.3); }
    50% { box-shadow: 0 0 50px rgba(102, 126, 234, 0.7), 0 0 75px rgba(118, 75, 162, 0.5); }
  }

  @keyframes registerShimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes registerPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.03); opacity: 0.95; }
  }

  @keyframes registerWave {
    0%, 100% { transform: translateX(0px) translateY(0px); }
    25% { transform: translateX(3px) translateY(-3px); }
    75% { transform: translateX(-3px) translateY(3px); }
  }

  @keyframes registerGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes registerSlide {
    0% { transform: translateX(-50px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  @keyframes registerZoom {
    0% { transform: scale(0.9) rotate(-3deg); opacity: 0; }
    50% { transform: scale(1.02) rotate(1deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  @keyframes registerBounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0, -10px, 0); }
    70% { transform: translate3d(0, -5px, 0); }
    90% { transform: translate3d(0, -2px, 0); }
  }
`;

// Inject keyframes into document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
}

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: Yup.string()
    .oneOf(['student', 'tutor'], 'Please select a valid role')
    .required('Role is required'),
})

const steps = ['Account Details', 'Personal Info', 'Confirmation']

function Register() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const registerMutation = useMutation({
    mutationFn: (userData) => api.post('/api/auth/register', userData),
    onSuccess: (data) => {
      login(data.data)
      navigate('/dashboard')
    },
  })

  const handleGoogleRegister = () => {
    // Handle Google OAuth registration
    console.log('Google register clicked')
  }

  const handleGithubRegister = () => {
    // Handle GitHub OAuth registration
    console.log('GitHub register clicked')
  }

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
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
        animation: 'registerGradient 15s ease infinite',
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
            radial-gradient(circle at 25% 75%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Floating Particles */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
        {[...Array(30)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `registerFloat ${Math.random() * 4 + 3}s ease-in-out infinite`,
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
            transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
            transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1)',
            animation: 'registerGlow 4s ease-in-out infinite',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: 'linear-gradient(90deg, #ffffff 0%, #f0f8ff 50%, #ffffff 100%)',
              backgroundSize: '200% 100%',
              animation: 'registerShimmer 3s ease-in-out infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 20,
              right: 20,
              width: 80,
              height: 80,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              animation: 'registerPulse 5s ease-in-out infinite',
            }
          }}
        >
          {/* Revolutionary Header */}
          <Box sx={{ textAlign: 'center', mb: 5, position: 'relative', zIndex: 2 }}>
            {/* Floating Registration Icon */}
            <Box 
              sx={{ 
                fontSize: '4rem', 
                mb: 2,
                animation: 'registerFloat 3.5s ease-in-out infinite',
                display: 'inline-block'
              }}
            >
              🚀
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
                animation: 'registerShimmer 4s ease-in-out infinite',
                textShadow: '0 4px 20px rgba(255,255,255,0.3)',
                letterSpacing: '-1px',
              }}
            >
              Join Cway Academy
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                animation: 'registerWave 3s ease-in-out infinite',
              }}
            >
              Start your amazing learning journey today - it's completely free! 🎯
            </Typography>

            {/* Decorative Elements */}
            <Box sx={{ position: 'absolute', top: 10, left: '5%', animation: 'registerFloat 4s ease-in-out infinite' }}>
              <Typography sx={{ fontSize: '1.8rem', opacity: 0.7 }}>🎓</Typography>
            </Box>
            <Box sx={{ position: 'absolute', top: 30, right: '8%', animation: 'registerFloat 3.5s ease-in-out infinite reverse' }}>
              <Typography sx={ { fontSize: '1.4rem', opacity: 0.6 }}>✨</Typography>
            </Box>
            <Box sx={{ position: 'absolute', bottom: 0, left: '20%', animation: 'registerBounce 4s ease-in-out infinite' }}>
              <Typography sx={{ fontSize: '1.2rem', opacity: 0.5 }}>💡</Typography>
            </Box>
          </Box>

          {/* Revolutionary Stepper */}
          <Box sx={{ mb: 5 }}>
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel
              sx={{
                '& .MuiStepLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                },
                '& .MuiStepLabel-label': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.8)',
                  '&.Mui-active': {
                    color: 'white',
                    fontWeight: 700,
                    animation: 'registerGlow 2s ease-in-out infinite',
                  },
                  '&.Mui-completed': {
                    color: 'rgba(255,255,255,0.9)',
                  }
                },
                '& .MuiStepIcon-root': {
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '2rem',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  '&.Mui-active': {
                    color: 'white',
                    transform: 'scale(1.2)',
                    animation: 'registerPulse 2s ease-in-out infinite',
                    filter: 'drop-shadow(0 4px 8px rgba(255,255,255,0.3))',
                  },
                  '&.Mui-completed': {
                    color: '#4caf50',
                    transform: 'scale(1.1)',
                    animation: 'registerBounce 1s ease-in-out',
                  }
                },
                '& .MuiStepConnector-line': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  borderTopWidth: 3,
                },
                '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                  borderColor: 'white',
                  animation: 'registerShimmer 2s ease-in-out infinite',
                },
                '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                  borderColor: '#4caf50',
                }
              }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      '& .MuiStepLabel-iconContainer': {
                        animation: activeStep === index ? 'registerFloat 2s ease-in-out infinite' : 'none',
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Social Registration Buttons */}
          {activeStep === 0 && (
            <>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  onClick={handleGoogleRegister}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    borderColor: '#ddd',
                    color: '#333',
                    '&:hover': {
                      borderColor: '#ccc',
                      bgcolor: '#f8f9fa',
                    },
                  }}
                >
                  Continue with Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHub />}
                  onClick={handleGithubRegister}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    borderColor: '#ddd',
                    color: '#333',
                    '&:hover': {
                      borderColor: '#ccc',
                      bgcolor: '#f8f9fa',
                    },
                  }}
                >
                  Continue with GitHub
                </Button>
              </Stack>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                  or create account with email
                </Typography>
              </Divider>
            </>
          )}

          {/* Registration Form */}
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: 'student'
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const { confirmPassword, ...userData } = values
              registerMutation.mutate(userData)
            }}
          >
            {({ errors, touched, handleChange, handleBlur, values, isValid }) => (
              <Form>
                <Stack spacing={3}>
                  {/* Step 1: Account Details */}
                  {activeStep === 0 && (
                    <>
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

                      <TextField
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: '#667eea' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                    </>
                  )}

                  {/* Step 2: Personal Info */}
                  {activeStep === 1 && (
                    <>
                      <TextField
                        fullWidth
                        name="name"
                        label="Full Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: '#667eea' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          },
                        }}
                      />

                      <FormControl
                        fullWidth
                        error={touched.role && Boolean(errors.role)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                          },
                        }}
                      >
                        <InputLabel>I want to</InputLabel>
                        <Select
                          value={values.role}
                          label="I want to"
                          name="role"
                          onChange={handleChange}
                          startAdornment={
                            <InputAdornment position="start">
                              <School sx={{ color: '#667eea', ml: 1 }} />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="student">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <School sx={{ mr: 1, color: '#667eea' }} />
                              Learn as a Student
                            </Box>
                          </MenuItem>
                          <MenuItem value="tutor">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <School sx={{ mr: 1, color: '#667eea' }} />
                              Teach as a Tutor
                            </Box>
                          </MenuItem>
                        </Select>
                        {touched.role && errors.role && (
                          <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                            {errors.role}
                          </Typography>
                        )}
                      </FormControl>
                    </>
                  )}

                  {/* Step 3: Confirmation */}
                  {activeStep === 2 && (
                    <Box sx={{ textAlign: 'center' }}>
                      <CheckCircle sx={{ fontSize: '4rem', color: '#4caf50', mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Ready to create your account?
                      </Typography>
                      <Box sx={{ textAlign: 'left', bgcolor: 'grey.50', p: 3, borderRadius: 2, mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Name:</strong> {values.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Email:</strong> {values.email}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Role:</strong> {values.role === 'student' ? 'Student' : 'Tutor'}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Navigation Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="outlined"
                      sx={{ borderRadius: 3 }}
                    >
                      Back
                    </Button>

                    {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={registerMutation.isPending || !isValid}
                        sx={{
                          borderRadius: 3,
                          px: 4,
                          bgcolor: '#667eea',
                          '&:hover': {
                            bgcolor: '#5a6fd8',
                          },
                        }}
                      >
                        {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={
                          (activeStep === 0 && (!values.email || !values.password || !values.confirmPassword || errors.email || errors.password || errors.confirmPassword)) ||
                          (activeStep === 1 && (!values.name || !values.role || errors.name || errors.role))
                        }
                        sx={{
                          borderRadius: 3,
                          px: 4,
                          bgcolor: '#667eea',
                          '&:hover': {
                            bgcolor: '#5a6fd8',
                          },
                        }}
                      >
                        Next
                      </Button>
                    )}
                  </Box>

                  {registerMutation.isError && (
                    <Alert severity="error" sx={{ borderRadius: 2, mt: 2 }}>
                      {registerMutation.error?.response?.data?.message || 'Registration failed. Please try again.'}
                    </Alert>
                  )}
                </Stack>
              </Form>
            )}
          </Formik>

          {/* Sign In Link */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Already have an account?{' '}
              <MuiLink
                component={Link}
                to="/login"
                sx={{
                  color: '#667eea',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign in here
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Register