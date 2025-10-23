import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Rating,
  LinearProgress,
  IconButton,
  Paper,
  Divider,
  Stack,
  Fade,
  Slide,
  Zoom,
  Grow,
  useScrollTrigger,
} from '@mui/material'
import {
  PlayArrow,
  School,
  People,
  Star,
  TrendingUp,
  CheckCircle,
  ArrowForward,
  Book,
  AccessTime,
  EmojiEvents,
  AutoAwesome,
  Rocket,
  Speed,
  Psychology,
} from '@mui/icons-material'
import { keyframes } from '@mui/system'
import api from '../api/index.js'

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.5); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.6); }
`

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

function ScrollAnimation({ children, direction = 'up', delay = 0 }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  })

  return (
    <Fade in={trigger} timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
      <div>{children}</div>
    </Fade>
  )
}

function Home() {
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  const { data: courses } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: () => api.get('/api/courses?limit=6'),
  })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Senior Software Engineer at Google',
      avatar: 'https://picsum.photos/60/60?random=1',
      content: 'Cway Academy completely transformed my career trajectory. The advanced React course landed me my dream job at Google!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Lead Data Scientist at Tesla',
      avatar: 'https://picsum.photos/60/60?random=2',
      content: 'The AI and Machine Learning courses here are cutting-edge. I went from beginner to leading AI projects at Tesla.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Creative Director at Apple',
      avatar: 'https://picsum.photos/60/60?random=3',
      content: 'The UX/UI design program is phenomenal. Now I\'m designing the next generation of Apple products!',
      rating: 5,
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const stats = [
    { icon: <Rocket />, value: '1000+', label: 'Premium Courses', color: '#FF6B6B' },
    { icon: <People />, value: '100K+', label: 'Global Students', color: '#4ECDC4' },
    { icon: <Star />, value: '4.9', label: 'Rating', color: '#FFE66D' },
    { icon: <TrendingUp />, value: '98%', label: 'Success Rate', color: '#95E1D3' },
  ]

  const features = [
    {
      icon: <AutoAwesome />,
      title: 'AI-Powered Learning',
      description: 'Personalized learning paths powered by artificial intelligence',
      color: '#667eea',
    },
    {
      icon: <Speed />,
      title: 'Lightning Fast',
      description: 'Optimized platform for seamless learning experience',
      color: '#764ba2',
    },
    {
      icon: <Psychology />,
      title: 'Expert Mentorship',
      description: '1-on-1 sessions with industry leaders and innovators',
      color: '#f093fb',
    },
    {
      icon: <Rocket />,
      title: 'Career Acceleration',
      description: 'Direct pathways to top tech companies and startups',
      color: '#f5576c',
    },
  ]

  return (
    <Box>
      {/* Hero Section with Custom Background */}
        return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* OnboardHub-Style Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          background: `
            linear-gradient(
              135deg,
              rgba(30, 41, 59, 0.95) 0%,
              rgba(51, 65, 85, 0.9) 50%,
              rgba(71, 85, 105, 0.85) 100%
            ),
            url('/Users/joeltharakan/Documents/Full Stack Project/homepage.jpg') center/cover
          `,
          display: 'flex',
          alignItems: 'center',
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
              radial-gradient(circle at 25% 75%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: 12 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={isLoaded} timeout={1500}>
                <Box>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      fontSize: { xs: '3rem', md: '5rem' },
                      fontWeight: 900,
                      color: 'white',
                      mb: 3,
                      lineHeight: 1.1,
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      animation: `${slideInUp} 1s ease-out`,
                    }}
                  >
                    Unlock Your{' '}
                    <Box 
                      component="span" 
                      sx={{ 
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: `${glow} 2s ease-in-out infinite`,
                      }}
                    >
                      Potential
                    </Box>
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'rgba(255,255,255,0.95)',
                      mb: 4,
                      fontSize: { xs: '1.4rem', md: '2rem' },
                      lineHeight: 1.5,
                      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      animation: `${slideInUp} 1s ease-out 0.3s both`,
                    }}
                  >
                    Join the future of learning with AI-powered courses, expert mentorship, and career acceleration programs.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ animation: `${slideInUp} 1s ease-out 0.6s both` }}>
                    <Button
                      component={Link}
                      to="/courses"
                      variant="contained"
                      size="large"
                      sx={{
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        color: '#000',
                        px: 5,
                        py: 2,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        borderRadius: 3,
                        textTransform: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          transition: 'left 0.6s',
                        },
                        '&:hover': {
                          transform: 'translateY(-3px) scale(1.05)',
                          boxShadow: '0 15px 35px rgba(255, 215, 0, 0.4)',
                          '&::before': {
                            left: '100%',
                          },
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      endIcon={<Rocket />}
                    >
                      Launch Your Career
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: 'rgba(255,255,255,0.8)',
                        color: 'white',
                        px: 5,
                        py: 2,
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        textTransform: 'none',
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: '#FFD700',
                          bgcolor: 'rgba(255,215,0,0.1)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 10px 25px rgba(255, 215, 0, 0.3)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      startIcon={<AutoAwesome />}
                    >
                      Start Free Trial
                    </Button>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide direction="left" in={isLoaded} timeout={1500}>
                <Box
                  sx={{
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      maxWidth: 600,
                      height: 450,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      borderRadius: 4,
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: `${float} 6s ease-in-out infinite`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                        animation: `${shimmer} 4s ease-in-out infinite`,
                      },
                    }}
                  >
                    <Typography variant="h2" sx={{ color: 'white', textAlign: 'center', zIndex: 1 }}>
                      🚀
                    </Typography>
                  </Box>
                  <Paper
                    elevation={12}
                    sx={{
                      position: 'absolute',
                      bottom: -40,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      p: 3,
                      borderRadius: 3,
                      minWidth: 280,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                      backdropFilter: 'blur(20px)',
                      animation: `${pulse} 2s ease-in-out infinite`,
                    }}
                  >
                    <Typography variant="h5" sx={{ color: '#667eea', fontWeight: 700, mb: 1 }}>
                      🎓 Join 100,000+ Innovators
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Shape the future with cutting-edge skills
                    </Typography>
                  </Paper>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Animated Stats Section */}
      <Box 
        sx={{ 
          py: 10, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={true} timeout={2000}>
            <Typography 
              variant="h3" 
              textAlign="center" 
              sx={{ 
                color: 'white', 
                fontWeight: 800, 
                mb: 6,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              Transforming Lives Worldwide
            </Typography>
          </Fade>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Zoom in={true} timeout={1000} style={{ transitionDelay: `${index * 200}ms` }}>
                  <Paper
                    elevation={12}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 4,
                      border: '1px solid rgba(255,255,255,0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.05)',
                        boxShadow: `0 20px 40px ${stat.color}40`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                      },
                    }}
                  >
                    <Box 
                      sx={{ 
                        color: stat.color, 
                        mb: 2, 
                        fontSize: '3rem',
                        animation: `${float} 3s ease-in-out infinite`,
                        animationDelay: `${index * 0.5}s`,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 900, 
                        color: '#333', 
                        mb: 1,
                        background: `linear-gradient(45deg, ${stat.color}, ${stat.color}80)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#666',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Revolutionary Features Section */}
      <Box sx={{ py: 12, background: 'linear-gradient(180deg, #fff 0%, #f8f9ff 100%)' }}>
        <Container maxWidth="lg">
          <ScrollAnimation>
            <Typography
              variant="h2"
              component="h2"
              textAlign="center"
              sx={{ 
                mb: 3, 
                fontWeight: 900,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Revolutionary Learning Experience
            </Typography>
            <Typography
              variant="h5"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 8, maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}
            >
              Cutting-edge features designed to accelerate your learning and career growth
            </Typography>
          </ScrollAnimation>
          
          <Grid container spacing={6}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Grow in={true} timeout={1500} style={{ transitionDelay: `${index * 300}ms` }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 4,
                      borderRadius: 4,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-12px) rotateY(5deg)',
                        boxShadow: `0 25px 50px ${feature.color}30`,
                        '&::before': {
                          opacity: 1,
                          transform: 'translateX(0)',
                        },
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${feature.color}10, ${feature.color}05)`,
                        opacity: 0,
                        transform: 'translateX(-100%)',
                        transition: 'all 0.4s ease',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        background: `linear-gradient(135deg, ${feature.color}, ${feature.color}80)`,
                        color: 'white',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        fontSize: '2rem',
                        position: 'relative',
                        zIndex: 1,
                        animation: `${pulse} 2s ease-in-out infinite`,
                        animationDelay: `${index * 0.3}s`,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -10,
                          left: -10,
                          right: -10,
                          bottom: -10,
                          borderRadius: '50%',
                          background: `linear-gradient(135deg, ${feature.color}30, transparent)`,
                          animation: `${glow} 3s ease-in-out infinite`,
                        },
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 700,
                        position: 'relative',
                        zIndex: 1,
                        color: '#333',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#666',
                        lineHeight: 1.7,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Spectacular Featured Courses Section */}
      <Box 
        sx={{ 
          py: 12, 
          background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243e 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(102,126,234,0.2) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <ScrollAnimation>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 900,
                  color: 'white',
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
              >
                🌟 Flagship Courses
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  maxWidth: 700, 
                  mx: 'auto',
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.6,
                }}
              >
                Handpicked premium courses that launched thousands of careers
              </Typography>
            </Box>
          </ScrollAnimation>
          
          <Grid container spacing={6}>
            {courses?.data?.courses?.slice(0, 3).map((course, index) => (
              <Grid item xs={12} md={4} key={course._id}>
                <Zoom in={true} timeout={1500} style={{ transitionDelay: `${index * 400}ms` }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      position: 'relative',
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-15px) rotateX(5deg)',
                        boxShadow: '0 30px 60px rgba(102,126,234,0.3)',
                        '&::before': {
                          opacity: 1,
                        },
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(102,126,234,0.2) 0%, rgba(118,75,162,0.2) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.5s ease',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 240,
                        background: `linear-gradient(135deg, ${['#FF6B6B', '#4ECDC4', '#45B7D1'][index]} 0%, ${['#FF8E6B', '#6BCF7F', '#96CEB4'][index]} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                          animation: `${shimmer} 3s ease-in-out infinite`,
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.25)',
                          color: 'white',
                          width: 80,
                          height: 80,
                          fontSize: '2.5rem',
                          position: 'relative',
                          zIndex: 1,
                          animation: `${pulse} 2s ease-in-out infinite`,
                          '&:hover': { 
                            bgcolor: 'rgba(255,255,255,0.35)',
                            transform: 'scale(1.1)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <PlayArrow sx={{ fontSize: '3rem' }} />
                      </IconButton>
                      <Chip
                        label={course.category}
                        sx={{
                          position: 'absolute',
                          top: 20,
                          right: 20,
                          bgcolor: 'rgba(255,255,255,0.95)',
                          color: '#333',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          animation: `${float} 3s ease-in-out infinite`,
                        }}
                      />
                    </Box>
                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          mb: 2, 
                          fontWeight: 700,
                          lineHeight: 1.3,
                          color: 'white',
                        }}
                      >
                        {course.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 3, 
                          lineHeight: 1.6,
                          color: 'rgba(255,255,255,0.8)',
                        }}
                      >
                        {course.description?.substring(0, 120)}...
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 2,
                            border: '2px solid rgba(255,255,255,0.3)',
                          }}
                        >
                          {course.tutor?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                            {course.tutor?.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Expert Instructor
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={5} readOnly size="small" sx={{ mr: 1, color: '#FFD700' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            5.0 (Premium)
                          </Typography>
                        </Box>
                        {course.price && (
                          <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 700 }}>
                            ${course.price}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ px: 4, pb: 4, position: 'relative', zIndex: 1 }}>
                      <Button
                        component={Link}
                        to={`/courses/${course._id}`}
                        variant="contained"
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderRadius: 3,
                          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                          color: '#000',
                          fontWeight: 700,
                          fontSize: '1rem',
                          textTransform: 'none',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Enroll Now
                      </Button>
                    </CardActions>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
          <Fade in={true} timeout={2000} style={{ transitionDelay: '1200ms' }}>
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Button
                component={Link}
                to="/courses"
                variant="outlined"
                size="large"
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: 4,
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#FFD700',
                    color: '#FFD700',
                    transform: 'scale(1.05)',
                    boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)',
                  },
                  transition: 'all 0.4s ease',
                }}
                endIcon={<ArrowForward />}
              >
                Explore All Courses
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Revolutionary Testimonials Section */}
      <Box 
        sx={{ 
          py: 12,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <ScrollAnimation>
            <Typography 
              variant="h2" 
              component="h2" 
              textAlign="center" 
              sx={{ 
                mb: 3, 
                fontWeight: 900,
                color: 'white',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              💫 Success Stories
            </Typography>
            <Typography 
              variant="h5" 
              textAlign="center" 
              sx={{ 
                mb: 8,
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Real transformations from our global community of innovators
            </Typography>
          </ScrollAnimation>
          
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Slide direction="right" in={true} timeout={1500}>
                <Paper
                  elevation={20}
                  sx={{
                    p: 5,
                    borderRadius: 4,
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #FFD700, #FFA500, #FF6B6B)',
                    },
                  }}
                >
                  <Box sx={{ mb: 4 }}>
                    <Rating 
                      value={testimonials[currentTestimonial].rating} 
                      readOnly 
                      size="large"
                      sx={{ color: '#FFD700' }}
                    />
                  </Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 4, 
                      fontStyle: 'italic',
                      lineHeight: 1.5,
                      color: 'white',
                      fontWeight: 300,
                      position: 'relative',
                      '&::before': {
                        content: '"',
                        fontSize: '6rem',
                        position: 'absolute',
                        top: -20,
                        left: -20,
                        color: 'rgba(255,215,0,0.3)',
                        fontFamily: 'serif',
                      },
                    }}
                  >
                    {testimonials[currentTestimonial].content}
                  </Typography>
                  <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.2)' }} />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={testimonials[currentTestimonial].avatar}
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        mr: 3,
                        border: '3px solid rgba(255,215,0,0.5)',
                        animation: `${glow} 3s ease-in-out infinite`,
                      }}
                    >
                      {testimonials[currentTestimonial].name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                        {testimonials[currentTestimonial].name}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 600 }}>
                        {testimonials[currentTestimonial].role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Slide>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide direction="left" in={true} timeout={1500}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      mb: 4, 
                      fontWeight: 800,
                      color: 'white',
                      textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    Your Success Story Starts Here
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 6, 
                      lineHeight: 1.8,
                      color: 'rgba(255,255,255,0.9)',
                      maxWidth: 500,
                      mx: 'auto',
                    }}
                  >
                    Join over 100,000 professionals who've transformed their careers with our cutting-edge courses. From coding bootcamps to AI mastery - your next breakthrough is one click away.
                  </Typography>
                  <Stack spacing={3} alignItems="center">
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      size="large"
                      sx={{
                        px: 6,
                        py: 2.5,
                        borderRadius: 4,
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        color: '#000',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          transition: 'left 0.6s',
                        },
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 15px 35px rgba(255, 215, 0, 0.4)',
                          '&::before': {
                            left: '100%',
                          },
                        },
                        transition: 'all 0.3s ease',
                      }}
                      startIcon={<Rocket />}
                    >
                      Begin Your Transformation
                    </Button>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      ✨ Free trial • No credit card required
                    </Typography>
                  </Stack>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Ultimate CTA Section */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243e 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255,215,0,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(102,126,234,0.15) 0%, transparent 50%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
            animation: `${shimmer} 4s ease-in-out infinite`,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Fade in={true} timeout={2000}>
            <Box>
              <Typography 
                variant="h1" 
                component="h2" 
                sx={{ 
                  mb: 4, 
                  fontWeight: 900,
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF6B6B)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${glow} 3s ease-in-out infinite`,
                }}
              >
                The Future is Now
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 6, 
                  opacity: 0.95, 
                  lineHeight: 1.6,
                  maxWidth: 800,
                  mx: 'auto',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                Don't just learn - revolutionize your career with AI-powered education, world-class mentors, and cutting-edge skills that Fortune 500 companies demand.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={4} 
                justifyContent="center"
                sx={{ mb: 6 }}
              >
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    color: '#000',
                    px: 8,
                    py: 3,
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    borderRadius: 4,
                    textTransform: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                      transition: 'left 0.6s',
                    },
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.05)',
                      boxShadow: '0 20px 40px rgba(255, 215, 0, 0.4)',
                      '&::before': {
                        left: '100%',
                      },
                    },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  startIcon={<Rocket sx={{ fontSize: '1.5rem' }} />}
                >
                  Launch Your Future
                </Button>
                <Button
                  component={Link}
                  to="/courses"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.8)',
                    color: 'white',
                    px: 8,
                    py: 3,
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    borderRadius: 4,
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: '#FFD700',
                      color: '#FFD700',
                      bgcolor: 'rgba(255,215,0,0.1)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 15px 30px rgba(255, 215, 0, 0.3)',
                    },
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  startIcon={<AutoAwesome sx={{ fontSize: '1.5rem' }} />}
                >
                  Explore Courses
                </Button>
              </Stack>
              
              {/* Trust Indicators */}
              <Grid container spacing={4} justifyContent="center" alignItems="center">
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#FFD700', mb: 1 }}>
                      100K+
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Career Transformations
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#4ECDC4', mb: 1 }}>
                      98%
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Job Placement Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#FF6B6B', mb: 1 }}>
                      500+
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Industry Partners
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#95E1D3', mb: 1 }}>
                      $120K
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      Average Salary Boost
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  )
}

export default Home