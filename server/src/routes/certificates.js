import express from 'express'
import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'
import { Certificate, Course, User } from '../models/index.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()

// Generate certificate PDF
function generateCertificatePDF(certificate, student, course) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50,
    })

    const filename = `certificate-${certificate._id}.pdf`
    const filepath = path.join(process.cwd(), 'server/storage/certificates', filename)

    // Ensure certificates directory exists
    const certDir = path.join(process.cwd(), 'server/storage/certificates')
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true })
    }

    const stream = fs.createWriteStream(filepath)
    doc.pipe(stream)

    // Certificate background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa')

    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(3)
       .stroke('#fbbf24')

    // Header
    doc.fillColor('#1f2937')
       .fontSize(36)
       .font('Helvetica-Bold')
       .text('CERTIFICATE OF COMPLETION', 0, 80, { align: 'center' })

    // Subtitle
    doc.fillColor('#6b7280')
       .fontSize(18)
       .font('Helvetica')
       .text('This certifies that', 0, 140, { align: 'center' })

    // Student name
    doc.fillColor('#1f2937')
       .fontSize(32)
       .font('Helvetica-Bold')
       .text(student.name, 0, 180, { align: 'center' })

    // Completion text
    doc.fillColor('#6b7280')
       .fontSize(16)
       .font('Helvetica')
       .text('has successfully completed the course', 0, 220, { align: 'center' })

    // Course name
    doc.fillColor('#1f2937')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text(course.title, 0, 260, { align: 'center' })

    // Score and date
    doc.fillColor('#6b7280')
       .fontSize(14)
       .font('Helvetica')
       .text(`With a score of ${certificate.scorePct}%`, 0, 320, { align: 'center' })

    doc.text(`Issued on ${new Date(certificate.issuedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 0, 350, { align: 'center' })

    // Verification code
    doc.fillColor('#6b7280')
       .fontSize(12)
       .font('Helvetica')
       .text(`Verification Code: ${certificate.verifyCode}`, 0, 400, { align: 'center' })

    // Footer
    doc.fillColor('#9ca3af')
       .fontSize(10)
       .font('Helvetica')
       .text('Cway Academy - Online Learning Platform', 0, doc.page.height - 60, { align: 'center' })

    // QR Code placeholder (you could add actual QR code generation)
    doc.rect(doc.page.width - 120, doc.page.height - 120, 80, 80)
       .fill('#e5e7eb')
       .stroke('#d1d5db')

    doc.fillColor('#6b7280')
       .fontSize(8)
       .text('Scan to verify', doc.page.width - 100, doc.page.height - 100)

    doc.end()

    stream.on('finish', () => resolve(filepath))
    stream.on('error', reject)
  })
}

// Issue certificate (automatic on course completion)
router.post('/issue', authenticate, async (req, res) => {
  try {
    const { courseId, scorePct } = req.body

    // Check if certificate already exists
    const existingCert = await Certificate.findOne({
      student: req.user._id,
      course: courseId,
    })

    if (existingCert) {
      return res.status(400).json({ error: 'Certificate already issued' })
    }

    // Verify course completion (simplified check)
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    // Generate verification code
    const verifyCode = Math.random().toString(36).substring(2, 15) +
                      Math.random().toString(36).substring(2, 15)

    const certificate = new Certificate({
      student: req.user._id,
      course: courseId,
      scorePct,
      verifyCode,
    })

    await certificate.save()
    await certificate.populate(['student', 'course'])

    // Generate PDF
    const pdfPath = await generateCertificatePDF(certificate, certificate.student, certificate.course)

    // Update certificate with PDF URL
    certificate.pdfUrl = `/certificates/${path.basename(pdfPath)}`
    await certificate.save()

    res.status(201).json({ certificate })
  } catch (error) {
    console.error('Certificate generation error:', error)
    res.status(500).json({ error: 'Failed to generate certificate' })
  }
})

// Get user's certificates
router.get('/my-certificates', authenticate, async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate('course', 'title description')
      .sort({ issuedAt: -1 })

    res.json({ certificates })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certificates' })
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
      valid: true,
      certificate: {
        studentName: certificate.student.name,
        courseTitle: certificate.course.title,
        scorePct: certificate.scorePct,
        issuedAt: certificate.issuedAt,
        verifyCode: certificate.verifyCode,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify certificate' })
  }
})

// Download certificate PDF
router.get('/:id/download', authenticate, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' })
    }

    // Check ownership
    if (certificate.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const filepath = path.join(process.cwd(), 'server/storage', certificate.pdfUrl)

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Certificate file not found' })
    }

    res.download(filepath, `Certificate-${certificate.verifyCode}.pdf`)
  } catch (error) {
    res.status(500).json({ error: 'Failed to download certificate' })
  }
})

// Get course certificates (tutor/admin)
router.get('/course/:courseId', authenticate, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    // Check ownership
    if (course.tutor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' })
    }

    const certificates = await Certificate.find({ course: req.params.courseId })
      .populate('student', 'name email')
      .sort({ issuedAt: -1 })

    res.json({ certificates })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certificates' })
  }
})

export default router