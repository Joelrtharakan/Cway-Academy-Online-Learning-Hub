import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'
import mockCourses from '../mock/mockCourses'

function CoursePlayer() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [currentLesson, setCurrentLesson] = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  const course = mockCourses.find(c => c.id === courseId)
  const lessons = course?.sections?.flatMap(section => section.lessons) || []

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/course/${courseId}` } })
      return
    }
  }, [isAuthenticated, navigate, courseId])

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
        setCurrentLesson(targetLesson)
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
    setCurrentLesson({ ...lesson, sectionTitle })
    navigate(`/course/${courseId}/lesson/${lesson.id}`)
  }

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
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
                onClick={() => setActiveTab(index)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: activeTab === index ? 'white' : 'transparent',
                  border: 'none',
                  borderBottom: activeTab === index ? '2px solid #2563eb' : '2px solid transparent',
                  cursor: 'pointer',
                  fontWeight: activeTab === index ? '600' : '500',
                  color: activeTab === index ? '#2563eb' : '#6b7280'
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
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId(currentLesson.videoUrl)}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none'
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={currentLesson.title}
                        />
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
                            onClick={() => setActiveTab(1)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#2563eb',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                          >
                            Take Quiz
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
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: 'bold' }}>
                      {currentLesson.quiz.description || 'Lesson Quiz'}
                    </h3>
                    <button
                      onClick={() => setActiveTab(0)}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Back to Lesson
                    </button>
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

          {course.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '600', color: '#6b7280' }}>
                {section.title}
              </h4>

              <div>
                {section.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson, section.title)}
                    style={{
                      padding: '12px',
                      marginBottom: '4px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: currentLesson?.id === lesson.id ? '#eff6ff' : 'transparent',
                      border: currentLesson?.id === lesson.id ? '1px solid #bfdbfe' : '1px solid transparent'
                    }}
                  >
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: currentLesson?.id === lesson.id ? '600' : '500',
                      color: currentLesson?.id === lesson.id ? '#2563eb' : '#374151'
                    }}>
                      {lesson.title}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '4px'
                    }}>
                      {lesson.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

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
}

export default CoursePlayer
