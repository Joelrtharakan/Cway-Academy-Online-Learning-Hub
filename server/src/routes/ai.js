import express from 'express'
import { Course, Quiz } from '../models/index.js'
import { authenticate, authorize, validate } from '../middleware/auth.js'
import { GeminiService } from '../services/gemini.js'
import { YouTubeService } from '../services/youtube.js'

const router = express.Router()

// Generate complete course with AI
router.post('/generate-course', authenticate, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const { topic, difficulty = 'intermediate', duration = '8 weeks', includeVideos = true, includeQuizzes = true } = req.body

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' })
    }

    console.log(`Generating AI course for topic: ${topic}`)

    // Step 1: Generate course outline
    const courseOutline = await GeminiService.generateCourseOutline(topic, difficulty, duration)
    console.log('Course outline generated')

    // Step 4: Create the course
    const courseData = {
      title: courseOutline.title,
      slug: courseOutline.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      category: topic,
      description: courseOutline.description,
      tutor: req.user._id,
      price: Math.floor(Math.random() * 50) + 20, // Random price between 20-70
      published: false, // AI-generated courses need review before publishing
      aiGenerated: true,
      aiMetadata: {
        generatedBy: 'gemini-pro',
        generationPrompt: `Generate course on "${topic}" at ${difficulty} level for ${duration}`,
        difficulty,
        duration,
        includeVideos,
        includeQuizzes,
        generatedAt: new Date(),
      },
      sections: []
    }

    // Step 3: Generate detailed sections and lessons
    for (const [sectionIndex, sectionOutline] of courseOutline.sections.entries()) {
      const section = {
        title: sectionOutline.title,
        order: sectionIndex + 1,
        lessons: []
      }

      // Generate lessons for this section
      for (let lessonIndex = 0; lessonIndex < sectionOutline.lessonCount; lessonIndex++) {
        const lessonTitle = `${sectionOutline.title} - Lesson ${lessonIndex + 1}`
        const lessonTopics = sectionOutline.topics.slice(
          Math.floor(lessonIndex * sectionOutline.topics.length / sectionOutline.lessonCount),
          Math.floor((lessonIndex + 1) * sectionOutline.topics.length / sectionOutline.lessonCount)
        )

        console.log(`Generating content for lesson: ${lessonTitle}`)

        // Generate lesson content
        const lessonContent = await GeminiService.generateLessonContent(
          sectionOutline.title,
          lessonTitle,
          lessonTopics,
          difficulty
        )

        let videoUrl = ''
        let startTime = 0
        let endTime = 0

        // Find YouTube video if requested
        if (includeVideos) {
          console.log(`Finding YouTube video for lesson: ${lessonTitle}`)
          const bestVideo = await YouTubeService.findBestVideoForLesson(
            lessonTitle,
            lessonTopics,
            'medium'
          )

          if (bestVideo) {
            videoUrl = bestVideo.url
            // Suggest time frames based on lesson content
            const timeFrames = await YouTubeService.suggestTimeFrames(
              bestVideo.videoId,
              lessonContent.textNotes,
              15 // 15 minutes per lesson
            )

            if (timeFrames) {
              startTime = timeFrames.startTime
              endTime = timeFrames.endTime
            }
          }
        }

        // Create lesson
        const lesson = {
          title: lessonTitle,
          order: lessonIndex + 1,
          videoUrl,
          startTime,
          endTime,
          textNotes: lessonContent.textNotes,
          durationSec: 900, // 15 minutes default
          resources: []
        }

        section.lessons.push(lesson)

        // Generate quiz if requested
        if (includeQuizzes) {
          console.log(`Generating quiz for lesson: ${lessonTitle}`)
          try {
            const quizQuestions = await GeminiService.generateQuizQuestions(
              lessonTitle,
              lessonTopics,
              difficulty,
              5
            )

            if (quizQuestions && quizQuestions.length > 0) {
              const quiz = new Quiz({
                course: null, // Will be set after course creation
                lesson: null, // Will be set after lesson creation
                timeLimitSec: 600,
                attemptsAllowed: 2,
                questions: quizQuestions
              })

              await quiz.save()
              lesson.quiz = quiz._id
            }
          } catch (quizError) {
            console.error('Error generating quiz:', quizError)
            // Continue without quiz
          }
        }
      }

      courseData.sections.push(section)
    }

    // Step 4: Create the course
    const course = new Course(courseData)
    await course.save()

    // Step 5: Update quiz references with course and lesson IDs
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (lesson.quiz) {
          await Quiz.findByIdAndUpdate(lesson.quiz, {
            course: course._id,
            lesson: lesson._id
          })
        }
      }
    }

    await course.populate('tutor', 'name avatarUrl')

    console.log(`AI course generation completed: ${course.title}`)
    res.status(201).json({
      course,
      message: 'AI-generated course created successfully',
      stats: {
        sections: course.sections.length,
        lessons: course.sections.reduce((acc, s) => acc + s.lessons.length, 0),
        videos: course.sections.reduce((acc, s) => acc + s.lessons.filter(l => l.videoUrl).length, 0),
        quizzes: course.sections.reduce((acc, s) => acc + s.lessons.filter(l => l.quiz).length, 0)
      }
    })

  } catch (error) {
    console.error('Error generating AI course:', error)
    res.status(500).json({
      error: 'Failed to generate AI course',
      details: error.message
    })
  }
})

// Generate learning path for user
router.post('/generate-learning-path', authenticate, async (req, res) => {
  try {
    const { skillLevel, interests, goals, availableTime } = req.body

    if (!skillLevel || !interests || !goals) {
      return res.status(400).json({ error: 'Skill level, interests, and goals are required' })
    }

    const learningPath = await GeminiService.generateLearningPath(
      skillLevel,
      interests,
      goals,
      availableTime || 10
    )

    res.json({ learningPath })
  } catch (error) {
    console.error('Error generating learning path:', error)
    res.status(500).json({ error: 'Failed to generate learning path' })
  }
})

// Generate quiz for existing lesson
router.post('/generate-quiz/:lessonId', authenticate, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const { questionCount = 5 } = req.body

    // Find the lesson (this would require updating the course model to include lesson IDs)
    // For now, return an error
    res.status(501).json({ error: 'Lesson-specific quiz generation not yet implemented' })
  } catch (error) {
    console.error('Error generating quiz:', error)
    res.status(500).json({ error: 'Failed to generate quiz' })
  }
})

// Search for YouTube videos
router.get('/youtube/search', authenticate, async (req, res) => {
  try {
    const { query, maxResults = 10, duration = 'medium' } = req.query

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' })
    }

    const videos = await YouTubeService.searchEducationalVideos(query, parseInt(maxResults), duration)
    res.json({ videos })
  } catch (error) {
    console.error('Error searching YouTube:', error)
    res.status(500).json({ error: 'Failed to search YouTube videos' })
  }
})

// Get video suggestions for a topic
router.get('/youtube/suggestions', authenticate, async (req, res) => {
  try {
    const { topic, lessonTitle } = req.query

    if (!topic) {
      return res.status(400).json({ error: 'Topic parameter is required' })
    }

    const video = await YouTubeService.findBestVideoForLesson(
      lessonTitle || topic,
      [topic],
      'medium'
    )

    res.json({ video })
  } catch (error) {
    console.error('Error getting video suggestions:', error)
    res.status(500).json({ error: 'Failed to get video suggestions' })
  }
})

export default router