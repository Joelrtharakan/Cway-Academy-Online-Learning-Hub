import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { User, Course, Quiz, Badge, UserBadge, DiscussionMessage, Certificate } from '../models/index.js'
import { hashPassword } from '../utils/auth.js'

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cway-academy')
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Course.deleteMany({})
    await Quiz.deleteMany({})
    await Badge.deleteMany({})
    await UserBadge.deleteMany({})
    await DiscussionMessage.deleteMany({})
    await Certificate.deleteMany({})

    console.log('Cleared existing data')

    // Create users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@cway.ac',
        password: 'P@ssw0rd!',
        role: 'admin',
      },
      {
        name: 'Tutor AI',
        email: 'tutor.ai@cway.ac',
        password: 'P@ssw0rd!',
        role: 'tutor',
      },
      {
        name: 'Tutor Math',
        email: 'tutor.math@cway.ac',
        password: 'P@ssw0rd!',
        role: 'tutor',
      },
      {
        name: 'Ali Student',
        email: 'ali.student@cway.ac',
        password: 'P@ssw0rd!',
        role: 'student',
      },
      {
        name: 'Rina Student',
        email: 'rina.student@cway.ac',
        password: 'P@ssw0rd!',
        role: 'student',
      },
      {
        name: 'Dev Student',
        email: 'dev.student@cway.ac',
        password: 'P@ssw0rd!',
        role: 'student',
      },
    ]

    const createdUsers = []
    for (const userData of users) {
      const hash = await hashPassword(userData.password)
      const user = new User({
        name: userData.name,
        email: userData.email,
        hash,
        role: userData.role,
      })
      await user.save()
      createdUsers.push(user)
      console.log(`Created user: ${user.email}`)
    }

    // Create badges
    const badges = [
      { code: 'FIRST_QUIZ', label: 'First Quiz', description: 'Completed your first quiz' },
      { code: 'CONSISTENT_7D', label: 'Consistent Learner', description: '7-day learning streak' },
      { code: 'QUIZ_MASTER_90', label: 'Quiz Master', description: 'Scored 90% or higher on a quiz' },
    ]

    const createdBadges = []
    for (const badgeData of badges) {
      const badge = new Badge(badgeData)
      await badge.save()
      createdBadges.push(badge)
    }

    // Create courses
    const courses = [
      {
        title: 'Intro to Data Structures',
        slug: 'intro-data-structures',
        category: 'Programming',
        description: 'Learn fundamental data structures and algorithms',
        tutor: createdUsers[1]._id, // tutor.ai
        published: true,
        sections: [
          {
            title: 'Arrays & Lists',
            order: 1,
            lessons: [
              {
                title: 'Introduction to Arrays',
                order: 1,
                videoUrl: '/media/sample-video-1.mp4',
                textNotes: 'Arrays are fundamental data structures...',
                durationSec: 300,
                resources: [
                  { name: 'Array Cheat Sheet.pdf', url: '/media/array-cheat-sheet.pdf' },
                ],
              },
            ],
          },
          {
            title: 'Stacks & Queues',
            order: 2,
            lessons: [
              {
                title: 'Stack Operations',
                order: 1,
                videoUrl: '/media/sample-video-2.mp4',
                textNotes: 'Stacks follow LIFO principle...',
                durationSec: 240,
                resources: [],
              },
            ],
          },
        ],
      },
      {
        title: 'Foundations of UI/UX Design',
        slug: 'ui-ux-foundations',
        category: 'Design',
        description: 'Master the principles of user interface and experience design',
        tutor: createdUsers[1]._id,
        published: true,
        sections: [
          {
            title: 'Design Principles',
            order: 1,
            lessons: [
              {
                title: 'Color Theory and Psychology',
                order: 1,
                videoUrl: '/media/sample-video-3.mp4',
                textNotes: 'Understanding color in design...',
                durationSec: 360,
                resources: [
                  { name: 'Color Palette Guide.pdf', url: '/media/color-guide.pdf' },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'Math for Developers',
        slug: 'math-for-developers',
        category: 'Math',
        description: 'Essential mathematical concepts for software development',
        tutor: createdUsers[2]._id, // tutor.math
        published: true,
        sections: [
          {
            title: 'Algebra Refresher',
            order: 1,
            lessons: [
              {
                title: 'Linear Equations',
                order: 1,
                videoUrl: '/media/sample-video-4.mp4',
                textNotes: 'Solving linear equations...',
                durationSec: 280,
                resources: [],
              },
            ],
          },
        ],
      },
    ]

    const createdCourses = []
    for (const courseData of courses) {
      const course = new Course(courseData)
      await course.save()
      createdCourses.push(course)
      console.log(`Created course: ${course.title}`)
    }

    // Create quizzes
    const quizzes = [
      {
        course: createdCourses[0]._id,
        lesson: createdCourses[0].sections[0].lessons[0]._id,
        timeLimitSec: 600,
        attemptsAllowed: 2,
        questions: [
          {
            type: 'MCQ',
            prompt: 'Which data structure provides O(1) average lookup by key?',
            options: [
              { key: 'A', text: 'Array' },
              { key: 'B', text: 'Hash Map' },
              { key: 'C', text: 'Linked List' },
              { key: 'D', text: 'Queue' },
            ],
            answerKeys: ['B'],
            points: 2,
          },
          {
            type: 'MAQ',
            prompt: 'Select all LIFO structures.',
            options: [
              { key: 'A', text: 'Stack' },
              { key: 'B', text: 'Queue' },
              { key: 'C', text: 'Call stack' },
              { key: 'D', text: 'Priority Queue' },
            ],
            answerKeys: ['A', 'C'],
            points: 2,
          },
          {
            type: 'TF',
            prompt: 'A queue is typically FIFO.',
            options: [
              { key: 'A', text: 'True' },
              { key: 'B', text: 'False' },
            ],
            answerKeys: ['A'],
            points: 1,
          },
        ],
      },
    ]

    const createdQuizzes = []
    for (const quizData of quizzes) {
      const quiz = new Quiz(quizData)
      await quiz.save()
      createdQuizzes.push(quiz)
      console.log(`Created quiz for course: ${quiz.course}`)
    }

    // Create sample discussion messages
    const discussionMessages = []
    const rooms = ['course-intro-data-structures', 'course-ui-ux-foundations', 'course-math-for-developers']
    const sampleTexts = [
      'Great explanation of arrays!',
      'I have a question about the time complexity.',
      'This concept really helped me understand.',
      'Can you provide more examples?',
      'Thanks for the clear explanation.',
      'I think I need to review this topic again.',
      'The visualization really helps.',
      'Is there additional reading material?',
      'This is more complex than I expected.',
      'Good job on the lesson structure.',
    ]

    for (let i = 0; i < 30; i++) {
      const room = rooms[Math.floor(Math.random() * rooms.length)]
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)]
      const daysAgo = Math.floor(Math.random() * 7)
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      discussionMessages.push({
        room,
        user: user._id,
        text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
        createdAt,
      })
    }

    for (const msgData of discussionMessages) {
      const message = new DiscussionMessage(msgData)
      await message.save()
    }

    // Create sample certificates
    const certificates = [
      {
        student: createdUsers[3]._id, // ali.student
        course: createdCourses[0]._id,
        scorePct: 85,
        verifyCode: 'CWAY-123456-000001',
        pdfUrl: '/media/certificate-CWAY-123456-000001.pdf',
      },
      {
        student: createdUsers[4]._id, // rina.student
        course: createdCourses[1]._id,
        scorePct: 92,
        verifyCode: 'CWAY-789012-000002',
        pdfUrl: '/media/certificate-CWAY-789012-000002.pdf',
      },
    ]

    for (const certData of certificates) {
      const certificate = new Certificate(certData)
      await certificate.save()
    }

    // Create sample user badges
    const userBadges = [
      { user: createdUsers[3]._id, badge: createdBadges[0]._id },
      { user: createdUsers[3]._id, badge: createdBadges[2]._id },
      { user: createdUsers[4]._id, badge: createdBadges[0]._id },
      { user: createdUsers[4]._id, badge: createdBadges[1]._id },
    ]

    for (const ubData of userBadges) {
      const userBadge = new UserBadge(ubData)
      await userBadge.save()
    }

    // Create sample media files (mock)
    const mediaDir = path.join(process.cwd(), 'server/storage/media')
    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true })
    }

    // Create placeholder files
    const sampleFiles = [
      'sample-video-1.mp4',
      'sample-video-2.mp4',
      'sample-video-3.mp4',
      'sample-video-4.mp4',
      'array-cheat-sheet.pdf',
      'color-guide.pdf',
    ]

    for (const file of sampleFiles) {
      const filePath = path.join(mediaDir, file)
      fs.writeFileSync(filePath, `Mock file: ${file}`)
    }

    console.log('Sample data seeded successfully!')
    console.log('\nDemo Accounts:')
    console.log('Admin: admin@cway.ac / P@ssw0rd!')
    console.log('Tutor AI: tutor.ai@cway.ac / P@ssw0rd!')
    console.log('Tutor Math: tutor.math@cway.ac / P@ssw0rd!')
    console.log('Student Ali: ali.student@cway.ac / P@ssw0rd!')
    console.log('Student Rina: rina.student@cway.ac / P@ssw0rd!')
    console.log('Student Dev: dev.student@cway.ac / P@ssw0rd!')

  } catch (error) {
    console.error('Seeding error:', error)
  } finally {
    mongoose.connection.close()
  }
}

connectDB().then(() => {
  seedData()
})