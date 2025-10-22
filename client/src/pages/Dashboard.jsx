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
import { useAuthStore } from '../store'
import api from '../api/index.js'

// Revolutionary Dashboard Keyframe Animations
const keyframes = `
  @keyframes dashboardFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(1deg); }
  }

  @keyframes dashboardGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
    50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6), 0 0 60px rgba(118, 75, 162, 0.4); }
  }

  @keyframes dashboardShimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes dashboardPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }

  @keyframes dashboardRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes dashboardBounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0, -15px, 0); }
    70% { transform: translate3d(0, -7px, 0); }
    90% { transform: translate3d(0, -2px, 0); }
  }

  @keyframes dashboardSlide {
    0% { transform: translateX(-100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  @keyframes dashboardZoom {
    0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
    50% { transform: scale(1.05) rotate(2deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }

  @keyframes dashboardWave {
    0%, 100% { transform: translateY(0px) scaleY(1); }
    25% { transform: translateY(-5px) scaleY(1.02); }
    75% { transform: translateY(5px) scaleY(0.98); }
  }

  @keyframes dashboardGradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Inject keyframes into document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState(0)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Mock data for enrolled courses - in real app this would come from API
  const enrolledCourses = [
    {
      id: '1',
      title: 'React for Beginners',
      progress: 75,
      lastAccessed: '2 days ago',
      nextLesson: 'State Management',
      instructor: 'John Doe',
      rating: 4.8,
      category: 'Programming',
      thumbnail: 'https://picsum.photos/300/200?random=1',
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      progress: 45,
      lastAccessed: '1 week ago',
      nextLesson: 'Async Programming',
      instructor: 'Jane Smith',
      rating: 4.9,
      category: 'Programming',
      thumbnail: 'https://picsum.photos/300/200?random=2',
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      progress: 90,
      lastAccessed: '3 hours ago',
      nextLesson: 'Final Project',
      instructor: 'Mike Johnson',
      rating: 4.7,
      category: 'Design',
      thumbnail: 'https://picsum.photos/300/200?random=3',
    },
  ]

  const recentActivities = [
    { type: 'completed', course: 'React for Beginners', lesson: 'Components', time: '2 hours ago' },
    { type: 'enrolled', course: 'Advanced JavaScript', time: '1 week ago' },
    { type: 'certificate', course: 'HTML & CSS Basics', time: '2 weeks ago' },
    { type: 'quiz', course: 'React for Beginners', score: 85, time: '3 days ago' },
  ]

  const achievements = [
    { title: 'First Course Completed', description: 'Completed your first course', icon: '🎓', unlocked: true },
    { title: 'Week Streak', description: 'Learned for 7 consecutive days', icon: '🔥', unlocked: true },
    { title: 'Quiz Master', description: 'Scored 90%+ on 5 quizzes', icon: '🧠', unlocked: false },
    { title: 'Speed Learner', description: 'Completed a course in under a week', icon: '⚡', unlocked: false },
  ]

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
      value: 2, 
      icon: <CheckCircle />, 
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      animation: 'dashboardPulse 2s ease-in-out infinite'
    },
    { 
      label: 'Hours Learned', 
      value: 47, 
      icon: <AccessTime />, 
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      animation: 'dashboardBounce 2.5s ease-in-out infinite'
    },
    { 
      label: 'Certificates Earned', 
      value: 2, 
      icon: <EmojiEvents />, 
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      animation: 'dashboardWave 3.5s ease-in-out infinite'
    },
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
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
                color: 'rgba(255,255,255,0.7)',
                minHeight: 80,
                px: 4,
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
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
                  color: 'white',
                  transform: 'translateY(-2px)',
                  '&::before': {
                    transform: 'translateX(100%)',
                  }
                },
                '&.Mui-selected': {
                  color: 'white',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                  animation: 'dashboardGlow 2s ease-in-out infinite',
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
                {enrolledCourses.map((course, index) => (
                  <Grid item xs={12} md={6} lg={4} key={course.id}>
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
                            ${course.id === '1' ? '#667eea, #764ba2' : 
                              course.id === '2' ? '#4facfe, #00f2fe' : 
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
                            background: 'conic-gradient(white 0deg, white ' + (course.progress * 3.6) + 'deg, rgba(255,255,255,0.3) ' + (course.progress * 3.6) + 'deg)',
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
                            {course.progress}%
                          </Box>
                        </Box>
                      </Box>

                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, lineHeight: 1.3 }}>
                        {course.title}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                          {course.instructor.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {course.instructor}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                          <Star sx={{ fontSize: '1rem', color: '#ffd700', mr: 0.5 }} />
                          <Typography variant="body2">{course.rating}</Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {course.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={course.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              bgcolor: course.progress === 100 ? '#4caf50' : '#667eea',
                            },
                          }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Next: {course.nextLesson}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Last accessed {course.lastAccessed}
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 3, pt: 0 }}>
                      <Button
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
                        Continue Learning
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
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

        {/* Recent Activity Tab */}
        {activeTab === 1 && (
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
        {activeTab === 2 && (
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