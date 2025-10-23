import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  People,
  School,
  Assignment,
  TrendingUp,
  Download,
  Visibility,
  Star,
  Timeline,
  BarChart,
  PieChart,
} from '@mui/icons-material'
import { useAuthStore } from '../store'
import api from '../api/index.js'

function AnalyticsDashboard() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState(0)

  // Fetch system analytics (admin)
  const { data: systemAnalytics } = useQuery({
    queryKey: ['system-analytics'],
    queryFn: () => api.get('/api/analytics/system'),
    enabled: user?.role === 'admin',
  })

  // Fetch tutor's courses analytics
  const { data: coursesAnalytics } = useQuery({
    queryKey: ['courses-analytics'],
    queryFn: async () => {
      const courses = await api.get('/api/courses')
      const analytics = await Promise.all(
        courses.data.courses
          .filter(course => course.tutor === user._id)
          .map(course => api.get(`/api/analytics/course/${course._id}`))
      )
      return analytics.map((res, index) => ({
        course: courses.data.courses.filter(c => c.tutor === user._id)[index],
        analytics: res.data.analytics,
      }))
    },
    enabled: user?.role === 'tutor',
  })

  // Mock student analytics
  const studentAnalytics = {
    enrolledCourses: 5,
    completedCourses: 2,
    averageScore: 85,
    totalHours: 24,
    certificates: 2,
    currentStreak: 7,
  }

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              p: 1,
              borderRadius: 2,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Analytics Dashboard
      </Typography>

      {/* Admin Dashboard */}
      {user?.role === 'admin' && (
        <>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            System Overview
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={systemAnalytics?.analytics?.totalUsers || 0}
                icon={<People />}
                color="primary"
                subtitle="Registered users"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Courses"
                value={systemAnalytics?.analytics?.totalCourses || 0}
                icon={<School />}
                color="secondary"
                subtitle="Published courses"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Certificates"
                value={systemAnalytics?.analytics?.totalCertificates || 0}
                icon={<Assignment />}
                color="success"
                subtitle="Issued certificates"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenue"
                value={`$${systemAnalytics?.analytics?.revenue || 0}`}
                icon={<TrendingUp />}
                color="warning"
                subtitle="Total earnings"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>JD</Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">
                        John Doe enrolled in "React Masterclass"
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        2 hours ago
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>SM</Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">
                        Sarah Miller completed "JavaScript Fundamentals"
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        4 hours ago
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>TC</Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">
                        Tutor Course "Advanced Node.js" published
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        6 hours ago
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  System Health
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Server Uptime</Typography>
                      <Typography variant="body2">99.9%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={99.9} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Database Performance</Typography>
                      <Typography variant="body2">95.2%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={95.2} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">API Response Time</Typography>
                      <Typography variant="body2">120ms</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 4 }} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Tutor Dashboard */}
      {user?.role === 'tutor' && (
        <>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Your Courses Performance
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Students"
                value={coursesAnalytics?.reduce((sum, item) => sum + item.analytics.enrollmentCount, 0) || 0}
                icon={<People />}
                color="primary"
                subtitle="Across all courses"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Avg Completion"
                value={`${Math.round(coursesAnalytics?.reduce((sum, item) => sum + item.analytics.completionRate, 0) / (coursesAnalytics?.length || 1)) || 0}%`}
                icon={<TrendingUp />}
                color="success"
                subtitle="Course completion rate"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Avg Quiz Score"
                value={`${Math.round(coursesAnalytics?.reduce((sum, item) => sum + item.analytics.avgScore, 0) / (coursesAnalytics?.length || 1)) || 0}%`}
                icon={<Star />}
                color="warning"
                subtitle="Student performance"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Active Students"
                value={coursesAnalytics?.reduce((sum, item) => sum + item.analytics.activeStudents, 0) || 0}
                icon={<Timeline />}
                color="info"
                subtitle="Last 7 days"
              />
            </Grid>
          </Grid>

          <Paper elevation={2} sx={{ borderRadius: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Course Performance" />
                <Tab label="Student Progress" />
                <Tab label="Revenue" />
              </Tabs>
            </Box>

            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell align="center">Students</TableCell>
                        <TableCell align="center">Completion</TableCell>
                        <TableCell align="center">Avg Score</TableCell>
                        <TableCell align="center">Active</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {coursesAnalytics?.map((item) => (
                        <TableRow key={item.course._id}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.course.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.course.category}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={item.analytics.enrollmentCount}
                              size="small"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Typography variant="body2">
                                {item.analytics.completionRate}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={item.analytics.completionRate}
                                sx={{ width: 60, height: 6 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.analytics.avgScore}%
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={item.analytics.activeStudents}
                              size="small"
                              color="success"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Export Data">
                              <IconButton size="small">
                                <Download />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Student Progress Overview
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40 }}>JD</Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        John Doe
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        React Masterclass - 85% complete
                      </Typography>
                    </Box>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40 }}>SM</Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Sarah Miller
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        JavaScript Fundamentals - 92% complete
                      </Typography>
                    </Box>
                    <Chip label="Active" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40 }}>TC</Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Tom Chen
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Node.js Advanced - 45% complete
                      </Typography>
                    </Box>
                    <Chip label="Inactive" color="warning" size="small" />
                  </Box>
                </Box>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Revenue Analytics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={1}>
                      <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                          $2,450
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          This Month
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card elevation={1}>
                      <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          $12,850
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Earnings
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </>
      )}

      {/* Student Dashboard */}
      {user?.role === 'student' && (
        <>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Your Learning Progress
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Enrolled Courses"
                value={studentAnalytics.enrolledCourses}
                icon={<School />}
                color="primary"
                subtitle="Active enrollments"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed"
                value={studentAnalytics.completedCourses}
                icon={<Assignment />}
                color="success"
                subtitle="Finished courses"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Average Score"
                value={`${studentAnalytics.averageScore}%`}
                icon={<Star />}
                color="warning"
                subtitle="Quiz performance"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Study Hours"
                value={studentAnalytics.totalHours}
                icon={<Timeline />}
                color="info"
                subtitle="Total learning time"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Current Courses
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                      <School />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        React Masterclass
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        75% complete • 12 lessons left
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={75} sx={{ width: 80, height: 6 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}>
                      <School />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        JavaScript Fundamentals
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        90% complete • 3 lessons left
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={90} sx={{ width: 80, height: 6 }} />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Achievements
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'success.main' }}>
                      🏆
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        First Course Completed
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Earned 2 weeks ago
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'warning.main' }}>
                      🔥
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        7 Day Streak
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Keep it up!
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: 'info.main' }}>
                      ⭐
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Perfect Quiz Score
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        100% on React Hooks quiz
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  )
}

export default AnalyticsDashboard