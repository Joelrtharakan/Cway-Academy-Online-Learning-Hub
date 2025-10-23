import express from 'express'
import multer from 'multer'
import path from 'path'
import { Course, User, Enrollment } from '../models/index.js'
import { authenticate, authorize, validate, schemas } from '../middleware/auth.js'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'server/storage/media'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only video and PDF files are allowed'))
    }
  }
})

// Get courses (public)
router.get('/', async (req, res) => {
  try {
    const { search, category, tutor, page = 1, limit = 10 } = req.query

    let query = { published: true }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    if (category) {
      query.category = category
    }

    if (tutor) {
      query.tutor = tutor
    }

    const courses = await Course.find(query)
      .populate('tutor', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Course.countDocuments(query)

    res.json({
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' })
  }
})

// Get course by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('tutor', 'name avatarUrl')

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    res.json({ course })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' })
  }
})

// Create course (tutor/admin)
router.post('/', authenticate, authorize('tutor', 'admin'), validate(schemas.course), async (req, res) => {
  try {
    const courseData = { ...req.body, tutor: req.user._id }
    const course = new Course(courseData)
    await course.save()

    await course.populate('tutor', 'name avatarUrl')
    res.status(201).json({ course })
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Course slug already exists' })
    } else {
      res.status(500).json({ error: 'Failed to create course' })
    }
  }
})

// Update course (tutor/admin)
router.patch('/:id', authenticate, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this course' })
    }

    Object.assign(course, req.body)
    await course.save()
    await course.populate('tutor', 'name avatarUrl')

    res.json({ course })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' })
  }
})

// Add section to course
router.post('/:id/sections', authenticate, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const { title, order } = req.body
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' })
    }

    course.sections.push({ title, order, lessons: [] })
    await course.save()

    res.status(201).json({ section: course.sections[course.sections.length - 1] })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add section' })
  }
})

// Add lesson to course
router.post('/:id/lessons', authenticate, authorize('tutor', 'admin'), upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'resources', maxCount: 5 }
]), async (req, res) => {
  try {
    const { sectionId, title, order, textNotes, durationSec } = req.body
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const section = course.sections.id(sectionId)
    if (!section) {
      return res.status(404).json({ error: 'Section not found' })
    }

    const videoUrl = req.files.video ? `/media/${req.files.video[0].filename}` : ''
    const resources = req.files.resources ? req.files.resources.map(file => ({
      name: file.originalname,
      url: `/media/${file.filename}`,
    })) : []

    section.lessons.push({
      title,
      order: parseInt(order),
      videoUrl,
      resources,
      textNotes,
      durationSec: parseInt(durationSec) || 0,
    })

    await course.save()
    res.status(201).json({ lesson: section.lessons[section.lessons.length - 1] })
  } catch (error) {
    res.status(500).json({ error: 'Failed to add lesson' })
  }
})

// Get enrolled courses (student)
router.get('/enrolled/me', authenticate, authorize('student'), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'tutor', select: 'name avatarUrl' }
      })
      .sort({ enrolledAt: -1 })

    const enrolledCourses = enrollments.map(enrollment => ({
      ...enrollment.course.toObject(),
      enrollment: {
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
        completedAt: enrollment.completedAt,
      }
    }))

    res.json({ courses: enrolledCourses })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled courses' })
  }
})

// Enroll in course (student)
router.post('/:id/enrol', authenticate, authorize('student'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.id,
    })

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' })
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: req.user._id,
      course: req.params.id,
    })

    await enrollment.save()
    res.json({ message: 'Enrolled successfully', enrollment })
  } catch (error) {
    res.status(500).json({ error: 'Enrollment failed' })
  }
})

export default router