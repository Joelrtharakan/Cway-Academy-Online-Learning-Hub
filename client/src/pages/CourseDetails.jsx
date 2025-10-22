import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Rating,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  IconButton,
  Divider,
  Stack,
} from '@mui/material'
import {
  PlayArrow,
  CheckCircle,
  ExpandMore,
  AccessTime,
  People,
  Star,
  Book,
  Assignment,
  VideoLibrary,
  Article,
  Quiz,
  Download,
  Share,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material'
import { useAuthStore } from '../store'
import api from '../api/index.js'

function CourseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState(0)
  const [expandedLesson, setExpandedLesson] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  // Mock course data - in real app this would come from API
  const course = {
    _id: id,
    title: 'Complete React Developer Course with Hands-on Projects',
    description: 'Master React from basics to advanced concepts with real-world projects. Learn hooks, context, Redux, and build production-ready applications.',
    category: 'Programming',
    difficulty: 'intermediate',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    totalRatings: 1250,
    students: 15420,
    duration: '12 weeks',
    language: 'English',
    lastUpdated: '2024-01-15',
    thumbnail: 'https://picsum.photos/600/400?random=course',
    tutor: {
      name: 'Sarah Johnson',
      title: 'Senior React Developer',
      avatar: 'https://picsum.photos/100/100?random=tutor',
      bio: '10+ years of experience in React development. Worked at Google and Netflix.',
      rating: 4.9,
      students: 50000,
      courses: 15,
    },
    curriculum: [
      {
        title: 'Getting Started with React',
        duration: '2 hours',
        lessons: [
          { title: 'Introduction to React', type: 'video', duration: '15 min', completed: true },
          { title: 'Setting up Development Environment', type: 'video', duration: '20 min', completed: true },
          { title: 'Your First React Component', type: 'video', duration: '25 min', completed: true },
          { title: 'JSX Fundamentals', type: 'article', duration: '10 min', completed: true },
        ],
      },
      {
        title: 'Components and Props',
        duration: '3 hours',
        lessons: [
          { title: 'Component Types', type: 'video', duration: '30 min', completed: true },
          { title: 'Props and State', type: 'video', duration: '35 min', completed: false },
          { title: 'Component Composition', type: 'video', duration: '25 min', completed: false },
          { title: 'Conditional Rendering', type: 'article', duration: '15 min', completed: false },
        ],
      },
      {
        title: 'Hooks and State Management',
        duration: '4 hours',
        lessons: [
          { title: 'useState Hook', type: 'video', duration: '40 min', completed: false },
          { title: 'useEffect Hook', type: 'video', duration: '35 min', completed: false },
          { title: 'Custom Hooks', type: 'video', duration: '45 min', completed: false },
          { title: 'Context API', type: 'video', duration: '50 min', completed: false },
        ],
      },
    ],
    requirements: [
      'Basic knowledge of HTML, CSS, and JavaScript',
      'Node.js installed on your computer',
      'A code editor (VS Code recommended)',
      'Basic understanding of ES6+ features',
    ],
    whatYouWillLearn: [
      'Build modern React applications from scratch',
      'Master React Hooks and functional components',
      'Implement state management with Context and Redux',
      'Create responsive user interfaces',
      'Work with APIs and handle asynchronous operations',
      'Deploy React applications to production',
    ],
    reviews: [
      {
        user: 'Alex Chen',
        avatar: 'https://picsum.photos/40/40?random=review1',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Excellent course! The projects are very practical and the explanations are clear.',
      },
      {
        user: 'Maria Garcia',
        avatar: 'https://picsum.photos/40/40?random=review2',
        rating: 5,
        date: '1 month ago',
        comment: 'Sarah is an amazing instructor. She explains complex concepts very well.',
      },
      {
        user: 'David Wilson',
        avatar: 'https://picsum.photos/40/40?random=review3',
        rating: 4,
        date: '6 weeks ago',
        comment: 'Great content and well-structured. Some sections could be updated.',
      },
    ],
  }

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Handle enrollment logic
    console.log('Enrolling in course:', id)
  }

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return <VideoLibrary />
      case 'article': return <Article />
      case 'quiz': return <Quiz />
      default: return <Book />
    }
  }

  const totalLessons = course.curriculum.reduce((acc, section) => acc + section.lessons.length, 0)
  const completedLessons = course.curriculum.reduce((acc, section) =>
    acc + section.lessons.filter(lesson => lesson.completed).length, 0
  )
  const progress = (completedLessons / totalLessons) * 100

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Course Header */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            {course.title}
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            {course.description}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Chip label={course.category} color="primary" />
            <Chip
              label={course.difficulty}
              color={
                course.difficulty === 'beginner' ? 'success' :
                course.difficulty === 'intermediate' ? 'warning' : 'error'
              }
            />
            <Chip label={`${course.duration}`} icon={<AccessTime />} />
            <Chip label={`${course.students.toLocaleString()} students`} icon={<People />} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Rating value={course.rating} readOnly precision={0.1} sx={{ mr: 1 }} />
            <Typography variant="body1" sx={{ mr: 1, fontWeight: 500 }}>
              {course.rating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({course.totalRatings.toLocaleString()} ratings)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={course.tutor.avatar} sx={{ width: 50, height: 50 }}>
              {course.tutor.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Created by {course.tutor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {course.tutor.title}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', position: 'sticky', top: 20 }}>
            <Box
              sx={{
                height: 200,
                bgcolor: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                position: 'relative',
              }}
            >
              <IconButton
                onClick={() => setIsFavorited(!isFavorited)}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  color: isFavorited ? 'red' : 'grey.400',
                  '&:hover': { bgcolor: 'white' },
                }}
              >
                {isFavorited ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Box>

            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mr: 1 }}>
                  ${course.price}
                </Typography>
                <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                  ${course.originalPrice}
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleEnroll}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    bgcolor: '#667eea',
                    '&:hover': { bgcolor: '#5a6fd8' },
                  }}
                >
                  {isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Share />}
                  sx={{ borderRadius: 2 }}
                >
                  Share Course
                </Button>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                This course includes:
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <VideoLibrary sx={{ color: '#667eea' }} />
                  </ListItemIcon>
                  <ListItemText primary={`${totalLessons} on-demand video lessons`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Download sx={{ color: '#667eea' }} />
                  </ListItemIcon>
                  <ListItemText primary="Downloadable resources" />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircle sx={{ color: '#667eea' }} />
                  </ListItemIcon>
                  <ListItemText primary="Certificate of completion" />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AccessTime sx={{ color: '#667eea' }} />
                  </ListItemIcon>
                  <ListItemText primary="Full lifetime access" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Course Content Tabs */}
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            },
          }}
        >
          <Tab label="Curriculum" />
          <Tab label="About" />
          <Tab label="Reviews" />
        </Tabs>

        {/* Curriculum Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Course Content
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  {totalLessons} lessons • {course.duration}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {completedLessons} of {totalLessons} completed ({Math.round(progress)}%)
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    bgcolor: '#667eea',
                  },
                }}
              />
            </Box>

            {course.curriculum.map((section, sectionIndex) => (
              <Accordion
                key={sectionIndex}
                expanded={expandedLesson === sectionIndex}
                onChange={() => setExpandedLesson(expandedLesson === sectionIndex ? false : sectionIndex)}
                sx={{ mb: 1, borderRadius: 2, '&:before': { display: 'none' } }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto', mr: 2 }}>
                    {section.duration}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <List>
                    {section.lessons.map((lesson, lessonIndex) => (
                      <ListItem
                        key={lessonIndex}
                        button
                        sx={{
                          borderBottom: lessonIndex < section.lessons.length - 1 ? 1 : 0,
                          borderColor: 'divider',
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {lesson.completed ? (
                            <CheckCircle sx={{ color: '#4caf50' }} />
                          ) : (
                            getLessonIcon(lesson.type)
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={lesson.title}
                          secondary={lesson.duration}
                          primaryTypographyProps={{
                            sx: {
                              textDecoration: lesson.completed ? 'line-through' : 'none',
                              color: lesson.completed ? 'text.secondary' : 'text.primary',
                            },
                          }}
                        />
                        <IconButton size="small">
                          <PlayArrow />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {/* About Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                  About This Course
                </Typography>

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  What you'll learn
                </Typography>
                <List>
                  {course.whatYouWillLearn.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircle sx={{ color: '#4caf50' }} />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
                  Requirements
                </Typography>
                <List>
                  {course.requirements.map((requirement, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={requirement} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Instructor
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={course.tutor.avatar} sx={{ width: 60, height: 60, mr: 2 }}>
                      {course.tutor.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {course.tutor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.tutor.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Star sx={{ color: '#ffd700', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {course.tutor.rating} Instructor Rating
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {course.tutor.students.toLocaleString()} students
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {course.tutor.courses} courses
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 2, lineHeight: 1.6 }}>
                    {course.tutor.bio}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Reviews Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Student Reviews
            </Typography>

            <Grid container spacing={3}>
              {course.reviews.map((review, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={review.avatar} sx={{ mr: 2 }}>
                        {review.user.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {review.user}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.date}
                        </Typography>
                      </Box>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                      {review.comment}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  )
}

export default CourseDetails