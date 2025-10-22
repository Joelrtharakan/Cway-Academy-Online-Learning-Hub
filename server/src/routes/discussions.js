import express from 'express'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { DiscussionMessage, Certificate, Attempt, Course, Poll } from '../models/index.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// Get discussion messages
router.get('/:roomId', authenticate, async (req, res) => {
  try {
    const { cursor, limit = 50 } = req.query

    let query = { room: req.params.roomId }
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) }
    }

    const messages = await DiscussionMessage.find(query)
      .populate('user', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))

    res.json({ messages: messages.reverse() })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// Create certificate
router.post('/', authenticate, authorize('student'), async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the best attempt for this course
    const attempts = await Attempt.find({
      student: req.user._id,
    }).populate({
      path: 'quiz',
      match: { course: courseId },
    })

    const validAttempts = attempts.filter(a => a.quiz)
    if (validAttempts.length === 0) {
      return res.status(400).json({ error: 'No quiz attempts found for this course' })
    }

    const bestAttempt = validAttempts.reduce((best, current) =>
      current.score > best.score ? current : best
    )

    const percentage = Math.round((bestAttempt.score / bestAttempt.quiz.questions.reduce((sum, q) => sum + q.points, 0)) * 100)

    if (percentage < 70) {
      return res.status(400).json({ error: 'Score below passing threshold (70%)' })
    }

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({
      student: req.user._id,
      course: courseId,
    })

    if (existingCert) {
      return res.status(400).json({ error: 'Certificate already exists' })
    }

    // Generate verify code
    const verifyCode = `CWAY-${courseId.slice(-6).toUpperCase()}-${Date.now().toString().slice(-6)}`

    // Generate PDF
    const doc = new PDFDocument()
    const pdfPath = path.join(process.cwd(), 'server/storage/media', `certificate-${verifyCode}.pdf`)
    doc.pipe(fs.createWriteStream(pdfPath))

    // PDF content
    doc.fontSize(24).text('Certificate of Completion', { align: 'center' })
    doc.moveDown()
    doc.fontSize(18).text('Cway Academy', { align: 'center' })
    doc.moveDown(2)
    doc.fontSize(16).text(`This certifies that`, { align: 'center' })
    doc.moveDown()
    doc.fontSize(20).text(req.user.name, { align: 'center' })
    doc.moveDown()
    doc.fontSize(16).text(`has successfully completed the course`, { align: 'center' })
    doc.moveDown()

    const course = await Course.findById(courseId)
    doc.fontSize(18).text(course.title, { align: 'center' })
    doc.moveDown(2)
    doc.fontSize(14).text(`Score: ${percentage}%`, { align: 'center' })
    doc.moveDown()
    doc.fontSize(14).text(`Issued on: ${new Date().toLocaleDateString()}`, { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(`Verification Code: ${verifyCode}`, { align: 'center' })

    doc.end()

    const certificate = new Certificate({
      student: req.user._id,
      course: courseId,
      scorePct: percentage,
      verifyCode,
      pdfUrl: `/media/certificate-${verifyCode}.pdf`,
    })

    await certificate.save()

    res.status(201).json({
      certificate: {
        _id: certificate._id,
        course: course.title,
        scorePct: certificate.scorePct,
        issuedAt: certificate.issuedAt,
        verifyCode: certificate.verifyCode,
        pdfUrl: certificate.pdfUrl,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate certificate' })
  }
})

// Verify certificate
router.get('/verify/:code', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ verifyCode: req.params.code })
      .populate('student', 'name')
      .populate('course', 'title')

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' })
    }

    res.json({
      certificate: {
        student: certificate.student.name,
        course: certificate.course.title,
        scorePct: certificate.scorePct,
        issuedAt: certificate.issuedAt,
        verifyCode: certificate.verifyCode,
      },
      valid: true,
    })
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' })
  }
})

// Create live poll (tutor)
router.post('/polls', authenticate, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const { courseId, question, options } = req.body

    const poll = new Poll({
      course: courseId,
      question,
      options: options.map((opt, index) => ({
        key: String.fromCharCode(65 + index), // A, B, C, etc.
        text: opt,
      })),
    })

    await poll.save()
    res.status(201).json({ poll })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create poll' })
  }
})

// Vote on poll (student)
router.post('/polls/:pollId/vote', authenticate, authorize('student'), async (req, res) => {
  try {
    const { optionKey } = req.body
    const poll = await Poll.findById(req.params.pollId)

    if (!poll || !poll.isOpen) {
      return res.status(404).json({ error: 'Poll not found or closed' })
    }

    const currentCount = poll.counts.get(optionKey) || 0
    poll.counts.set(optionKey, currentCount + 1)

    await poll.save()
    res.json({ message: 'Vote recorded' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to record vote' })
  }
})

export default router