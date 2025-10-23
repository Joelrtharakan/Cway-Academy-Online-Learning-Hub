import express from 'express'
import { Quiz, Attempt, Course } from '../models/index.js'
import { authenticate, authorize, validate, schemas } from '../middleware/auth.js'

const router = express.Router()

// Shuffle array utility
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Create quiz (tutor/admin)
router.post('/', authenticate, authorize('tutor', 'admin'), validate(schemas.quiz), async (req, res) => {
  try {
    const quizData = req.body

    // Verify course ownership
    const course = await Course.findById(quizData.course)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to create quiz for this course' })
    }

    const quiz = new Quiz(quizData)
    await quiz.save()

    res.status(201).json({ quiz })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create quiz' })
  }
})

// Get quiz (enrolled student)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'title tutor')

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' })
    }

    // Check if user is enrolled (simplified check)
    if (req.user.role === 'student') {
      // In a real app, check enrollment
    }

    // Shuffle options for each question
    const questions = quiz.questions.map(question => ({
      ...question.toObject(),
      options: shuffleArray(question.options),
    }))

    res.json({
      quiz: {
        _id: quiz._id,
        course: quiz.course,
        lesson: quiz.lesson,
        timeLimitSec: quiz.timeLimitSec,
        attemptsAllowed: quiz.attemptsAllowed,
        questions,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quiz' })
  }
})

// Start quiz attempt
router.post('/:id/attempts', authenticate, authorize('student'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' })
    }

    // Check attempts limit
    const existingAttempts = await Attempt.countDocuments({
      quiz: req.params.id,
      student: req.user._id,
    })

    if (existingAttempts >= quiz.attemptsAllowed) {
      return res.status(400).json({ error: 'Maximum attempts reached' })
    }

    const attempt = new Attempt({
      quiz: req.params.id,
      student: req.user._id,
    })

    await attempt.save()
    res.status(201).json({ attempt })
  } catch (error) {
    res.status(500).json({ error: 'Failed to start attempt' })
  }
})

// Submit quiz attempt
router.patch('/attempts/:attemptId/submit', authenticate, authorize('student'), validate(schemas.attempt), async (req, res) => {
  try {
    const { answers } = req.body
    const attempt = await Attempt.findById(req.params.attemptId).populate('quiz')

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' })
    }

    if (attempt.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    if (attempt.finishedAt) {
      return res.status(400).json({ error: 'Attempt already submitted' })
    }

    // Auto-grade the attempt
    let totalScore = 0
    let maxScore = 0
    const details = []

    for (const question of attempt.quiz.questions) {
      maxScore += question.points
      const userAnswer = answers.find(a => a.qid === question._id.toString())

      if (userAnswer) {
        const isCorrect = JSON.stringify(userAnswer.selectedKeys.sort()) ===
                         JSON.stringify(question.answerKeys.sort())
        if (isCorrect) {
          totalScore += question.points
        }
        details.push({
          qid: question._id.toString(),
          correct: isCorrect,
        })
      } else {
        details.push({
          qid: question._id.toString(),
          correct: false,
        })
      }
    }

    attempt.answers = answers
    attempt.score = totalScore
    attempt.finishedAt = new Date()
    attempt.detail = details

    await attempt.save()

    res.json({
      attempt: {
        _id: attempt._id,
        score: attempt.score,
        maxScore,
        percentage: Math.round((totalScore / maxScore) * 100),
        details: attempt.detail,
        finishedAt: attempt.finishedAt,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit attempt' })
  }
})

// AI Quiz Assist (mock)
router.post('/quiz-assist/generate', authenticate, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ error: 'Text content required' })
    }

    // Mock AI quiz generation - deterministic based on text keywords
    const questions = []

    // Extract keywords from text
    const keywords = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || []
    const uniqueKeywords = [...new Set(keywords)].slice(0, 5)

    for (let i = 0; i < Math.min(uniqueKeywords.length, 5); i++) {
      const keyword = uniqueKeywords[i]
      questions.push({
        type: 'MCQ',
        prompt: `What is the primary concept related to "${keyword}" in this lesson?`,
        options: [
          { key: 'A', text: `The fundamental principle of ${keyword}` },
          { key: 'B', text: `An advanced application of ${keyword}` },
          { key: 'C', text: `A common misconception about ${keyword}` },
          { key: 'D', text: `The historical context of ${keyword}` },
        ],
        answerKeys: ['A'],
        points: 1,
      })
    }

    res.json({ questions })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate questions' })
  }
})

export default router