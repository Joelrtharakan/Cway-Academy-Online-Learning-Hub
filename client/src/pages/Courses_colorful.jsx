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
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Stack,
  Fade,
  Zoom,
  Slide,
} from '@mui/material'
import {
  Search as SearchIcon,
  Sort,
  Favorite,
  FavoriteBorder,
  AccessTime,
  People,
  Star,
  PlayArrow,
  Rocket,
  AutoAwesome,
  TrendingUp,
  School,
  Psychology,
  Speed,
} from '@mui/icons-material'
import { keyframes } from '@mui/system'
import api from '../api/index.js'

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
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

function Courses() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [difficulty, setDifficulty] = useState('')
  const [favorites, setFavorites] = useState(new Set())
  const [sortAnchorEl, setSortAnchorEl] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', search, category, page, sortBy, difficulty],
    queryFn: () =>
      api.get('/api/courses', {
        params: { search, category, page, limit: 12, sort: sortBy, difficulty },
      }),
  })

  const categories = ['Programming', 'Design', 'Math', 'Business', 'Science', 'Marketing', 'Data Science', 'AI/ML']
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ]

  const handleFavoriteToggle = (courseId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(courseId)) {
        newFavorites.delete(courseId)
      } else {
        newFavorites.add(courseId)
      }
      return newFavorites
    })
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Failed to load courses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please try again later or contact support if the problem persists.
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Box>
      {/* Revolutionary Hero Section */}
      <Box
        sx={{
          minHeight: '60vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: `${float} 6s ease-in-out infinite`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
            animation: `${shimmer} 4s ease-in-out infinite`,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Fade in={isLoaded} timeout={1500}>
            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  fontWeight: 900,
                  color: 'white',
                  mb: 3,
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                🚀 Discover Your Next{' '}
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
                  Breakthrough
                </Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255,255,255,0.95)',
                  mb: 4,
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.6,
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
              >
                From AI mastery to coding bootcamps - explore our premium collection of courses designed to catapult your career to new heights.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -8, mb: 4, position: 'relative', zIndex: 3 }}>
        {/* Revolutionary Search and Filter Section */}
        <Slide direction="up" in={isLoaded} timeout={1500}>
          <Paper 
            elevation={12} 
            sx={{ 
              p: 4, 
              mb: 6, 
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
              },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 3,
                textAlign: 'center',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              🔍 Find Your Perfect Course
            </Typography>
            
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Search for your next breakthrough..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 4,
                      fontSize: '1.1rem',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={7}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
                  {/* Category Filter */}
                  <FormControl 
                    sx={{ 
                      minWidth: 180,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  >
                    <InputLabel>🎯 Category</InputLabel>
                    <Select
                      value={category}
                      label="🎯 Category"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {cat === 'Programming' && <Psychology sx={{ mr: 1, color: '#667eea' }} />}
                            {cat === 'Design' && <AutoAwesome sx={{ mr: 1, color: '#f093fb' }} />}
                            {cat === 'Data Science' && <TrendingUp sx={{ mr: 1, color: '#4ECDC4' }} />}
                            {cat === 'AI/ML' && <Rocket sx={{ mr: 1, color: '#FF6B6B' }} />}
                            {!['Programming', 'Design', 'Data Science', 'AI/ML'].includes(cat) && <School sx={{ mr: 1, color: '#95E1D3' }} />}
                            {cat}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Difficulty Filter */}
                  <FormControl 
                    sx={{ 
                      minWidth: 160,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  >
                    <InputLabel>⚡ Level</InputLabel>
                    <Select
                      value={difficulty}
                      label="⚡ Level"
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <MenuItem value="">All Levels</MenuItem>
                      {difficulties.map((level) => (
                        <MenuItem key={level} value={level.toLowerCase()}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {level === 'Beginner' && '🌱'}
                            {level === 'Intermediate' && '🚀'}
                            {level === 'Advanced' && '💎'}
                            <Box sx={{ ml: 1 }}>{level}</Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Enhanced Sort Menu */}
                  <Button
                    variant="outlined"
                    onClick={(e) => setSortAnchorEl(e.currentTarget)}
                    startIcon={<Sort />}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        borderColor: '#5a6fd8',
                      },
                    }}
                  >
                    Sort By
                  </Button>
                  <Menu
                    anchorEl={sortAnchorEl}
                    open={Boolean(sortAnchorEl)}
                    onClose={() => setSortAnchorEl(null)}
                    PaperProps={{
                      sx: {
                        borderRadius: 3,
                        mt: 1,
                      },
                    }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        selected={sortBy === option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setSortAnchorEl(null)
                        }}
                        sx={{
                          '&.Mui-selected': {
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {option.value === 'popular' && <TrendingUp sx={{ mr: 1, color: '#FF6B6B' }} />}
                          {option.value === 'newest' && <Speed sx={{ mr: 1, color: '#4ECDC4' }} />}
                          {option.value === 'rating' && <Star sx={{ mr: 1, color: '#FFD700' }} />}
                          {(option.value === 'price-low' || option.value === 'price-high') && <AutoAwesome sx={{ mr: 1, color: '#667eea' }} />}
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Menu>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Slide>

        {/* Active Filters */}
        {(category || difficulty || search) && (
          <Fade in={true} timeout={1000}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#667eea' }}>
                🎯 Active Filters
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {search && (
                  <Chip
                    label={`🔍 "${search}"`}
                    onDelete={() => setSearch('')}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-deleteIcon': { color: 'white' },
                    }}
                  />
                )}
                {category && (
                  <Chip
                    label={`📚 ${category}`}
                    onDelete={() => setCategory('')}
                    sx={{
                      background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-deleteIcon': { color: 'white' },
                    }}
                  />
                )}
                {difficulty && (
                  <Chip
                    label={`⭐ ${difficulty}`}
                    onDelete={() => setDifficulty('')}
                    sx={{
                      background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-deleteIcon': { color: 'white' },
                    }}
                  />
                )}
              </Stack>
            </Paper>
          </Fade>
        )}

        {/* Results Count */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
            🎓 {data?.data?.pagination?.total || 0} Premium Courses Available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Handpicked by industry experts for maximum career impact
          </Typography>
        </Box>

        {/* Spectacular Courses Grid */}
        <Grid container spacing={4}>
          {isLoading
            ? Array.from({ length: 12 }).map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={index}>
                  <Card 
                    sx={{ 
                      borderRadius: 4, 
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Skeleton variant="rectangular" height={200} animation="wave" />
                    <CardContent sx={{ p: 3 }}>
                      <Skeleton variant="text" height={32} width="85%" animation="wave" />
                      <Skeleton variant="text" height={24} width="70%" animation="wave" />
                      <Skeleton variant="text" height={20} width="50%" animation="wave" />
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                        <Skeleton variant="circular" width={40} height={40} animation="wave" />
                        <Box sx={{ ml: 2 }}>
                          <Skeleton variant="text" height={18} width={100} animation="wave" />
                          <Skeleton variant="text" height={16} width={80} animation="wave" />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : data?.data?.courses?.map((course, index) => (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={course._id}>
                  <Zoom in={true} timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        position: 'relative',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-12px) rotateX(5deg)',
                          boxShadow: '0 25px 50px rgba(102,126,234,0.3)',
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
                          background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
                          opacity: 0,
                          transition: 'opacity 0.4s ease',
                          pointerEvents: 'none',
                        },
                      }}
                    >
                      {/* Revolutionary Course Thumbnail */}
                      <Box
                        sx={{
                          height: 200,
                          background: `linear-gradient(135deg, ${['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][index % 6]} 0%, ${['#FF8E6B', '#6BCF7F', '#74B9FF', '#A8E6CF', '#FFD93D', '#C39BD3'][index % 6]} 100%)`,
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
                            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                            animation: `${shimmer} 3s ease-in-out infinite`,
                          },
                        }}
                      >
                        <IconButton
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.25)',
                            color: 'white',
                            width: 70,
                            height: 70,
                            fontSize: '2rem',
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
                          <PlayArrow sx={{ fontSize: '2.5rem' }} />
                        </IconButton>
                        
                        {/* Premium Badge */}
                        <Chip
                          label="PREMIUM"
                          sx={{
                            position: 'absolute',
                            top: 15,
                            right: 15,
                            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                            color: '#000',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            animation: `${glow} 2s ease-in-out infinite`,
                          }}
                        />
                        
                        {/* Category Badge */}
                        <Chip
                          label={course.category}
                          sx={{
                            position: 'absolute',
                            top: 15,
                            left: 15,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: '#333',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                          }}
                        />
                        
                        {/* Favorite Button */}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFavoriteToggle(course._id)
                          }}
                          sx={{
                            position: 'absolute',
                            bottom: 15,
                            right: 15,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            color: favorites.has(course._id) ? '#FF6B6B' : '#666',
                            '&:hover': { 
                              bgcolor: 'white',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {favorites.has(course._id) ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                      </Box>

                      {/* Revolutionary Card Content */}
                      <CardContent sx={{ p: 4, flexGrow: 1, position: 'relative', zIndex: 1 }}>
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{
                            mb: 2,
                            fontWeight: 700,
                            lineHeight: 1.3,
                            color: '#333',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {course.title}
                        </Typography>

                        <Typography
                          variant="body1"
                          sx={{
                            mb: 3,
                            lineHeight: 1.6,
                            color: '#666',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {course.description}
                        </Typography>

                        {/* Enhanced Instructor Info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              mr: 2,
                              border: '2px solid rgba(102,126,234,0.2)',
                            }}
                          >
                            {course.tutor?.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                              {course.tutor?.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 500 }}>
                              Expert Instructor
                            </Typography>
                          </Box>
                        </Box>

                        {/* Enhanced Stats */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={4.8} readOnly size="small" sx={{ mr: 1, color: '#FFD700' }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              4.8
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                              icon={<People />}
                              label="2.5K"
                              size="small"
                              sx={{ bgcolor: 'rgba(102,126,234,0.1)', color: '#667eea', fontWeight: 600 }}
                            />
                            <Chip
                              icon={<AccessTime />}
                              label="12h"
                              size="small"
                              sx={{ bgcolor: 'rgba(255,107,107,0.1)', color: '#FF6B6B', fontWeight: 600 }}
                            />
                          </Box>
                        </Box>

                        {/* Price Section */}
                        {course.price && (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 800,
                              background: 'linear-gradient(45deg, #667eea, #764ba2)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}>
                              ${course.price}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              textDecoration: 'line-through', 
                              color: '#999',
                              fontSize: '1.1rem',
                            }}>
                              $149
                            </Typography>
                          </Box>
                        )}
                      </CardContent>

                      {/* Revolutionary Action Section */}
                      <CardActions sx={{ px: 4, pb: 4, position: 'relative', zIndex: 1 }}>
                        <Button
                          component={Link}
                          to={`/courses/${course._id}`}
                          variant="contained"
                          fullWidth
                          sx={{
                            py: 1.5,
                            borderRadius: 3,
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1rem',
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
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                              transition: 'left 0.6s',
                            },
                            '&:hover': {
                              transform: 'scale(1.02)',
                              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                              '&::before': {
                                left: '100%',
                              },
                            },
                            transition: 'all 0.3s ease',
                          }}
                          startIcon={<Rocket />}
                        >
                          Enroll Now
                        </Button>
                      </CardActions>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
        </Grid>

        {/* Enhanced Pagination */}
        {data?.data?.pagination && data.data.pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Pagination
              count={data.data.pagination.totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&.Mui-selected': {
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Courses