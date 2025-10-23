import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Box,
  Pagination,
  Skeleton,
  Rating,
  Avatar,
  Paper,
  FormControl,
  Select,
  InputLabel,
  Stack,
  MenuItem,
} from '@mui/material'
import {
  Search as SearchIcon,
  AccessTime,
  People,
  Star,
} from '@mui/icons-material'
import { useAuthStore, useCourseStore } from '../store'
import mockCourses from '../mock/mockCourses'

function Courses() {
  // Pagination logic
  const [page, setPage] = useState(1)
  const limit = 12 // Items per page
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [activeCourse, setActiveCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)
  const [sortBy, setSortBy] = useState('popularity')

  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { enrollCourse, isEnrolled } = useCourseStore()

  // Filter mock data
  const courses = mockCourses.filter(course =>
    (!searchTerm || course.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedCategory || course.category === selectedCategory) &&
    (!selectedLevel || course.level === selectedLevel)
  )
  const totalCourses = courses.length
  const totalPages = Math.max(1, Math.ceil(courses.length / limit))

  const categories = [
    'Programming',
    'Data Science',
    'Design',
    'Business',
    'Marketing',
    'Photography',
    'Music',
    'Health & Fitness',
  ]

  const levels = ['Beginner', 'Intermediate', 'Advanced']

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    setPage(1)
  }

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
    setPage(1)
  }

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value)
    setPage(1)
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value)
    setPage(1)
  }

  const renderSkeletons = () => (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ borderRadius: 2 }}>
            <Skeleton variant="rectangular" height={160} />
            <CardContent>
              <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', mb: 2 }} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  // Enroll handler
  const handleEnroll = (courseId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/course/${courseId}` } })
      return
    }

    const course = mockCourses.find(c => c.id === courseId)
    if (course) {
      enrollCourse(course)
    }
    setActiveCourse(courseId)
    setActiveLesson(0)
    setShowQuiz(false)
    setQuizAnswers({})
    setQuizResult(null)
  }

  // Start course handler
  const handleStartCourse = (courseId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/course/${courseId}` } })
      return
    }

    setActiveCourse(courseId)
    setActiveLesson(0)
    setShowQuiz(false)
    setQuizAnswers({})
    setQuizResult(null)
    navigate(`/course/${courseId}`)
  }

  // Quiz answer handler
  const handleQuizAnswer = (idx, answer) => {
    setQuizAnswers(prev => ({ ...prev, [idx]: answer }))
  }

  // Submit quiz
  const handleSubmitQuiz = (course) => {
    let score = 0
    course.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answer) score++
    })
    setQuizResult({ score, total: course.quiz.length })
  }

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              color: '#111827', 
              mb: 2 
            }}
          >
            Courses
          </Typography>
        </Box>

        {/* Filters */}
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4, 
            border: '1px solid #e5e5e5',
            boxShadow: 'none',
            borderRadius: 2,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'white',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: '#e5e5e5',
                    },
                    '&:hover fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#111827',
                    },
                  }
                }}
              />
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={handleCategoryChange}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e5e5e5',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d1d5db',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#111827',
                    },
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Level Filter */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={selectedLevel}
                  label="Level"
                  onChange={handleLevelChange}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e5e5e5',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d1d5db',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#111827',
                    },
                  }}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {levels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort */}
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={handleSortChange}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e5e5e5',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d1d5db',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#111827',
                    },
                  }}
                >
                  <MenuItem value="popularity">Most Popular</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                  <MenuItem value="price_low">Price: Low to High</MenuItem>
                  <MenuItem value="price_high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Clear Filters */}
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  setSelectedLevel('')
                  setSortBy('popularity')
                  setPage(1)
                }}
                sx={{
                  borderColor: '#e5e5e5',
                  color: '#6b7280',
                  textTransform: 'none',
                  py: 1.75,
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#d1d5db',
                    bgcolor: '#f9fafb',
                  }
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: '#6b7280', mb: 2 }}>
              No courses found
            </Typography>
            <Typography variant="body1" sx={{ color: '#9ca3af' }}>
              Try adjusting your search criteria
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                <Card sx={{ borderRadius: 2, border: '1px solid #e5e5e5', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', '&:hover': { boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderColor: '#d1d5db' } }}>
                  <Box sx={{ height: 160, position: 'relative', borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: '#f3f4f6',
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="h3" sx={{ color: '#d1d5db' }}>📚</Typography>
                    </Box>
                    {course.category && (
                      <Chip label={course.category} size="small" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'white', border: '1px solid #e5e5e5', fontSize: '0.75rem', fontWeight: 500 }} />
                    )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 2, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{course.title}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: '#e5e5e5' }}><Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>{course.tutor?.name?.charAt(0) || 'T'}</Typography></Avatar>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>{course.tutor?.name || 'Expert Instructor'}</Typography>
                    </Box>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}><AccessTime sx={{ fontSize: '1rem', color: '#9ca3af', mr: 0.5 }} /><Typography variant="caption" sx={{ color: '#6b7280' }}>{course.duration || '8 weeks'}</Typography></Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}><People sx={{ fontSize: '1rem', color: '#9ca3af', mr: 0.5 }} /><Typography variant="caption" sx={{ color: '#6b7280' }}>{course.enrolledCount || 0} students</Typography></Box>
                    </Stack>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}><Rating value={4.5} precision={0.1} size="small" readOnly sx={{ color: '#fbbf24', mr: 1 }} /><Typography variant="body2" sx={{ color: '#6b7280' }}>4.5 (128 reviews)</Typography></Box>
                    <Typography variant="body2" sx={{ color: '#6b7280', mt: 2 }}>{course.description}</Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    {!isEnrolled(course.id) ? (
                      <Button fullWidth variant="contained" sx={{ bgcolor: '#111827', color: 'white', textTransform: 'none', fontWeight: 500, py: 1.5, borderRadius: 2, boxShadow: 'none', '&:hover': { bgcolor: '#1f2937', boxShadow: 'none' } }} onClick={() => handleEnroll(course.id)}>
                        Enroll Now
                      </Button>
                    ) : (
                      <Button fullWidth variant="contained" sx={{ bgcolor: '#2563eb', color: 'white', textTransform: 'none', fontWeight: 500, py: 1.5, borderRadius: 2, boxShadow: 'none', '&:hover': { bgcolor: '#1d4ed8', boxShadow: 'none' } }} onClick={() => navigate(`/course/${course.id}`)}>
                        Start Course
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#6b7280',
                  '&.Mui-selected': {
                    bgcolor: '#111827',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#1f2937',
                    }
                  },
                  '&:hover': {
                    bgcolor: '#f3f4f6',
                  }
                }
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Courses