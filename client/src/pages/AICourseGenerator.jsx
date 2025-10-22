import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  AutoAwesome,
  PlayCircle,
  Quiz,
  VideoLibrary,
  School,
  AccessTime,
  CheckCircle,
  Error,
  Psychology,
  YouTube,
} from '@mui/icons-material'
import { useAuthStore } from '../store'
import api from '../api/index.js'

function AICourseGenerator() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'intermediate',
    duration: '8 weeks',
    includeVideos: true,
    includeQuizzes: true,
  })

  const [generationProgress, setGenerationProgress] = useState(null)
  const [generatedCourse, setGeneratedCourse] = useState(null)

  const generateCourseMutation = useMutation({
    mutationFn: async (data) => {
      setGenerationProgress({
        step: 'Generating course outline...',
        progress: 10
      })

      const response = await api.post('/api/ai/generate-course', data)

      setGenerationProgress({
        step: 'Course created successfully!',
        progress: 100
      })

      return response.data
    },
    onSuccess: (data) => {
      setGeneratedCourse(data)
      setTimeout(() => setGenerationProgress(null), 2000)
    },
    onError: (error) => {
      setGenerationProgress(null)
      console.error('Course generation failed:', error)
    },
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.topic.trim()) return

    generateCourseMutation.mutate(formData)
  }

  const handleViewCourse = () => {
    if (generatedCourse?.course?._id) {
      navigate(`/courses/${generatedCourse.course._id}`)
    }
  }

  if (user?.role !== 'tutor' && user?.role !== 'admin') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Only tutors and administrators can generate AI courses.
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 800,
          mb: 2,
          textAlign: 'center',
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        AI Course Generator
      </Typography>

      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ textAlign: 'center', mb: 4 }}
      >
        Generate complete courses with AI-powered content, videos, and quizzes
      </Typography>

      <Grid container spacing={4}>
        {/* Course Generation Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Course Configuration
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Course Topic"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="e.g., React Development, Data Structures, Machine Learning"
                required
                fullWidth
                variant="outlined"
              />

              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  label="Difficulty Level"
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Course Duration</InputLabel>
                <Select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  label="Course Duration"
                >
                  <MenuItem value="4 weeks">4 weeks</MenuItem>
                  <MenuItem value="6 weeks">6 weeks</MenuItem>
                  <MenuItem value="8 weeks">8 weeks</MenuItem>
                  <MenuItem value="12 weeks">12 weeks</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Include Features
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.includeVideos}
                    onChange={(e) => handleInputChange('includeVideos', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <YouTube color="error" />
                    <Typography>Auto-find YouTube videos</Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.includeQuizzes}
                    onChange={(e) => handleInputChange('includeQuizzes', e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Quiz color="warning" />
                    <Typography>Generate AI quizzes</Typography>
                  </Box>
                }
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={generateCourseMutation.isPending || !formData.topic.trim()}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                  },
                }}
                startIcon={<AutoAwesome />}
              >
                {generateCourseMutation.isPending ? 'Generating Course...' : 'Generate Course'}
              </Button>
            </Box>

            {generateCourseMutation.isError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                Failed to generate course: {generateCourseMutation.error?.response?.data?.error || 'Unknown error'}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Generation Progress & Results */}
        <Grid item xs={12} md={6}>
          {generationProgress && (
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Generation Progress
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {generationProgress.step}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={generationProgress.progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Paper>
          )}

          {generatedCourse && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'success.main' }}>
                Course Generated Successfully! 🎉
              </Typography>

              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    {generatedCourse.course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {generatedCourse.course.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={generatedCourse.course.category} color="primary" size="small" />
                    <Chip label={formData.difficulty} color="secondary" size="small" />
                    <Chip label={formData.duration} icon={<AccessTime />} size="small" />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <School fontSize="small" />
                      {generatedCourse.stats.sections} sections
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PlayCircle fontSize="small" />
                      {generatedCourse.stats.lessons} lessons
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VideoLibrary fontSize="small" color="error" />
                      {generatedCourse.stats.videos} videos
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Quiz fontSize="small" color="warning" />
                      {generatedCourse.stats.quizzes} quizzes
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleViewCourse}
                  startIcon={<School />}
                  sx={{ flex: 1 }}
                >
                  View Course
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setGeneratedCourse(null)
                    setFormData({
                      topic: '',
                      difficulty: 'intermediate',
                      duration: '8 weeks',
                      includeVideos: true,
                      includeQuizzes: true,
                    })
                  }}
                >
                  Create Another
                </Button>
              </Box>
            </Paper>
          )}

          {/* Features Overview */}
          {!generationProgress && !generatedCourse && (
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                What AI Generates
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Psychology color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Complete Course Structure"
                    secondary="Sections, lessons, and learning objectives"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <YouTube color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="YouTube Video Integration"
                    secondary="Automatically finds and embeds relevant educational videos"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <Quiz color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="AI-Generated Quizzes"
                    secondary="Multiple choice, true/false, and multi-answer questions"
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <AutoAwesome color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Detailed Lesson Content"
                    secondary="Comprehensive notes, examples, and exercises"
                  />
                </ListItem>
              </List>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> AI-generated courses are created as drafts and should be reviewed by instructors before publishing.
                </Typography>
              </Alert>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default AICourseGenerator