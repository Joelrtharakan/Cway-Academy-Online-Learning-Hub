import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useCourseStore } from '../store'
import mockCourses from '../mock/mockCourses'
import { generateCertificate } from '../utils/certificate'

function CoursePlayer() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const { updateProgress, setCurrentLesson: setStoreCurrentLesson, getEnrolledCourse } = useCourseStore()
  const [currentLesson, setCurrentLessonState] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)
  const [quizTimeLeft, setQuizTimeLeft] = useState(null)
  const [fullscreenWarnings, setFullscreenWarnings] = useState(0)
  const [quizExitAttempts, setQuizExitAttempts] = useState(0)
  const [showWarningModal, setShowWarningModal] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [warningTitle, setWarningTitle] = useState('')
  const [videoProgress, setVideoProgress] = useState({})
  const [quizProgress, setQuizProgress] = useState({})
  const [showConfetti, setShowConfetti] = useState(false)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true)
  const [showCertificate, setShowCertificate] = useState(false)

  const course = mockCourses.find(c => c.id === courseId)
  const lessons = course?.sections?.flatMap(section => section.lessons) || []

  // Load progress from localStorage
  useEffect(() => {
    if (user && courseId) {
      const videoKey = `video_progress_${user._id}_${courseId}`
      const quizKey = `quiz_progress_${user._id}_${courseId}`
      
      const savedVideoProgress = localStorage.getItem(videoKey)
      const savedQuizProgress = localStorage.getItem(quizKey)
      
      if (savedVideoProgress) {
        setVideoProgress(JSON.parse(savedVideoProgress))
      }
      if (savedQuizProgress) {
        setQuizProgress(JSON.parse(savedQuizProgress))
      }
    }
  }, [user, courseId])

  // Check for course completion
  useEffect(() => {
    if (course?.sections && user) {
      const allLessons = course.sections.flatMap(section => section.lessons)
      const completedLessons = allLessons.filter(lesson => {
        const videoCompleted = videoProgress[lesson.id]
        const quizCompleted = lesson.quiz ? (quizProgress[lesson.id]?.passed) : true // If no quiz, consider it completed
        
        return videoCompleted && quizCompleted
      })

      const isCourseCompleted = allLessons.length > 0 && completedLessons.length === allLessons.length
      
      if (isCourseCompleted && !courseCompleted) {
        setCourseCompleted(true)
        setShowConfetti(true)
        
        // Hide confetti after animation
        setTimeout(() => {
          setShowConfetti(false)
        }, 5000)
      }
    }
  }, [course, videoProgress, quizProgress, courseCompleted, user])

  // Video loading timeout
  useEffect(() => {
    if (currentLesson?.videoUrl && videoLoading) {
      const timeout = setTimeout(() => {
        if (videoLoading) {
          setVideoError(true)
          setVideoLoading(false)
        }
      }, 10000) // 10 second timeout
      
      return () => clearTimeout(timeout)
    }
  }, [currentLesson, videoLoading])

  // Helper function to check if a lesson is locked
  const isLessonLocked = (lessonId) => {
    if (!user) return false
    const lockoutKey = `quiz_lockout_${user._id}_${lessonId}`
    const lockoutTime = localStorage.getItem(lockoutKey)
    
    if (lockoutTime) {
      const remaining = parseInt(lockoutTime) - Date.now()
      return remaining > 0
    }
    return false
  }

  // Helper function to get lockout time for a lesson
  const getLessonLockoutTime = (lessonId) => {
    if (!user) return 0
    const lockoutKey = `quiz_lockout_${user._id}_${lessonId}`
    const lockoutTime = localStorage.getItem(lockoutKey)
    
    if (lockoutTime) {
      const remaining = parseInt(lockoutTime) - Date.now()
      return remaining > 0 ? Math.ceil(remaining / 1000) : 0
    }
    return 0
  }

  // Helper function to format lockout time
  const formatLockoutTime = (seconds) => {
    if (seconds <= 0) return '0 seconds'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  // Helper function to format quiz time
  const formatTime = (seconds) => {
    if (seconds <= 0) return '0:00'
    
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Quiz timer (removed full-screen enforcement)
  useEffect(() => {
    if (showQuiz && currentLesson?.quiz?.timeLimitSec && quizTimeLeft === null) {
      setQuizTimeLeft(currentLesson.quiz.timeLimitSec)
    }

    if (showQuiz && quizTimeLeft > 0) {
      const timer = setTimeout(() => {
        setQuizTimeLeft(prev => {
          if (prev <= 1) {
            handleQuizSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showQuiz, quizTimeLeft, currentLesson])

  // Prevent tab switching during quiz
  useEffect(() => {
    if (showQuiz) {
      const handleBeforeUnload = (e) => {
        e.preventDefault()
        e.returnValue = 'Are you sure you want to leave? Your quiz progress will be lost.'
        return e.returnValue
      }

      const handleVisibilityChange = () => {
        if (document.hidden) {
          const newAttempts = quizExitAttempts + 1
          setQuizExitAttempts(newAttempts)
          
          if (newAttempts >= 3) {
            // Lock quiz for 24 hours
            const lockoutKey = `quiz_lockout_${user._id}_${currentLesson.id}`
            const lockoutEnd = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            localStorage.setItem(lockoutKey, lockoutEnd.toString())
            setShowQuiz(false)
            showQuizWarning('Quiz Locked', 'Quiz has been locked for 24 hours due to multiple exit attempts.')
          } else {
            showQuizWarning('Quiz Warning', `Warning ${newAttempts}/3: Please stay on this page during the quiz. If you leave ${3 - newAttempts} more time(s), the quiz will be locked for 24 hours.`)
          }
        }
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [showQuiz, quizExitAttempts, user, currentLesson])

  // Initialize currentLesson if not set
  useEffect(() => {
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

      if (targetLesson) {
        setCurrentLessonState(targetLesson)
        setVideoError(false) // Reset video error when changing lessons
        setVideoLoading(true) // Reset video loading when changing lessons
      }
    }
  }, [course, lessonId, currentLesson])

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null
  }

  if (!course) {
    return (
      <div style={{ padding: '20px' }}>


        <h1>Course Not Found</h1>
        <p>The course "{courseId}" doesn't exist.</p>
        <button onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    )
  }

  const handleLessonSelect = (lesson, sectionTitle) => {
    setCurrentLessonState({ ...lesson, sectionTitle })
    setStoreCurrentLesson(courseId, lesson.id)
    navigate(`/course/${courseId}/lesson/${lesson.id}`)
  }

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const showQuizWarning = (title, message) => {
    setWarningTitle(title)
    setWarningMessage(message)
    setShowWarningModal(true)
  }

  const closeWarningModal = () => {
    setShowWarningModal(false)
    setWarningTitle('')
    setWarningMessage('')
  }

  const handleVideoComplete = (lessonId) => {
    const videoKey = `video_progress_${user._id}_${courseId}`
    const updatedVideoProgress = { ...videoProgress, [lessonId]: true }
    setVideoProgress(updatedVideoProgress)
    localStorage.setItem(videoKey, JSON.stringify(updatedVideoProgress))

    // Update course store progress
    updateProgress(courseId, lessonId, null)
  }

  const handleGenerateCertificate = () => {
    console.log('handleGenerateCertificate called')
    const certificateData = {
      studentName: user?.name || 'Student',
      courseName: course?.title,
      completionDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      courseId: courseId,
      instructorName: course?.instructor || 'Cway Academy Team',
      totalLessons: lessons.length,
      completionTimestamp: new Date().toISOString(),
      lessonCount: lessons.length
    }

    console.log('Certificate data:', certificateData)
    generateCertificate(certificateData, () => setShowCertificate(false))
  }

  function getPreviousLesson() {
    if (!currentLesson || !course?.sections) return null

    for (let s = 0; s < course.sections.length; s++) {
      const section = course.sections[s]
      for (let l = 0; l < section.lessons.length; l++) {
        if (section.lessons[l].id === currentLesson.id) {
          if (l > 0) {
            return { lesson: section.lessons[l - 1], section: section }
          } else if (s > 0) {
            const prevSection = course.sections[s - 1]
            if (prevSection.lessons.length > 0) {
              return { lesson: prevSection.lessons[prevSection.lessons.length - 1], section: prevSection }
            }
          }
          return null
        }
      }
    }
    return null
  }

  function getNextLesson() {
    if (!currentLesson || !course?.sections) return null

    for (let s = 0; s < course.sections.length; s++) {
      const section = course.sections[s]
      for (let l = 0; l < section.lessons.length; l++) {
        if (section.lessons[l].id === currentLesson.id) {
          if (l < section.lessons.length - 1) {
            return { lesson: section.lessons[l + 1], section: section }
          } else if (s < course.sections.length - 1) {
            const nextSection = course.sections[s + 1]
            if (nextSection.lessons.length > 0) {
              return { lesson: nextSection.lessons[0], section: nextSection }
            }
          }
          return null
        }
      }
    }
    return null
  }

  const handleStartQuiz = () => {
    if (isLessonLocked(currentLesson.id)) return
    
    setShowQuiz(true)
    setQuizAnswers({})
    setQuizResult(null)
    setFullscreenWarnings(0)
    setQuizExitAttempts(0)
    setQuizTimeLeft(currentLesson.quiz.timeLimitSec)
  }

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleQuizSubmit = () => {
    if (!currentLesson?.quiz) return

    const quiz = currentLesson.quiz
    let correct = 0
    let total = quiz.questions.length

    quiz.questions.forEach(question => {
      const userAnswer = quizAnswers[question.id]
      if (userAnswer && question.answer.includes(userAnswer)) {
        correct++
      }
    })

    const score = Math.round((correct / total) * 100)
    const passed = score >= quiz.passingScore

    const result = { correct, total, score, passed, submittedAt: new Date().toISOString() }
    
    // Save quiz progress
    const quizKey = `quiz_progress_${user._id}_${courseId}`
    const updatedQuizProgress = { ...quizProgress, [currentLesson.id]: result }
    setQuizProgress(updatedQuizProgress)
    localStorage.setItem(quizKey, JSON.stringify(updatedQuizProgress))
    
    // Update course store progress if quiz passed
    if (passed) {
      updateProgress(courseId, currentLesson.id, null)
    }
    
    // Close quiz modal and reset state
    setShowQuiz(false)
    setQuizAnswers({})
    setQuizTimeLeft(null)
    setQuizExitAttempts(0)
    
    // Switch to quiz tab to show results
    setActiveTab(1)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => navigate('/courses')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← Back to Courses
        </button>
        <div style={{ flexGrow: 1 }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem', fontWeight: 'bold' }}>
            {course.title}
          </h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            {currentLesson?.title || 'Loading...'}
          </p>
        </div>
        <div style={{
          padding: '4px 12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '16px',
          fontSize: '0.875rem'
        }}>
          {lessons.length} lessons
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Main Content */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            {['Lesson', 'Quiz', 'Discussions', 'Resources'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => {
                  if (showQuiz) {
                    const newAttempts = quizExitAttempts + 1
                    setQuizExitAttempts(newAttempts)
                    
                    if (newAttempts >= 3) {
                      // Lock quiz for 24 hours
                      const lockoutKey = `quiz_lockout_${user._id}_${currentLesson.id}`
                      const lockoutEnd = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
                      localStorage.setItem(lockoutKey, lockoutEnd.toString())
                      setShowQuiz(false)
                      showQuizWarning('Quiz Locked', 'Quiz has been locked for 24 hours due to multiple exit attempts.')
                    } else {
                      showQuizWarning('Quiz Warning', `Warning ${newAttempts}/3: Please complete the quiz before switching tabs. If you switch tabs ${3 - newAttempts} more time(s), the quiz will be locked for 24 hours.`)
                    }
                    return
                  }
                  setActiveTab(index)
                }}
                disabled={showQuiz}
                style={{
                  padding: '12px 24px',
                  backgroundColor: activeTab === index ? 'white' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === index ? '2px solid #2563eb' : '2px solid transparent',
                  cursor: showQuiz ? 'not-allowed' : 'pointer',
                  fontWeight: activeTab === index ? '600' : '500',
                  color: showQuiz ? '#9ca3af' : (activeTab === index ? '#2563eb' : '#6b7280'),
                  opacity: showQuiz ? 0.5 : 1
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: '24px' }}>
            {/* Lesson Tab */}
            {activeTab === 0 && (
              <div>
                {currentLesson ? (
                  <div>
                    {/* YouTube Video Player */}
                    {currentLesson.videoUrl && (
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: 0,
                        paddingBottom: '56.25%',
                        marginBottom: '20px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        {videoLoading && !videoError && (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f9fafb',
                            color: '#6b7280'
                          }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
                              <p>Loading video...</p>
                            </div>
                          </div>
                        )}
                        
                        {!videoError ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYouTubeId(currentLesson.videoUrl)}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              display: videoLoading ? 'none' : 'block'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={currentLesson.title}
                            onLoad={() => {
                              setVideoLoading(false)
                              setVideoError(false)
                            }}
                            onError={() => {
                              setVideoLoading(false)
                              setVideoError(true)
                            }}
                          />
                        ) : (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f9fafb',
                            color: '#6b7280',
                            textAlign: 'center',
                            padding: '20px'
                          }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎥</div>
                            <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>Video Unavailable</h3>
                            <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem' }}>
                              This video is currently unavailable. Please continue with the lesson content below or try refreshing the page.
                            </p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  setVideoError(false)
                                  setVideoLoading(true)
                                }}
                                style={{
                                  padding: '8px 16px',
                                  backgroundColor: '#2563eb',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                              >
                                Try Again
                              </button>
                              <button
                                onClick={() => setVideoLoading(false)}
                                style={{
                                  padding: '8px 16px',
                                  backgroundColor: '#f3f4f6',
                                  color: '#374151',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                              >
                                Continue
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {!videoProgress[currentLesson.id] && !videoError && !videoLoading && (
                          <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                          onClick={() => handleVideoComplete(currentLesson.id)}
                        >
                          ✓ Mark as Watched
                        </div>
                        )}
                      </div>
                    )}

                    {/* Lesson Content */}
                    <div>
                      <h2 style={{ margin: '0 0 16px 0', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {currentLesson.title}
                      </h2>

                      {currentLesson.textNotes && (
                        <p style={{ margin: '0 0 24px 0', lineHeight: '1.6', color: '#374151' }}>
                          {currentLesson.textNotes}
                        </p>
                      )}

                      {/* Lesson Actions */}
                      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#f3f4f6',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                          disabled={!getPreviousLesson()}
                        >
                          Previous
                        </button>

                        {currentLesson.quiz && (
                          <button
                            onClick={handleStartQuiz}
                            disabled={isLessonLocked(currentLesson.id)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: isLessonLocked(currentLesson.id) ? '#6b7280' : '#2563eb',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: isLessonLocked(currentLesson.id) ? 'not-allowed' : 'pointer',
                              fontWeight: '500'
                            }}
                          >
                            {isLessonLocked(currentLesson.id) ? 'Quiz Locked' : 'Take Quiz'}
                          </button>
                        )}

                        <button
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                          disabled={!getNextLesson()}
                        >
                          Next Lesson
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                      Loading lesson...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === 1 && (
              <div>
                {currentLesson?.quiz ? (
                  <div>
                    <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        {currentLesson.quiz.description || 'Lesson Quiz'}
                      </h3>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#6b7280' }}>
                        <span>⏱️ {Math.floor(currentLesson.quiz.timeLimitSec / 60)} minutes</span>
                        <span>🎯 Passing score: {currentLesson.quiz.passingScore}%</span>
                        <span>❓ {currentLesson.quiz.questions.length} questions</span>
                      </div>
                    </div>

                    {quizProgress[currentLesson.id] ? (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        backgroundColor: quizProgress[currentLesson.id].passed ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${quizProgress[currentLesson.id].passed ? '#bbf7d0' : '#fecaca'}`,
                        borderRadius: '8px'
                      }}>
                        <h4 style={{
                          color: quizProgress[currentLesson.id].passed ? '#166534' : '#dc2626',
                          margin: '0 0 16px 0'
                        }}>
                          {quizProgress[currentLesson.id].passed ? '✅ Quiz Passed!' : '❌ Quiz Failed'}
                        </h4>
                        <p style={{
                          color: quizProgress[currentLesson.id].passed ? '#166534' : '#7f1d1d',
                          margin: '0 0 16px 0',
                          fontSize: '1.125rem'
                        }}>
                          Score: {quizProgress[currentLesson.id].score}% ({quizProgress[currentLesson.id].correct}/{quizProgress[currentLesson.id].total} correct)
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                          <button
                            onClick={() => {
                              setQuizAnswers({})
                              setQuizResult(null)
                              setShowQuiz(true)
                            }}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#2563eb',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            Retake Quiz
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px' }}>
                        <button
                          onClick={handleStartQuiz}
                          disabled={isLessonLocked(currentLesson.id)}
                          style={{
                            padding: '16px 32px',
                            backgroundColor: isLessonLocked(currentLesson.id) ? '#6b7280' : '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isLessonLocked(currentLesson.id) ? 'not-allowed' : 'pointer',
                            fontSize: '1.125rem',
                            fontWeight: '600'
                          }}
                        >
                          {isLessonLocked(currentLesson.id) ? 'Quiz Locked' : 'Start Quiz'}
                        </button>
                        {isLessonLocked(currentLesson.id) && (
                          <p style={{ margin: '16px 0 0 0', color: '#dc2626', fontSize: '0.875rem' }}>
                            Quiz is locked for {formatLockoutTime(getLessonLockoutTime(currentLesson.id))}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                      No quiz available for this lesson
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Discussions Tab */}
            {activeTab === 2 && (
              <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1, overflow: 'auto', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ textAlign: 'center', color: '#6b7280', margin: 0 }}>
                    No messages yet. Start the conversation!
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    style={{
                      flexGrow: 1,
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px'
                    }}
                  />
                  <button
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {/* Resources Tab */}
            {activeTab === 3 && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                  No additional resources available for this lesson.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: 'bold' }}>
            Course Content
          </h3>

          {/* Course Progress */}
          {(() => {
            const allLessons = course.sections.flatMap(section => section.lessons)
            const completedLessons = allLessons.filter(lesson => {
              const videoCompleted = videoProgress[lesson.id]
              const quizCompleted = lesson.quiz ? (quizProgress[lesson.id]?.passed) : true
              return videoCompleted && quizCompleted
            })
            const progressPercentage = allLessons.length > 0 ? Math.round((completedLessons.length / allLessons.length) * 100) : 0

            return (
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>Course Progress</span>
                  <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{completedLessons.length}/{allLessons.length} completed</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progressPercentage}%`,
                    height: '100%',
                    backgroundColor: progressPercentage === 100 ? '#10b981' : '#3b82f6',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '8px', 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  color: progressPercentage === 100 ? '#10b981' : '#6b7280'
                }}>
                  {progressPercentage}% Complete
                  {progressPercentage === 100 && ' 🎉'}
                </div>
              </div>
            )
          })()}

          {course.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '600', color: '#6b7280' }}>
                {section.title}
              </h4>

              <div>
                {section.lessons.map((lesson, lessonIndex) => {
                  const isVideoCompleted = videoProgress[lesson.id]
                  const isQuizCompleted = quizProgress[lesson.id]?.passed
                  
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson, section.title)}
                      style={{
                        padding: '12px',
                        marginBottom: '4px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: currentLesson?.id === lesson.id ? '#eff6ff' : 'transparent',
                        border: currentLesson?.id === lesson.id ? '1px solid #bfdbfe' : '1px solid transparent',
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: currentLesson?.id === lesson.id ? '600' : '500',
                        color: currentLesson?.id === lesson.id ? '#2563eb' : '#374151',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {/* Progress indicators */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {lesson.videoUrl && (
                            <span style={{
                              fontSize: '0.75rem',
                              color: isVideoCompleted ? '#10b981' : '#9ca3af'
                            }}>
                              {isVideoCompleted ? '✓' : '○'}
                            </span>
                          )}
                          {lesson.quiz && (
                            <span style={{
                              fontSize: '0.75rem',
                              color: isQuizCompleted ? '#10b981' : '#9ca3af'
                            }}>
                              {isQuizCompleted ? '✓' : '○'}
                            </span>
                          )}
                        </div>
                        <span>{lesson.title}</span>
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginTop: '4px'
                      }}>
                        {lesson.duration}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && currentLesson?.quiz && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Quiz Header */}
            <div style={{
              padding: '16px 24px',
              backgroundColor: '#1f2937',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                {currentLesson.quiz.description || 'Lesson Quiz'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  color: quizTimeLeft <= 60 ? '#ef4444' : 'white'
                }}>
                  ⏱️ {formatTime(quizTimeLeft)}
                </div>
                <button
                  onClick={() => {
                    const newAttempts = quizExitAttempts + 1
                    setQuizExitAttempts(newAttempts)
                    
                    if (newAttempts >= 3) {
                      // Lock quiz for 24 hours
                      const lockoutKey = `quiz_lockout_${user._id}_${currentLesson.id}`
                      const lockoutEnd = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
                      localStorage.setItem(lockoutKey, lockoutEnd.toString())
                      setShowQuiz(false)
                      showQuizWarning('Quiz Locked', 'Quiz has been locked for 24 hours due to multiple exit attempts.')
                    } else {
                      showQuizWarning('Quiz Warning', `Warning ${newAttempts}/3: Please complete the quiz before closing. If you try to close ${3 - newAttempts} more time(s), the quiz will be locked for 24 hours.`)
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Quiz Content */}
            <div style={{ 
              maxHeight: '60vh',
              overflow: 'auto',
              padding: '24px' 
            }}>
              {currentLesson.quiz.questions.map((question, index) => (
                <div key={question.id} style={{
                  marginBottom: '32px',
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600' }}>
                    Question {index + 1}: {question.prompt}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {question.options.map((option) => (
                      <label key={option.key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: quizAnswers[question.id] === option.key ? '#eff6ff' : 'white',
                        transition: 'all 0.2s'
                      }}>
                        <input
                          type="radio"
                          name={question.id}
                          value={option.key}
                          checked={quizAnswers[question.id] === option.key}
                          onChange={(e) => handleQuizAnswer(question.id, e.target.value)}
                          style={{ marginRight: '12px' }}
                        />
                        <span style={{ fontWeight: '500' }}>{option.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quiz Footer */}
            <div style={{
              padding: '16px 24px',
              backgroundColor: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {Object.keys(quizAnswers).length}/{currentLesson.quiz.questions.length} answered
                {quizExitAttempts > 0 && (
                  <span style={{ color: '#dc2626', marginLeft: '12px' }}>
                    ⚠️ {quizExitAttempts}/3 exit warnings
                  </span>
                )}
              </div>
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length !== currentLesson.quiz.questions.length}
                style={{
                  padding: '12px 24px',
                  backgroundColor: Object.keys(quizAnswers).length === currentLesson.quiz.questions.length ? '#059669' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: Object.keys(quizAnswers).length === currentLesson.quiz.questions.length ? 'pointer' : 'not-allowed',
                  fontWeight: '600'
                }}
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Completion Banner */}
      {courseCompleted && (
        <div style={{
          position: 'fixed',
          top: '120px', // Increased from 80px to ensure it's well below the navbar
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -5px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '90vw'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🎉</span>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
              Course Completed!
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              Congratulations on completing {course?.title}
            </div>
          </div>
          <button
            onClick={() => setShowCertificate(true)}
            style={{
              backgroundColor: 'white',
              color: '#10b981',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: '12px',
              whiteSpace: 'nowrap'
            }}
          >
            Get Certificate
          </button>
        </div>
      )}

      {/* Confetti Animation */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9998
        }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-10px',
                width: '10px',
                height: '10px',
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)],
                animation: `confetti ${2 + Math.random() * 3}s linear forwards`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '600px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎓</div>
            <h2 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '1.8rem' }}>Certificate of Completion</h2>
            <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '1.1rem' }}>
              Congratulations! You have successfully completed this course.
            </p>
            
            {/* Certificate Preview */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '24px',
              margin: '24px 0',
              color: 'white',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>🏆</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '8px' }}>
                {user?.name || 'Student'}
              </div>
              <div style={{ fontSize: '1rem', opacity: '0.9', marginBottom: '16px' }}>
                has completed
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
                "{course?.title}"
              </div>
              <div style={{ fontSize: '0.9rem', opacity: '0.8', marginBottom: '16px' }}>
                {lessons.length} lessons • Completed on {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '8px', fontWeight: '500' }}>
                This certificate is awarded in recognition of the successful completion of the course requirements.<br/>
                Cway Academy - Empowering Learning Through Innovation
              </div>
              <div style={{ fontSize: '0.95rem', color: '#fff', marginTop: '8px', fontWeight: '600', background: 'rgba(0,0,0,0.08)', borderRadius: '4px', display: 'inline-block', padding: '4px 12px' }}>
                Certificate ID: CA-{Date.now()}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
              <button
                onClick={() => {
                  const certificateData = {
                    studentName: user?.name || 'Student',
                    courseName: course?.title,
                    completionDate: new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }),
                    courseId: courseId,
                    instructorName: course?.instructor || 'Cway Academy Team',
                    totalLessons: lessons.length,
                    completionTimestamp: new Date().toISOString(),
                    lessonCount: lessons.length
                  }

                  generateCertificate(certificateData, () => setShowCertificate(false))
                }}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  minWidth: '160px'
                }}
              >
                📥 Download PDF Certificate
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  minWidth: '120px'
                }}
              >
                Close
              </button>
            </div>
            
            <div style={{ 
              marginTop: '20px', 
              padding: '12px', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '6px',
              border: '1px solid #bae6fd',
              fontSize: '0.85rem',
              color: '#0369a1'
            }}>
              💡 <strong>Tip:</strong> Your certificate will be automatically downloaded as a high-quality PDF file ready for printing or sharing.
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarningModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ margin: '0 0 16px 0', color: '#dc2626', fontSize: '1.25rem' }}>
              {warningTitle}
            </h2>
            <p style={{ margin: '0 0 24px 0', color: '#374151', lineHeight: '1.5' }}>
              {warningMessage}
            </p>
            <button
              onClick={closeWarningModal}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Add confetti animation CSS */}
      <style>
        {`
          @keyframes confetti {
            0% {
              transform: translateY(-10px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  )
}

export default CoursePlayer
