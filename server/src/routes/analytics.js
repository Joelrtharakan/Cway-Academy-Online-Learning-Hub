import express from 'express'
import { Course, Attempt, User, Certificate } from '../models/index.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// Course analytics (tutor/admin)
router.get('/course/:id', authenticate, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' })
    }

    // Mock enrollment count (in real app, use Enrollment model)
    const enrollmentCount = Math.floor(Math.random() * 100) + 10

    // Calculate completion rate (certificates issued / enrollments)
    const certificatesCount = await Certificate.countDocuments({ course: req.params.id })
    const completionRate = Math.round((certificatesCount / enrollmentCount) * 100)

    // Average quiz score
    const attempts = await Attempt.find()
      .populate({
        path: 'quiz',
        match: { course: req.params.id },
      })

    const validAttempts = attempts.filter(a => a.quiz)
    const avgScore = validAttempts.length > 0
      ? Math.round(validAttempts.reduce((sum, a) => sum + a.score, 0) / validAttempts.length)
      : 0

    // Active students (attempts in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const activeStudents = await Attempt.distinct('student', {
      createdAt: { $gte: sevenDaysAgo },
    }).then(students => students.length)

    res.json({
      analytics: {
        enrollmentCount,
        completionRate,
        avgScore,
        activeStudents,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})

// System analytics (admin only)
router.get('/system', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalCourses = await Course.countDocuments()
    const totalCertificates = await Certificate.countDocuments()
    const totalAttempts = await Attempt.countDocuments()

    // Mock additional metrics
    const activeUsers = Math.floor(totalUsers * 0.3)
    const revenue = Math.floor(Math.random() * 10000) + 5000

    res.json({
      analytics: {
        totalUsers,
        totalCourses,
        totalCertificates,
        totalAttempts,
        activeUsers,
        revenue,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch system analytics' })
  }
})

export default router