import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
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
} from '@mui/material'
import {
  Search as SearchIcon,
  AccessTime,
  People,
  Star,
} from '@mui/icons-material'
import api from '../api/index.js'

function Courses() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [page, setPage] = useState(1)
  const limit = 12

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses', { page, limit, search: searchTerm, category: selectedCategory, level: selectedLevel, sort: sortBy }],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedLevel && { level: selectedLevel }),
        ...(sortBy && { sort: sortBy }),
      })
      return api.get(`/api/courses?${params}`)
    },
  })

  const courses = coursesData?.data?.courses || []
  const totalPages = coursesData?.data?.totalPages || 1
  const totalCourses = coursesData?.data?.total || 0

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
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#6b7280', 
              fontWeight: 400 
            }}
          >
            {totalCourses > 0 ? `${totalCourses} courses available` : 'Discover our courses'}
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
        {isLoading ? (
          renderSkeletons()
        ) : courses.length === 0 ? (
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
              <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    border: '1px solid #e5e5e5',
                    boxShadow: 'none',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      borderColor: '#d1d5db',
                    }
                  }}
                >
                  {/* Course Image */}
                  <Box
                    sx={{
                      height: 160,
                      bgcolor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      borderRadius: '8px 8px 0 0',
                    }}
                  >
                    <Typography variant="h3" sx={{ color: '#d1d5db' }}>
                      📚
                    </Typography>
                    {course.category && (
                      <Chip
                        label={course.category}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: 'white',
                          border: '1px solid #e5e5e5',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#111827',
                        mb: 2,
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {course.title}
                    </Typography>

                    {/* Instructor */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: '#e5e5e5' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {course.tutor?.name?.charAt(0) || 'T'}
                        </Typography>
                      </Avatar>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {course.tutor?.name || 'Expert Instructor'}
                      </Typography>
                    </Box>

                    {/* Course Info */}
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: '1rem', color: '#9ca3af', mr: 0.5 }} />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {course.duration || '8 weeks'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <People sx={{ fontSize: '1rem', color: '#9ca3af', mr: 0.5 }} />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {course.enrolledCount || 0} students
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Rating */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating
                        value={4.5}
                        precision={0.1}
                        size="small"
                        readOnly
                        sx={{ color: '#fbbf24', mr: 1 }}
                      />
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        4.5 (128 reviews)
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      component={Link}
                      to={`/courses/${course._id}`}
                      fullWidth
                      variant="contained"
                      sx={{
                        bgcolor: '#111827',
                        color: 'white',
                        textTransform: 'none',
                        fontWeight: 500,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: '#1f2937',
                          boxShadow: 'none',
                        }
                      }}
                    >
                      View Course
                    </Button>
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