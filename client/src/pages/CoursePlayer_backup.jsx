import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import YouTube from 'react-youtube'
import {
  Container,
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Alert,
  Grid,
  Divider,
  Stack,
  Fab,
  Tooltip,
  CircularProgress,
} from '@mui/material'
import {
  PlayArrow,
  CheckCircle,
  Lock,
  Quiz as QuizIcon,
  Chat,
  Download,
  ArrowBack,
  ArrowForward,
  Fullscreen,
  FullscreenExit,
  VolumeUp,
  VolumeOff,
  SkipNext,
  SkipPrevious,
  Timer,
  Send,
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material'
import { useAuthStore } from '../store'
import { useSocket } from '../context/SocketContext'
import mockCourses from '../mock/mockCourses'

function CoursePlayer() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { socket, isConnected, joinCourse, leaveCourse, sendMessage, startTyping, stopTyping } = useSocket()
  const [activeTab, setActiveTab] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [quizDialog, setQuizDialog] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizTimeLeft, setQuizTimeLeft] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [quizResults, setQuizResults] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [youtubePlayer, setYoutubePlayer] = useState(null)
  const [lessonStartTime, setLessonStartTime] = useState(0)
  const [lessonEndTime, setLessonEndTime] = useState(0)
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [chatMessage, setChatMessage] = useState('')

  // Find course from mockCourses
  const course = mockCourses.find(c => c.id === courseId)
  const lessons = course?.sections?.flatMap(section => section.lessons) || []
  const quiz = currentLesson?.quiz

  // If course not found, show error
  if (!course) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Course Not Found</h1>
        <p>The course you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    )
  }

  // Initialize currentLesson if not set
  useEffect(() => {
    console.log('useEffect running', { course, lessonId, currentLesson })
    if (course?.sections && !currentLesson) {
      let targetLesson = null

      if (lessonId) {
        // Find lesson by ID across all sections
        for (const section of course.sections) {
          const lesson = section.lessons.find(l => l.id === lessonId)
          if (lesson) {
            targetLesson = { ...lesson, sectionTitle: section.title }
            break
          }
        }
      } else {
        // Get first lesson from first section
        const firstSection = course.sections[0]
        if (firstSection?.lessons?.length > 0) {
          targetLesson = {
            ...firstSection.lessons[0],
            sectionTitle: firstSection.title
          }
        }
      }

      console.log('Setting targetLesson:', targetLesson)
      if (targetLesson) {
        setCurrentLesson(targetLesson)
      }
    }
  }, [course, lessonId])

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/courses')}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {course.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentLesson?.title || 'Loading...'}
          </Typography>
        </Box>
        <Chip
          label={`${lessons.length} lessons`}
          variant="outlined"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 48,
                },
              }}
            >
              <Tab label="Lesson" />
              <Tab label="Quiz" disabled={!currentLesson?.quiz} />
              <Tab label="Discussions" />
              <Tab label="Resources" />
            </Tabs>

            <Box sx={{ p: 0 }}>
              {/* Lesson Tab */}
              {activeTab === 0 && (
                <Box>
                  {currentLesson ? (
                    <Box>
                      {/* YouTube Video Player */}
                      {currentLesson.videoUrl && (
                        <Box sx={{ position: 'relative', width: '100%', height: 0, paddingBottom: '56.25%', mb: 2 }}>
                          <YouTube
                            videoId={extractYouTubeId(currentLesson.videoUrl)}
                            opts={{
                              width: '100%',
                              height: '100%',
                              playerVars: {
                                autoplay: 0,
                                modestbranding: 1,
                                rel: 0,
                              },
                            }}
                            onReady={onYouTubeReady}
                            onStateChange={onYouTubeStateChange}
                            onPlaybackRateChange={onYouTubePlaybackRateChange}
                            onPlaybackQualityChange={onYouTubePlaybackQualityChange}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </Box>
                      )}

                      {/* Lesson Content */}
                      <Box sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          {currentLesson.title}
                        </Typography>

                        {currentLesson.textNotes && (
                          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                            {currentLesson.textNotes}
                          </Typography>
                        )}

                        {/* Lesson Actions */}
                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                          <Button
                            variant="outlined"
                            startIcon={<SkipPrevious />}
                            disabled={!getPreviousLesson()}
                            onClick={() => {
                              const prev = getPreviousLesson()
                              if (prev) handleLessonSelect(prev.lesson, prev.section.title)
                            }}
                          >
                            Previous
                          </Button>

                          {currentLesson.quiz && (
                            <Button
                              variant="contained"
                              startIcon={<QuizIcon />}
                              onClick={handleQuizStart}
                              sx={{ mx: 'auto' }}
                            >
                              Take Quiz
                            </Button>
                          )}

                          <Button
                            variant="contained"
                            endIcon={<SkipNext />}
                            disabled={!getNextLesson()}
                            onClick={() => {
                              const next = getNextLesson()
                              if (next) handleLessonSelect(next.lesson, next.section.title)
                            }}
                          >
                            Next Lesson
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary">
                        Loading lesson...
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Quiz Tab */}
              {activeTab === 1 && (
                <Box sx={{ p: 3 }}>
                  {currentLesson?.quiz ? (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        {currentLesson.quiz.description || 'Lesson Quiz'}
                      </Typography>

                      <Button
                        variant="contained"
                        startIcon={<QuizIcon />}
                        onClick={handleQuizStart}
                        size="large"
                        sx={{ mb: 3 }}
                      >
                        Start Quiz
                      </Button>

                      <Typography variant="body2" color="text.secondary">
                        Time Limit: {formatTime(currentLesson.quiz.timeLimitSec || 600)} |
                        Passing Score: {currentLesson.quiz.passingScore || 80}%
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary">
                        No quiz available for this lesson
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Discussions Tab */}
              {activeTab === 2 && (
                <Box sx={{ height: 500, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                    {messages.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No messages yet. Start the conversation!
                      </Typography>
                    ) : (
                      messages.map((message, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {message.user?.name || 'Anonymous'}
                          </Typography>
                          <Typography variant="body1">{message.content}</Typography>
                        </Box>
                      ))
                    )}
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={handleSendMessage}
                            disabled={!chatMessage.trim()}
                          >
                            <Send />
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Resources Tab */}
              {activeTab === 3 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Lesson Resources
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    No additional resources available for this lesson.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Course Content
            </Typography>

            {course.sections.map((section, sectionIndex) => (
              <Box key={sectionIndex} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                  {section.title}
                </Typography>

                <List dense>
                  {section.lessons.map((lesson, lessonIndex) => (
                    <ListItem
                      key={lesson.id}
                      button
                      onClick={() => handleLessonSelect(lesson, section.title)}
                      selected={currentLesson?.id === lesson.id}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          bgcolor: 'primary.light',
                        },
                      }}
                    >
                      <ListItemText
                        primary={lesson.title}
                        secondary={lesson.duration}
