// Dashboard page removed. File intentionally left blank.
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Button,
  Chip,
  Avatar,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Fade,
  Zoom,
  Slide,
  Grow,
  Backdrop,
} from '@mui/material'
import {
  School,
  PlayArrow,
  CheckCircle,
  Star,
  TrendingUp,
  AccessTime,
  MoreVert,
  Book,
  Assignment,
  EmojiEvents,
  Timeline,
  Rocket,
  Speed,
  Psychology,
  AutoAwesome,
  Celebration,
  LocalFireDepartment,
  FlashOn,
  Diamond,
} from '@mui/icons-material'
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState(0) // Start with My Courses tab active
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuthStore()

  // Query for enrolled courses
  const { 
    data: enrolledCourses = [], // Provide default empty array
    error: coursesError, 
    isLoading: coursesLoading 
  } = useQuery({
    queryKey: ['enrolled-courses'],
    queryFn: () => api.get('/api/courses/enrolled').then(res => res.data.courses),
    onError: (err) => {
      console.error('Error fetching enrolled courses:', err)
      setError(err.message)
    }
  })

  // Query for AI courses
  const { 
    data: aiCourses = [], // Provide default empty array
    isLoading: aiCoursesLoading 
  } = useQuery({
    queryKey: ['ai-courses'],
    queryFn: () => api.get('/api/courses?aiGenerated=true&published=true').then(res => res.data.courses),
    onError: (err) => {
      console.error('Error fetching AI courses:', err)
      setError(err.message)
    }
  })

  useEffect(() => {
    try {
      setIsLoaded(true)
      console.log('Dashboard mounted, user:', user)
      console.log('Enrolled courses:', enrolledCourses)
      console.log('AI courses:', aiCourses)
    } catch (err) {
      console.error('Error in Dashboard mount:', err)
      setError(err.message)
    }
  }, [user, enrolledCourses, aiCourses])

  // Debug: Log active tab changes
  useEffect(() => {
    console.log('Active tab changed to:', activeTab)
  }, [activeTab])

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 4,
        }}
      >
        <Card sx={{ 
          maxWidth: 500, 
          width: '100%',
          p: 4, 
          textAlign: 'center',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Something went wrong
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
              },
            }}
          >
            Retry
          </Button>
        </Card>
      </Box>
    )
  }

  // Fetch personalized learning path
  const { data: learningPathData } = useQuery({
    queryKey: ['learning-path', user?.name],
    queryFn: () => api.post('/api/ai/generate-learning-path', {
      skillLevel: 'intermediate', // Could be dynamic based on user profile
      interests: enrolledCourses.map(c => c.category),
      goals: 'Improve programming skills',
      availableTime: 10
    }).then(res => res.data),
    enabled: enrolledCourses.length > 0,
  })

  // Calculate stats from real data
  const stats = [
    { 
      label: 'Courses Enrolled', 
      value: enrolledCourses.length, 
      icon: <School />, 
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      animation: 'dashboardFloat 3s ease-in-out infinite'
    },
    { 
      label: 'Courses Completed', 
      value: enrolledCourses.filter(course => course.enrollment?.progress === 100).length, 
      icon: <CheckCircle />, 
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      animation: 'dashboardPulse 2s ease-in-out infinite'
    },
    { 
      label: 'Hours Learned', 
      value: Math.floor(enrolledCourses.reduce((total, course) => total + (course.enrollment?.progress || 0) * 0.5, 0)), // Mock calculation
      icon: <AccessTime />, 
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      animation: 'dashboardBounce 2.5s ease-in-out infinite'
    },
    { 
      label: 'Certificates Earned', 
      value: enrolledCourses.filter(course => course.enrollment?.completedAt).length, 
      icon: <EmojiEvents />, 
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      animation: 'dashboardWave 3.5s ease-in-out infinite'
    },
  ]

  // Mock data for activities and achievements (can be replaced with real API calls later)
  const recentActivities = [
    { type: 'enrolled', course: enrolledCourses[0]?.title || 'New Course', time: 'Recently' },
    { type: 'completed', course: 'Previous Course', lesson: 'Final Lesson', time: '2 weeks ago' },
    { type: 'certificate', course: 'Completed Course', time: '1 month ago' },
    { type: 'quiz', course: enrolledCourses[0]?.title || 'Course', score: 85, time: '1 week ago' },
  ]

  const achievements = [
    { title: 'First Course Completed', description: 'Completed your first course', icon: '🎓', unlocked: enrolledCourses.some(c => c.enrollment?.completedAt) },
    { title: 'Week Streak', description: 'Learned for 7 consecutive days', icon: '🔥', unlocked: enrolledCourses.length > 0 },
    { title: 'Quiz Master', description: 'Scored 90%+ on 5 quizzes', icon: '🧠', unlocked: false },
    { title: 'Speed Learner', description: 'Completed a course in under a week', icon: '⚡', unlocked: false },
  ]

  const handleMenuOpen = (event, course) => {
    setMenuAnchorEl(event.currentTarget)
    setSelectedCourse(course)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setSelectedCourse(null)
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'completed': return <CheckCircle sx={{ color: '#4caf50' }} />
      case 'enrolled': return <School sx={{ color: '#667eea' }} />
      case 'certificate': return <EmojiEvents sx={{ color: '#ffd700' }} />
      case 'quiz': return <Assignment sx={{ color: '#ff9800' }} />
      default: return <Book />
    }
  }

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'completed':
        return `Completed "${activity.lesson}" in ${activity.course}`
      case 'enrolled':
        return `Enrolled in ${activity.course}`
      case 'certificate':
        return `Earned certificate for ${activity.course}`
      case 'quiz':
        return `Scored ${activity.score}% on ${activity.course} quiz`
      default:
        return activity.course
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #9c27b0 0%, #673ab7 50%, #3f51b5 100%)',
        backgroundSize: '400% 400%',
        animation: 'dashboardGradient 15s ease infinite',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 6, pb: 6, position: 'relative', zIndex: 1 }}>
        {/* Revolutionary Hero Section */}
        <Box 
          sx={{ 
            mb: 6,
            textAlign: 'center',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 1.5s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 900,
              mb: 3,
              background: 'linear-gradient(45deg, #ffffff 30%, #f0f8ff 70%, #ffffff 100%)',
              backgroundSize: '200% 200%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'dashboardShimmer 3s ease-in-out infinite',
              textShadow: '0 4px 20px rgba(255,255,255,0.3)',
              letterSpacing: '-1px',
            }}
          >
            Welcome back, {user?.name || 'Student'}! 
            <Box component="span" sx={{ 
              display: 'inline-block', 
              animation: 'dashboardBounce 2s ease-in-out infinite',
              ml: 2 
            }}>
              👋
            </Box>
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 500,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            Continue your amazing learning journey and track your spectacular progress
          </Typography>

          {/* Floating Particles */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: -1 }}>
            {[...Array(20)].map((_, i) => (
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
                  animation: `dashboardFloat ${Math.random() * 3 + 2}s ease-in-out infinite`,
                  animationDelay: Math.random() * 2 + 's',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Revolutionary Stats Cards */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  animation: stat.animation,
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
                  transitionDelay: `${index * 0.2}s`,
                  '&:hover': { 
                    transform: 'translateY(-8px) scale(1.02)',
                    background: 'rgba(255,255,255,0.25)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      borderRadius: '50%',
                      background: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '2rem',
                      animation: 'dashboardGlow 2s ease-in-out infinite',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -5,
                        left: -5,
                        right: -5,
                        bottom: -5,
                        borderRadius: '50%',
                        background: stat.color,
                        opacity: 0.3,
                        animation: 'dashboardPulse 2s ease-in-out infinite',
                      }
                    }}
                  >
                    {stat.icon}
                  </Box>
                  
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 900, 
                      mb: 1,
                      background: 'linear-gradient(45deg, #ffffff 30%, #f0f8ff 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 2px 10px rgba(255,255,255,0.3)',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '0.9rem',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Revolutionary Main Content Tabs */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 6, 
            mb: 6,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            overflow: 'hidden',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1) 0.6s',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTabs-root': {
                minHeight: 80,
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'rgba(255,255,255,0.9)',
                minHeight: 80,
                px: 4,
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.1)',
                borderBottom: 'none',
                borderRadius: '12px 12px 0 0',
                marginRight: 1,
                background: 'rgba(255,255,255,0.05)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 0.6s',
                },
                '&:hover': {
                  color: 'white',
                  transform: 'translateY(-2px)',
                  background: 'rgba(255,255,255,0.15)',
                  '&::before': {
                    transform: 'translateX(100%)',
                  }
                },
                '&.Mui-selected': {
                  color: 'white',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                  animation: 'dashboardGlow 2s ease-in-out infinite',
                  borderBottom: '3px solid white',
                }
              },
              '& .MuiTabs-indicator': {
                height: 4,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #ffffff 30%, #f0f8ff 100%)',
                animation: 'dashboardShimmer 2s ease-in-out infinite',
              },
            }}
          >
            <Tab label="🎓 My Courses" />
            <Tab label="🤖 AI Learning" />
            <Tab label="⚡ Recent Activity" />
            <Tab label="🏆 Achievements" />
          </Tabs>

          {/* Revolutionary My Courses Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 4, 
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f8ff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                  animation: 'dashboardShimmer 3s ease-in-out infinite',
                }}
              >
                Continue Your Amazing Learning Journey
              </Typography>
              <Grid container spacing={4}>
                {coursesLoading ? (
                  // Loading state
                  [...Array(3)].map((_, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <Card
                        sx={{
                          borderRadius: 5,
                          overflow: 'hidden',
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          height: 400,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Loading courses...
                        </Typography>
                      </Card>
                    </Grid>
                  ))
                ) : coursesError ? (
                  // Error state
                  <Grid item xs={12}>
                    <Card
                      sx={{
                        borderRadius: 5,
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        p: 4,
                        textAlign: 'center',
                      }}
                    >
                      <Typography sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                        Failed to load enrolled courses
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {coursesError.message}
                      </Typography>
                    </Card>
                  </Grid>
                ) : enrolledCourses.length === 0 ? (
                  // Empty state
                  <Grid item xs={12}>
                    <Card
                      sx={{
                        borderRadius: 5,
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        p: 6,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                        No enrolled courses yet
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
                        Start your learning journey by enrolling in a course!
                      </Typography>
                      <Button
                        component={Link}
                        to="/courses"
                        variant="contained"
                        size="large"
                        sx={{ borderRadius: 3, px: 4 }}
                      >
                        Browse Courses
                      </Button>
                    </Card>
                  </Grid>
                ) : (
                  enrolledCourses.map((course, index) => (
                    <Grid item xs={12} md={6} lg={4} key={course._id}>
                      <Card
                        sx={{
                          borderRadius: 5,
                          overflow: 'hidden',
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                          opacity: isLoaded ? 1 : 0,
                          transform: isLoaded ? 'translateY(0) rotateX(0)' : 'translateY(50px) rotateX(10deg)',
                          transitionDelay: `${index * 0.2}s`,
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                            transform: 'translateX(-100%)',
                            transition: 'transform 0.6s',
                          },
                          '&:hover': {
                            transform: 'translateY(-12px) rotateX(5deg) scale(1.03)',
                            background: 'rgba(255,255,255,0.2)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                            '&::before': {
                              transform: 'translateX(100%)',
                            }
                          },
                        }}
                      >
                        <Box
                          sx={{
                            height: 180,
                            background: `linear-gradient(135deg, 
                              ${index % 3 === 0 ? '#667eea, #764ba2' : 
                                index % 3 === 1 ? '#4facfe, #00f2fe' : 
                                '#fa709a, #fee140'})`,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                            },
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: -50,
                              right: -50,
                              width: 100,
                              height: 100,
                              background: 'rgba(255,255,255,0.1)',
                              borderRadius: '50%',
                              animation: 'dashboardFloat 4s ease-in-out infinite',
                            }
                          }}
                        >
                          {/* Floating Elements */}
                          <Box sx={{ position: 'absolute', top: 20, left: 20, animation: 'dashboardBounce 3s ease-in-out infinite' }}>
                            <Typography sx={{ fontSize: '2rem' }}>📚</Typography>
                          </Box>
                          <Box sx={{ position: 'absolute', bottom: 20, right: 80, animation: 'dashboardFloat 2.5s ease-in-out infinite' }}>
                            <Typography sx={{ fontSize: '1.5rem' }}>✨</Typography>
                          </Box>

                          <Box
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              display: 'flex',
                              gap: 1,
                              zIndex: 2,
                            }}
                          >
                            <Chip
                              label={course.category}
                              size="small"
                              sx={{
                                background: 'rgba(255,255,255,0.25)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                fontWeight: 700,
                                border: '1px solid rgba(255,255,255,0.3)',
                                animation: 'dashboardGlow 2s ease-in-out infinite',
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, course)}
                              sx={{
                                background: 'rgba(255,255,255,0.25)',
                                backdropFilter: 'blur(10px)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.3)',
                                '&:hover': { 
                                  background: 'rgba(255,255,255,0.4)',
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                          </Box>

                          {/* Progress Ring */}
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 20,
                              left: 20,
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              background: 'conic-gradient(white 0deg, white ' + ((course.enrollment?.progress || 0) * 3.6) + 'deg, rgba(255,255,255,0.3) ' + ((course.enrollment?.progress || 0) * 3.6) + 'deg)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              animation: 'dashboardRotate 10s linear infinite',
                            }}
                          >
                            <Box
                              sx={{
                                width: 45,
                                height: 45,
                                borderRadius: '50%',
                                background: 'rgba(0,0,0,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                              }}
                            >
                              {course.enrollment?.progress || 0}%
                            </Box>
                          </Box>
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
                            {course.tutor?.name || 'Tutor'}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Progress
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {course.enrollment?.progress || 0}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={course.enrollment?.progress || 0}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                bgcolor: (course.enrollment?.progress || 0) === 100 ? '#4caf50' : '#667eea',
                              },
                            }}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Enrolled: {new Date(course.enrollment?.enrolledAt).toLocaleDateString()}
                        </Typography>

                        {course.enrollment?.completedAt && (
                          <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 500 }}>
                            ✓ Completed on {new Date(course.enrollment.completedAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </CardContent>

                      <Box sx={{ p: 3, pt: 0 }}>
                        <Button
                          component={Link}
                          to={`/courses/${course._id}`}
                          variant="contained"
                          fullWidth
                          startIcon={<PlayArrow />}
                          sx={{
                            borderRadius: 2,
                            py: 1.5,
                            fontWeight: 600,
                            bgcolor: '#667eea',
                            '&:hover': { bgcolor: '#5a6fd8' },
                          }}
                        >
                          {course.enrollment?.progress === 100 ? 'Review Course' : 'Continue Learning'}
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                component={Link}
                to="/courses"
                variant="outlined"
                size="large"
                sx={{ borderRadius: 3, px: 4 }}
              >
                Browse More Courses
              </Button>
            </Box>
          </Box>
        )}

        {/* AI Learning Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                fontWeight: 800,
                background: 'linear-gradient(45deg, #ffffff 30%, #f0f8ff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                animation: 'dashboardShimmer 3s ease-in-out infinite',
              }}
            >
              AI-Powered Learning Experience
            </Typography>

            {/* AI-Generated Courses Section */}
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesome sx={{ color: 'primary.main' }} />
                AI-Generated Courses
              </Typography>

              {aiCoursesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Loading AI courses...
                  </Typography>
                </Box>
              ) : aiCourses?.length > 0 ? (
                <Grid container spacing={3}>
                  {aiCourses.slice(0, 6).map((course, index) => (
                    <Grid item xs={12} md={6} lg={4} key={course._id}>
                      <Card
                        sx={{
                          borderRadius: 4,
                          background: 'rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'visible',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            background: 'rgba(255,255,255,0.15)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                          },
                        }}
                      >
                        {/* AI Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                            bgcolor: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Psychology sx={{ fontSize: '1rem' }} />
                          AI
                        </Box>

                        <Box
                          sx={{
                            height: 140,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <AutoAwesome sx={{ fontSize: '3rem', color: 'white', opacity: 0.8 }} />
                        </Box>

                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, lineHeight: 1.3 }}>
                            {course.title}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Chip
                              label={course.category}
                              size="small"
                              sx={{
                                background: 'rgba(102, 126, 234, 0.2)',
                                color: 'white',
                                fontWeight: 500,
                              }}
                            />
                          </Box>

                          <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                            {course.description.length > 120 
                              ? course.description.substring(0, 120) + '...' 
                              : course.description}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {course.sections?.length || 0} sections
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              ${course.price || 'Free'}
                            </Typography>
                          </Box>
                        </CardContent>

                        <Box sx={{ p: 3, pt: 0 }}>
                          <Button
                            component={Link}
                            to={`/course-viewer/${course._id}`}
                            variant="contained"
                            fullWidth
                            startIcon={<Rocket />}
                            sx={{
                              borderRadius: 2,
                              py: 1.5,
                              fontWeight: 600,
                              background: 'linear-gradient(45deg, #9c27b0, #673ab7)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #8e24aa, #5e35b1)',
                              },
                            }}
                          >
                            Start Learning
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Card
                  sx={{
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    p: 4,
                    textAlign: 'center',
                  }}
                >
                  <AutoAwesome sx={{ fontSize: '4rem', color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                    No AI Courses Available Yet
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    AI-generated courses are being created by our tutors. Check back soon!
                  </Typography>
                </Card>
              )}
            </Box>

            {/* Personalized Learning Path */}
            {learningPathData && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timeline sx={{ color: 'primary.main' }} />
                  Your AI Learning Path
                </Typography>

                <Card
                  sx={{
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    p: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Recommended Learning Journey
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                      {learningPathData.schedule?.description || 'Based on your current progress and interests, here\'s your personalized learning path:'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <Chip
                        label={`${learningPathData.schedule?.weeklyHours || 10} hours/week`}
                        sx={{ background: 'rgba(102, 126, 234, 0.2)', color: 'white' }}
                      />
                      <Chip
                        label={`${learningPathData.schedule?.sessionsPerWeek || 3} sessions/week`}
                        sx={{ background: 'rgba(102, 126, 234, 0.2)', color: 'white' }}
                      />
                    </Box>
                  </Box>

                  {learningPathData.courses && learningPathData.courses.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Recommended Courses:
                      </Typography>
                      <List>
                        {learningPathData.courses.map((course, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 1 }}>
                            <ListItemIcon>
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.9rem',
                                }}
                              >
                                {index + 1}
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={course.title}
                              secondary={`${course.estimatedHours} hours • ${course.description}`}
                              primaryTypographyProps={{
                                sx: { color: 'white', fontWeight: 500 },
                              }}
                              secondaryTypographyProps={{
                                sx: { color: 'rgba(255,255,255,0.7)' },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Card>
              </Box>
            )}

            {/* Request Custom AI Course */}
            <Box>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Psychology sx={{ color: 'primary.main' }} />
                Request Custom AI Course
              </Typography>

              <Card
                sx={{
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Psychology sx={{ fontSize: '4rem', color: 'rgba(255,255,255,0.3)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                  Want a Course on a Specific Topic?
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                  Our AI can generate custom courses tailored to your learning needs. Contact our tutors to request a personalized AI-generated course.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AutoAwesome />}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Request Custom Course
                </Button>
              </Card>
            </Box>
          </Box>
        )}

        {/* Recent Activity Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <Box key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'grey.100' }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={getActivityText(activity)}
                      secondary={activity.time}
                      primaryTypographyProps={{
                        variant: 'body1',
                        sx: { fontWeight: 500 },
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                        color: 'text.secondary',
                      }}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </List>
          </Box>
        )}

        {/* Achievements Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Achievements
            </Typography>
            <Grid container spacing={3}>
              {achievements.map((achievement, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    elevation={achievement.unlocked ? 4 : 1}
                    sx={{
                      borderRadius: 3,
                      opacity: achievement.unlocked ? 1 : 0.6,
                      position: 'relative',
                      overflow: 'visible',
                    }}
                  >
                    {achievement.unlocked && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          bgcolor: '#ffd700',
                          color: '#333',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          zIndex: 1,
                        }}
                      >
                        ✓
                      </Box>
                    )}
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        {achievement.icon}
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {achievement.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                      {!achievement.unlocked && (
                        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                          Not yet unlocked
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>

        {/* Revolutionary Quick Actions */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 5, 
            borderRadius: 6,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1) 1.2s',
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4, 
              fontWeight: 800,
              textAlign: 'center',
              background: 'linear-gradient(45deg, #ffffff 30%, #f0f8ff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'dashboardShimmer 3s ease-in-out infinite',
            }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {[
              { icon: <School />, label: 'Browse Courses', to: '/courses', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
              { icon: <Timeline />, label: 'View Progress', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
              { icon: <Assignment />, label: 'Take Quiz', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
              { icon: <EmojiEvents />, label: 'View Certificates', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
            ].map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Button
                  component={action.to ? Link : 'button'}
                  to={action.to}
                  fullWidth
                  startIcon={action.icon}
                  sx={{
                    py: 3,
                    px: 3,
                    borderRadius: 4,
                    background: action.color,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    opacity: 0.9,
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
                      transform: 'translateY(-8px) scale(1.05)',
                      opacity: 1,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      '&::before': {
                        transform: 'translateX(100%)',
                      }
                    },
                    animation: `dashboardFloat ${3 + index * 0.5}s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  {action.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>

      {/* Course Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Course</MenuItem>
        <MenuItem onClick={handleMenuClose}>Mark as Complete</MenuItem>
        <MenuItem onClick={handleMenuClose}>Leave Course</MenuItem>
      </Menu>
      </Container>
    </Box>
  )
}

export default Dashboard