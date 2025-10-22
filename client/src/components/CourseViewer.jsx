import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../api'

function CourseViewer({ courseId }) {
  const [activeSection, setActiveSection] = useState(0)
  const [activeTab, setActiveTab] = useState('content')
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  // Fetch course data
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => api.get(`/api/courses/${courseId}`).then(res => res.data)
  })

  // Track progress mutation
  const trackProgressMutation = useMutation({
    mutationFn: (progress) =>
      api.post(`/api/courses/${courseId}/progress`, { progress })
  })

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleQuizSubmit = () => {
    if (!course?.quizzes) return

    let correctAnswers = 0
    Object.entries(selectedAnswers).forEach(([questionId, answer]) => {
      const question = course.quizzes.find(q => q.id === questionId)
      if (question && question.correctAnswer === answer) {
        correctAnswers++
      }
    })

    const finalScore = (correctAnswers / course.quizzes.length) * 100
    setScore(finalScore)
    setQuizSubmitted(true)
    setShowResults(true)

    // Track progress
    trackProgressMutation.mutate({
      sectionComplete: activeSection,
      quizScore: finalScore
    })
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {course?.title}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Content" value="content" />
          <Tab label="Videos" value="videos" />
          <Tab label="Quiz" value="quiz" />
        </Tabs>
      </Box>

      {activeTab === 'content' && (
        <Box>
          <Typography variant="h5" gutterBottom>
            {course?.outline?.[activeSection]?.title}
          </Typography>
          <Typography>
            {course?.content?.[activeSection]?.content}
          </Typography>
        </Box>
      )}

      {activeTab === 'videos' && (
        <Box>
          {course?.videos?.map((video, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <Typography variant="h6">{video.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {video.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {activeTab === 'quiz' && (
        <Box>
          {course?.quizzes?.map((quiz, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {quiz.question}
                </Typography>
                <RadioGroup
                  value={selectedAnswers[quiz.id] || ''}
                  onChange={(e) => handleAnswerSelect(quiz.id, e.target.value)}
                >
                  {quiz.options.map((option, optIndex) => (
                    <FormControlLabel
                      key={optIndex}
                      value={option}
                      control={<Radio />}
                      label={option}
                      disabled={quizSubmitted}
                    />
                  ))}
                </RadioGroup>
                {showResults && (
                  <Box sx={{ mt: 2 }}>
                    {selectedAnswers[quiz.id] === quiz.correctAnswer ? (
                      <Alert severity="success">Correct!</Alert>
                    ) : (
                      <Alert severity="error">
                        Incorrect. The correct answer is: {quiz.correctAnswer}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {quiz.explanation}
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
          {!quizSubmitted && (
            <Button
              variant="contained"
              onClick={handleQuizSubmit}
              disabled={Object.keys(selectedAnswers).length !== course?.quizzes?.length}
            >
              Submit Quiz
            </Button>
          )}
          {showResults && (
            <Dialog open={showResults} onClose={() => setShowResults(false)}>
              <DialogTitle>Quiz Results</DialogTitle>
              <DialogContent>
                <Typography variant="h6">
                  Your Score: {score.toFixed(1)}%
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {score >= 70
                    ? 'Congratulations! You passed the quiz!'
                    : 'Keep studying and try again!'}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowResults(false)}>Close</Button>
                {score < 70 && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setQuizSubmitted(false)
                      setSelectedAnswers({})
                      setShowResults(false)
                    }}
                  >
                    Retry Quiz
                  </Button>
                )}
              </DialogActions>
            </Dialog>
          )}
        </Box>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          disabled={activeSection === 0}
          onClick={() => setActiveSection(prev => prev - 1)}
        >
          Previous Section
        </Button>
        <Button
          variant="contained"
          disabled={activeSection === (course?.outline?.length || 0) - 1}
          onClick={() => setActiveSection(prev => prev + 1)}
        >
          Next Section
        </Button>
      </Box>
    </Box>
  )
}

export default CourseViewer