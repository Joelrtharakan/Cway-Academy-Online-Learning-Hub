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
  Paper,
  Stack,
  Fade,
  TextField,
  InputAdornment,
} from '@mui/material'
import {
  Search,
  ArrowForward,
  School,
  People,
  Star,
  TrendingUp,
  CheckCircle,
  Book,
  AccessTime,
  EmojiEvents,
} from '@mui/icons-material'
import api from '../api/index.js'

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

  const featuredCourses = courses?.data || []

  const stats = [
    { label: 'Active Students', value: '50,000+', icon: <People /> },
    { label: 'Expert Tutors', value: '2,500+', icon: <School /> },
    { label: 'Courses Available', value: '500+', icon: <Book /> },
    { label: 'Success Rate', value: '98%', icon: <TrendingUp /> },
  ]

  const trustIndicators = [
    'Google', 'Microsoft', 'Stanford University', 'MIT', 'Harvard', 'Apple'
  ]

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh' }}>
      {/* Clean Minimal Hero Section */}
      <Box
        sx={{
          minHeight: '90vh',
          backgroundImage: 'url(/homepage.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in={isLoaded} timeout={1500}>
            <Box sx={{ py: { xs: 8, md: 12 }, textAlign: { xs: 'center', md: 'left' } }}>
              {/* Clean Main Heading */}
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                  fontWeight: 800,
                  mb: 4,
                  lineHeight: 1.1,
                  color: 'white',
                  maxWidth: '900px',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  '& .highlight': {
                    color: '#fbbf24',
                    fontWeight: 800,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
                  }
                }}
              >
                Learn from the{' '}
                <Box component="span" className="highlight">
                  best tutors
                </Box>{' '}
                in the world
              </Typography>

              {/* Clean Subtitle */}
              <Typography
                variant="h5"
                sx={{
                  mb: 6,
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontWeight: 400,
                  maxWidth: '600px',
                  lineHeight: 1.5,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                }}
              >
                Access high-quality courses, connect with expert tutors, and track your progress all in one place.
              </Typography>

              {/* Clean Search Interface */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'rgba(17, 24, 39, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  maxWidth: '750px',
                  mb: 6,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                }}
              >
                {/* Tab Navigation */}
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" spacing={0}>
                    {['Browse Courses'].map((tab, index) => (
                      <Button
                        key={tab}
                        onClick={() => setActiveTab(index)}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          borderBottom: activeTab === index ? 3 : 0,
                          borderColor: '#fbbf24',
                          color: activeTab === index ? '#fbbf24' : 'rgba(255, 255, 255, 0.8)',
                          fontWeight: activeTab === index ? 600 : 500,
                          textTransform: 'none',
                          backgroundColor: activeTab === index ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(251, 191, 36, 0.15)',
                            color: '#fbbf24',
                            transform: 'translateY(-1px)',
                          }
                        }}
                      >
                        {tab}
                      </Button>
                    ))}
                  </Stack>
                </Box>

                {/* Search Input */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    fullWidth
                    placeholder="Web Development, Data Science, Design..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#6b7280' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '& fieldset': {
                          border: 'none',
                        },
                        '&:hover': {
                          backgroundColor: 'white',
                          borderColor: '#fbbf24',
                          boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          borderColor: '#fbbf24',
                          boxShadow: '0 0 0 3px rgba(251, 191, 36, 0.15)',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#1f2937',
                        fontSize: '1rem',
                        padding: '16px 14px',
                        '&::placeholder': {
                          color: '#6b7280',
                          opacity: 0.8,
                        }
                      }
                    }}
                  />
                                    <Button
                    variant="contained"
                    startIcon={<ArrowForward />}
                    sx={{
                      px: 5,
                      py: 2,
                      background: '#fbbf24',
                      color: '#1f2937',
                      borderRadius: 3,
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)',
                      border: '2px solid rgba(251, 191, 36, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: '#f59e0b',
                        boxShadow: '0 12px 35px rgba(251, 191, 36, 0.6)',
                        transform: 'translateY(-2px)',
                        borderColor: '#fbbf24',
                      }
                    }}
                    component={Link}
                    to="/courses"
                  >
                    Search
                  </Button>
                </Stack>
              </Paper>

              {/* Trust Indicators */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    mb: 3,
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                >
                  Trusted by
                </Typography>
                <Stack
                  direction="row"
                  spacing={4}
                  flexWrap="wrap"
                  sx={{
                    '& > *': {
                      opacity: 0.6,
                      transition: 'opacity 0.3s ease',
                      '&:hover': { opacity: 1 },
                    }
                  }}
                >
                  {trustIndicators.slice(0, 4).map((company) => (
                    <Typography
                      key={company}
                      variant="h6"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      {company}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Clean Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  border: '1px solid #e5e5e5',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    borderColor: '#d1d5db',
                  }
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2,
                    bgcolor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    color: '#6b7280',
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#111827' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" sx={{ color: '#6b7280' }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Courses Section */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
              Featured Courses
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              Discover our most popular courses taught by industry experts
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {featuredCourses.slice(0, 6).map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: 160,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4" sx={{ color: 'white' }}>
                      📚
                    </Typography>
                    <Chip
                      label={course.category}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, lineHeight: 1.3 }}>
                      {course.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                        {course.tutor?.name?.charAt(0) || 'T'}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {course.tutor?.name || 'Expert Tutor'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                        <Star sx={{ fontSize: '1rem', color: '#fbbf24', mr: 0.5 }} />
                        <Typography variant="body2">4.8</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">
                          {course.duration || '6 weeks'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <People sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="caption" color="text.secondary">
                          {course.enrolledCount || 0} students
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      component={Link}
                      to={`/courses/${course._id}`}
                      variant="contained"
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                        background: '#22c55e',
                        '&:hover': {
                          background: '#16a34a',
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              to="/courses"
              variant="outlined"
              size="large"
              sx={{
                px: 6,
                py: 2,
                borderRadius: 2,
                borderColor: '#e5e5e5',
                color: '#6b7280',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#d1d5db',
                  background: '#f9fafb',
                }
              }}
            >
              View All Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Clean CTA Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: '#f9fafb',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: '#111827' }}>
            Ready to Start Learning?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: '#6b7280' }}>
            Join thousands of students who have transformed their careers with our expert-led courses.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                px: 6,
                py: 2,
                background: '#111827',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  background: '#1f2937',
                  boxShadow: 'none',
                }
              }}
            >
              Get Started Free
            </Button>
            <Button
              component={Link}
              to="/courses"
              variant="outlined"
              size="large"
              sx={{
                px: 6,
                py: 2,
                borderColor: '#e5e5e5',
                color: '#6b7280',
                borderRadius: 2,
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#d1d5db',
                  background: '#f3f4f6',
                }
              }}
            >
              Browse Courses
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default Home