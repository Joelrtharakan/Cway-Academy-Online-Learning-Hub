import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  LinearProgress,
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
} from '@mui/icons-material'
import { useAuthStore, useCourseStore } from "../store"

function Dashboard() {
  const [activeTab, setActiveTab] = useState(0)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const { user } = useAuthStore()
  const { enrolledCourses } = useCourseStore()

  // Calculate stats
  const stats = [
    {
      label: 'Courses Enrolled',
      value: enrolledCourses.length,
      icon: <School color="primary" />,
    },
    {
      label: 'Courses Completed',
      value: enrolledCourses.filter(course => course.enrollment?.progress === 100).length,
      icon: <CheckCircle color="success" />,
    },
    {
      label: 'Hours Learned',
      value: Math.floor(enrolledCourses.reduce((total, course) => total + (course.enrollment?.progress || 0) * 0.5, 0)),
      icon: <AccessTime color="info" />,
    },
    {
      label: 'Certificates Earned',
      value: enrolledCourses.filter(course => course.enrollment?.completedAt).length,
      icon: <EmojiEvents color="warning" />,
    },
  ]

  // Mock data for activities - generate based on enrolled courses
  const recentActivities = enrolledCourses.length > 0 ? [
    { type: 'enrolled', course: enrolledCourses[0]?.title || 'New Course', time: 'Recently' },
    ...(enrolledCourses.filter(c => c.enrollment?.progress > 0).slice(0, 2).map(course => ({
      type: 'completed',
      course: course.title,
      lesson: `Lesson ${course.enrollment?.currentLesson || 1}`,
      time: course.enrollment?.lastAccessed ? new Date(course.enrollment.lastAccessed).toLocaleDateString() : 'Recently'
    }))),
    ...(enrolledCourses.filter(c => c.enrollment?.completedAt).map(course => ({
      type: 'certificate',
      course: course.title,
      time: new Date(course.enrollment.completedAt).toLocaleDateString()
    })))
  ].slice(0, 4) : []

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
      case 'completed': return <CheckCircle color="success" />
      case 'enrolled': return <School color="primary" />
      case 'certificate': return <EmojiEvents color="warning" />
      case 'quiz': return <Assignment color="info" />
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
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Welcome back, {user?.name || 'Student'}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Continue your learning journey and track your progress
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
              }
            }}
          >
            <Tab label="My Courses" />
            <Tab label="Recent Activity" />
            <Tab label="Achievements" />
          </Tabs>

          {/* My Courses Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Continue Your Learning Journey
              </Typography>
              <Grid container spacing={3}>
                {enrolledCourses.length === 0 ? (
                  <Grid item xs={12}>
                    <Card sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        No enrolled courses yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Start your learning journey by enrolling in a course!
                      </Typography>
                      <Button
                        component={Link}
                        to="/courses"
                        variant="contained"
                      >
                        Browse Courses
                      </Button>
                    </Card>
                  </Grid>
                ) : (
                  enrolledCourses.map((course) => (
                    <Grid item xs={12} md={6} lg={4} key={course.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Chip
                              label={course.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, course)}
                            >
                              <MoreVert />
                            </IconButton>
                          </Box>

                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
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
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>

                          <Typography variant="body2" color="text.secondary">
                            Enrolled: {course.enrollment?.enrolledAt ? new Date(course.enrollment.enrolledAt).toLocaleDateString() : 'Recently'}
                          </Typography>

                          {course.enrollment?.completedAt && (
                            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'success.main', fontWeight: 500 }}>
                              ✓ Completed on {new Date(course.enrollment.completedAt).toLocaleDateString()}
                            </Typography>
                          )}
                        </CardContent>

                        <Box sx={{ p: 2, pt: 0 }}>
                          <Button
                            component={Link}
                            to={`/course/${course.id}`}
                            variant="contained"
                            fullWidth
                            startIcon={<PlayArrow />}
                          >
                            {course.enrollment?.progress === 100 ? 'Review Course' : 'Continue Learning'}
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>

              {enrolledCourses.length > 0 && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    component={Link}
                    to="/courses"
                    variant="outlined"
                  >
                    Browse More Courses
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Recent Activity Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <Box key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'background.paper' }}>
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
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Achievements
              </Typography>
              <Grid container spacing={3}>
                {achievements.map((achievement, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card sx={{ opacity: achievement.unlocked ? 1 : 0.6 }}>
                      <CardContent sx={{ textAlign: 'center' }}>
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

        {/* Quick Actions */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {[
              { icon: <School />, label: 'Browse Courses', to: '/courses' },
              { icon: <Timeline />, label: 'View Progress' },
              { icon: <Assignment />, label: 'Take Quiz' },
              { icon: <EmojiEvents />, label: 'View Certificates', to: '/certificates' },
            ].map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Button
                  component={action.to ? Link : 'button'}
                  to={action.to}
                  variant="outlined"
                  fullWidth
                  startIcon={action.icon}
                  sx={{
                    py: 2,
                    textTransform: 'none',
                    fontWeight: 500,
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
