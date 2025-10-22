import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import api from '../../api'

function Courses() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses', search, category, page],
    queryFn: () =>
      api.get('/api/courses', {
        params: { search, category, page, limit: 12 },
      }),
  })

  const categories = ['Programming', 'Design', 'Math', 'Business', 'Science']

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error">Failed to load courses</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Browse Courses
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant={category === '' ? 'contained' : 'outlined'}
                onClick={() => setCategory('')}
                size="small"
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? 'contained' : 'outlined'}
                  onClick={() => setCategory(cat)}
                  size="small"
                >
                  {cat}
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Courses Grid */}
      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={20} />
                    <Skeleton variant="text" height={20} width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : data?.data?.courses?.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip label={course.category} size="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        by {course.tutor.name}
                      </Typography>
                    </Box>
                    {course.price && (
                      <Typography variant="h6" color="primary">
                        ${course.price}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View Details
                    </Button>
                    <Button size="small" variant="contained">
                      Enroll
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
      </Grid>

      {/* Pagination */}
      {data?.data?.pagination && data.data.pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={data.data.pagination.pages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  )
}

export default Courses