import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { User, Course, Quiz, Attempt, DiscussionMessage, Certificate, Badge, UserBadge, Poll } from '../models/index.js'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const saltRounds = 10

// Mock data
const users = [
  {
    name: 'Admin User',
    email: 'admin@cway.ac',
    password: 'P@ssw0rd!',
    role: 'admin',
    avatarUrl: '/media/avatars/admin.jpg'
  },
  {
    name: 'AI Tutor',
    email: 'tutor.ai@cway.ac',
    password: 'P@ssw0rd!',
    role: 'tutor',
    avatarUrl: '/media/avatars/tutor-ai.jpg'
  },
  {
    name: 'Math Tutor',
    email: 'tutor.math@cway.ac',
    password: 'P@ssw0rd!',
    role: 'tutor',
    avatarUrl: '/media/avatars/tutor-math.jpg'
  },
  {
    name: 'Ali Student',
    email: 'ali.student@cway.ac',
    password: 'P@ssw0rd!',
    role: 'student',
    avatarUrl: '/media/avatars/student-ali.jpg'
  },
  {
    name: 'Rina Student',
    email: 'rina.student@cway.ac',
    password: 'P@ssw0rd!',
    role: 'student',
    avatarUrl: '/media/avatars/student-rina.jpg'
  },
  {
    name: 'Dev Student',
    email: 'dev.student@cway.ac',
    password: 'P@ssw0rd!',
    role: 'student',
    avatarUrl: '/media/avatars/student-dev.jpg'
  }
]

const badges = [
  {
    code: 'FIRST_QUIZ',
    label: 'First Quiz',
    description: 'Completed your first quiz'
  },
  {
    code: 'CONSISTENT_7D',
    label: 'Consistent Learner',
    description: '7-day learning streak'
  },
  {
    code: 'QUIZ_MASTER_90',
    label: 'Quiz Master',
    description: 'Scored 90% or higher on a quiz'
  },
  {
    code: 'COURSE_COMPLETER',
    label: 'Course Completer',
    description: 'Completed an entire course'
  },
  {
    code: 'DISCUSSION_STARTER',
    label: 'Discussion Starter',
    description: 'Started 5 discussions'
  }
]

const courses = [
  {
    title: 'Introduction to Data Structures',
    slug: 'intro-data-structures',
    category: 'Programming',
    description: 'Master the fundamentals of data structures and algorithms with JavaScript. Learn arrays, linked lists, stacks, queues, trees, and graphs with practical examples.',
    price: 49.99,
    published: true,
    sections: [
      {
        title: 'Arrays & Lists',
        order: 1,
        lessons: [
          {
            title: 'Understanding Arrays',
            order: 1,
            videoUrl: 'https://www.youtube.com/watch?v=RtGdY0RzGwQ',
            startTime: 0,
            endTime: 420,
            textNotes: 'Arrays are fundamental data structures that store elements of the same type in contiguous memory locations...',
            durationSec: 420,
            resources: [
              { name: 'Array Cheat Sheet', url: '/media/resources/array-cheatsheet.pdf' },
              { name: 'Array Exercises', url: '/media/resources/array-exercises.pdf' }
            ]
          },
          {
            title: 'Dynamic Arrays and Lists',
            order: 2,
            videoUrl: 'https://www.youtube.com/watch?v=RtGdY0RzGwQ',
            startTime: 420,
            endTime: 800,
            textNotes: 'Dynamic arrays automatically resize when needed, providing flexibility...',
            durationSec: 380,
            resources: [
              { name: 'List Implementation Guide', url: '/media/resources/list-guide.pdf' }
            ]
          }
        ]
      },
      {
        title: 'Stacks & Queues',
        order: 2,
        lessons: [
          {
            title: 'Stack Operations',
            order: 1,
            videoUrl: 'https://www.youtube.com/watch?v=1AJ4ldcH2nE',
            startTime: 0,
            endTime: 350,
            textNotes: 'Stacks follow LIFO (Last In, First Out) principle...',
            durationSec: 350,
            resources: [
              { name: 'Stack Visualizations', url: '/media/resources/stack-viz.pdf' }
            ]
          },
          {
            title: 'Queue Fundamentals',
            order: 2,
            videoUrl: 'https://www.youtube.com/watch?v=1AJ4ldcH2nE',
            startTime: 350,
            endTime: 670,
            textNotes: 'Queues follow FIFO (First In, First Out) principle...',
            durationSec: 320,
            resources: [
              { name: 'Queue Examples', url: '/media/resources/queue-examples.pdf' }
            ]
          }
        ]
      },
      {
        title: 'Trees & Graphs',
        order: 3,
        lessons: [
          {
            title: 'Binary Trees',
            order: 1,
            videoUrl: '/media/videos/ds-trees.mp4',
            textNotes: 'Trees are hierarchical data structures with nodes connected by edges...',
            durationSec: 450,
            resources: [
              { name: 'Tree Algorithms', url: '/media/resources/tree-algorithms.pdf' }
            ]
          },
          {
            title: 'Graph Theory Basics',
            order: 2,
            videoUrl: '/media/videos/ds-graphs.mp4',
            textNotes: 'Graphs consist of vertices connected by edges...',
            durationSec: 400,
            resources: [
              { name: 'Graph Problems', url: '/media/resources/graph-problems.pdf' }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Foundations of UI/UX Design',
    slug: 'ui-ux-foundations',
    category: 'Design',
    description: 'Learn the principles of user interface and user experience design. Master wireframing, prototyping, and user-centered design methodologies.',
    price: 39.99,
    published: true,
    sections: [
      {
        title: 'Design Principles',
        order: 1,
        lessons: [
          {
            title: 'Color Theory and Psychology',
            order: 1,
            videoUrl: 'https://www.youtube.com/watch?v=6H8U9RGWPiM',
            startTime: 0,
            endTime: 380,
            textNotes: 'Understanding color theory is crucial for effective UI design...',
            durationSec: 380,
            resources: [
              { name: 'Color Palette Guide', url: '/media/resources/color-guide.pdf' }
            ]
          },
          {
            title: 'Typography Fundamentals',
            order: 2,
            videoUrl: 'https://www.youtube.com/watch?v=6H8U9RGWPiM',
            startTime: 380,
            endTime: 720,
            textNotes: 'Typography affects readability and user experience...',
            durationSec: 340,
            resources: [
              { name: 'Font Pairing Guide', url: '/media/resources/typography-guide.pdf' }
            ]
          }
        ]
      },
      {
        title: 'Wireframing',
        order: 2,
        lessons: [
          {
            title: 'Low-Fidelity Wireframes',
            order: 1,
            videoUrl: '/media/videos/uiux-wireframes.mp4',
            textNotes: 'Wireframes are blueprints for your digital products...',
            durationSec: 360,
            resources: [
              { name: 'Wireframe Templates', url: '/media/resources/wireframe-templates.pdf' }
            ]
          }
        ]
      },
      {
        title: 'Prototyping',
        order: 3,
        lessons: [
          {
            title: 'Interactive Prototypes',
            order: 1,
            videoUrl: '/media/videos/uiux-prototyping.mp4',
            textNotes: 'Prototypes bring your designs to life...',
            durationSec: 420,
            resources: [
              { name: 'Prototype Checklist', url: '/media/resources/prototype-checklist.pdf' }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Mathematics for Developers',
    slug: 'math-for-developers',
    category: 'Math',
    description: 'Essential mathematical concepts every developer should know. From algebra to probability, learn the math that powers modern software.',
    price: 44.99,
    published: true,
    sections: [
      {
        title: 'Algebra Refresher',
        order: 1,
        lessons: [
          {
            title: 'Linear Equations',
            order: 1,
            videoUrl: '/media/videos/math-algebra.mp4',
            textNotes: 'Linear equations form the foundation of many algorithms...',
            durationSec: 390,
            resources: [
              { name: 'Algebra Formulas', url: '/media/resources/algebra-formulas.pdf' }
            ]
          }
        ]
      },
      {
        title: 'Calculus Lite',
        order: 2,
        lessons: [
          {
            title: 'Limits and Continuity',
            order: 1,
            videoUrl: '/media/videos/math-calculus.mp4',
            textNotes: 'Understanding limits is crucial for optimization problems...',
            durationSec: 410,
            resources: [
              { name: 'Calculus Cheat Sheet', url: '/media/resources/calculus-cheatsheet.pdf' }
            ]
          }
        ]
      },
      {
        title: 'Probability Basics',
        order: 3,
        lessons: [
          {
            title: 'Basic Probability',
            order: 1,
            videoUrl: '/media/videos/math-probability.mp4',
            textNotes: 'Probability theory is essential for machine learning and data science...',
            durationSec: 370,
            resources: [
              { name: 'Probability Examples', url: '/media/resources/probability-examples.pdf' }
            ]
          }
        ]
      }
    ]
  }
]

const quizQuestions = {
  'intro-data-structures': [
    {
      type: 'MCQ',
      prompt: 'Which data structure provides O(1) average lookup by key?',
      options: [
        { key: 'A', text: 'Array' },
        { key: 'B', text: 'Hash Map' },
        { key: 'C', text: 'Linked List' },
        { key: 'D', text: 'Queue' }
      ],
      answerKeys: ['B'],
      points: 2
    },
    {
      type: 'MAQ',
      prompt: 'Select all LIFO (Last In, First Out) structures.',
      options: [
        { key: 'A', text: 'Stack' },
        { key: 'B', text: 'Queue' },
        { key: 'C', text: 'Call stack' },
        { key: 'D', text: 'Priority Queue' }
      ],
      answerKeys: ['A', 'C'],
      points: 2
    },
    {
      type: 'TF',
      prompt: 'A queue is typically FIFO (First In, First Out).',
      options: [
        { key: 'A', text: 'True' },
        { key: 'B', text: 'False' }
      ],
      answerKeys: ['A'],
      points: 1
    },
    {
      type: 'MCQ',
      prompt: 'What is the time complexity of inserting an element at the beginning of a linked list?',
      options: [
        { key: 'A', text: 'O(1)' },
        { key: 'B', text: 'O(n)' },
        { key: 'C', text: 'O(log n)' },
        { key: 'D', text: 'O(n²)' }
      ],
      answerKeys: ['A'],
      points: 2
    },
    {
      type: 'MAQ',
      prompt: 'Which of the following are tree traversal methods?',
      options: [
        { key: 'A', text: 'Inorder' },
        { key: 'B', text: 'Preorder' },
        { key: 'C', text: 'Postorder' },
        { key: 'D', text: 'Levelorder' }
      ],
      answerKeys: ['A', 'B', 'C', 'D'],
      points: 3
    }
  ],
  'ui-ux-foundations': [
    {
      type: 'MCQ',
      prompt: 'Which color scheme uses colors that are opposite each other on the color wheel?',
      options: [
        { key: 'A', text: 'Monochromatic' },
        { key: 'B', text: 'Analogous' },
        { key: 'C', text: 'Complementary' },
        { key: 'D', text: 'Triadic' }
      ],
      answerKeys: ['C'],
      points: 2
    },
    {
      type: 'TF',
      prompt: 'Wireframes should include detailed visual design elements.',
      options: [
        { key: 'A', text: 'True' },
        { key: 'B', text: 'False' }
      ],
      answerKeys: ['B'],
      points: 1
    },
    {
      type: 'MAQ',
      prompt: 'Which principles are part of Gestalt theory?',
      options: [
        { key: 'A', text: 'Proximity' },
        { key: 'B', text: 'Similarity' },
        { key: 'C', text: 'Continuity' },
        { key: 'D', text: 'Balance' }
      ],
      answerKeys: ['A', 'B', 'C'],
      points: 2
    }
  ],
  'math-for-developers': [
    {
      type: 'MCQ',
      prompt: 'What is the derivative of x²?',
      options: [
        { key: 'A', text: 'x' },
        { key: 'B', text: '2x' },
        { key: 'C', text: 'x²' },
        { key: 'D', text: '2' }
      ],
      answerKeys: ['B'],
      points: 2
    },
    {
      type: 'TF',
      prompt: 'Probability values range from 0 to 1.',
      options: [
        { key: 'A', text: 'True' },
        { key: 'B', text: 'False' }
      ],
      answerKeys: ['A'],
      points: 1
    },
    {
      type: 'MAQ',
      prompt: 'Which are examples of discrete probability distributions?',
      options: [
        { key: 'A', text: 'Binomial' },
        { key: 'B', text: 'Poisson' },
        { key: 'C', text: 'Normal' },
        { key: 'D', text: 'Geometric' }
      ],
      answerKeys: ['A', 'B', 'D'],
      points: 2
    }
  ]
}

async function createMockFiles() {
  const storageDir = path.join(__dirname, '../../storage')
  const mediaDir = path.join(storageDir, 'media')
  const certificatesDir = path.join(storageDir, 'certificates')
  const mockMailsDir = path.join(storageDir, 'mock-mails')

  // Create directories
  const dirs = [mediaDir, path.join(mediaDir, 'videos'), path.join(mediaDir, 'avatars'), path.join(mediaDir, 'resources'), certificatesDir, mockMailsDir]
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })

  // Create placeholder files
  const placeholders = [
    { path: path.join(mediaDir, 'videos', 'ds-arrays.mp4'), content: 'Mock video file for Data Structures Arrays lesson' },
    { path: path.join(mediaDir, 'videos', 'ds-lists.mp4'), content: 'Mock video file for Data Structures Lists lesson' },
    { path: path.join(mediaDir, 'videos', 'ds-stacks.mp4'), content: 'Mock video file for Data Structures Stacks lesson' },
    { path: path.join(mediaDir, 'videos', 'ds-queues.mp4'), content: 'Mock video file for Data Structures Queues lesson' },
    { path: path.join(mediaDir, 'videos', 'ds-trees.mp4'), content: 'Mock video file for Data Structures Trees lesson' },
    { path: path.join(mediaDir, 'videos', 'ds-graphs.mp4'), content: 'Mock video file for Data Structures Graphs lesson' },
    { path: path.join(mediaDir, 'videos', 'uiux-colors.mp4'), content: 'Mock video file for UI/UX Colors lesson' },
    { path: path.join(mediaDir, 'videos', 'uiux-typography.mp4'), content: 'Mock video file for UI/UX Typography lesson' },
    { path: path.join(mediaDir, 'videos', 'uiux-wireframes.mp4'), content: 'Mock video file for UI/UX Wireframes lesson' },
    { path: path.join(mediaDir, 'videos', 'uiux-prototyping.mp4'), content: 'Mock video file for UI/UX Prototyping lesson' },
    { path: path.join(mediaDir, 'videos', 'math-algebra.mp4'), content: 'Mock video file for Math Algebra lesson' },
    { path: path.join(mediaDir, 'videos', 'math-calculus.mp4'), content: 'Mock video file for Math Calculus lesson' },
    { path: path.join(mediaDir, 'videos', 'math-probability.mp4'), content: 'Mock video file for Math Probability lesson' },
    { path: path.join(mediaDir, 'avatars', 'admin.jpg'), content: 'Mock avatar for admin' },
    { path: path.join(mediaDir, 'avatars', 'tutor-ai.jpg'), content: 'Mock avatar for AI tutor' },
    { path: path.join(mediaDir, 'avatars', 'tutor-math.jpg'), content: 'Mock avatar for Math tutor' },
    { path: path.join(mediaDir, 'avatars', 'student-ali.jpg'), content: 'Mock avatar for Ali student' },
    { path: path.join(mediaDir, 'avatars', 'student-rina.jpg'), content: 'Mock avatar for Rina student' },
    { path: path.join(mediaDir, 'avatars', 'student-dev.jpg'), content: 'Mock avatar for Dev student' },
    { path: path.join(mediaDir, 'resources', 'array-cheatsheet.pdf'), content: 'Mock PDF for array cheat sheet' },
    { path: path.join(mediaDir, 'resources', 'array-exercises.pdf'), content: 'Mock PDF for array exercises' },
    { path: path.join(mediaDir, 'resources', 'list-guide.pdf'), content: 'Mock PDF for list guide' },
    { path: path.join(mediaDir, 'resources', 'stack-viz.pdf'), content: 'Mock PDF for stack visualizations' },
    { path: path.join(mediaDir, 'resources', 'queue-examples.pdf'), content: 'Mock PDF for queue examples' },
    { path: path.join(mediaDir, 'resources', 'tree-algorithms.pdf'), content: 'Mock PDF for tree algorithms' },
    { path: path.join(mediaDir, 'resources', 'graph-problems.pdf'), content: 'Mock PDF for graph problems' },
    { path: path.join(mediaDir, 'resources', 'color-guide.pdf'), content: 'Mock PDF for color guide' },
    { path: path.join(mediaDir, 'resources', 'typography-guide.pdf'), content: 'Mock PDF for typography guide' },
    { path: path.join(mediaDir, 'resources', 'wireframe-templates.pdf'), content: 'Mock PDF for wireframe templates' },
    { path: path.join(mediaDir, 'resources', 'prototype-checklist.pdf'), content: 'Mock PDF for prototype checklist' },
    { path: path.join(mediaDir, 'resources', 'algebra-formulas.pdf'), content: 'Mock PDF for algebra formulas' },
    { path: path.join(mediaDir, 'resources', 'calculus-cheatsheet.pdf'), content: 'Mock PDF for calculus cheat sheet' },
    { path: path.join(mediaDir, 'resources', 'probability-examples.pdf'), content: 'Mock PDF for probability examples' }
  ]

  placeholders.forEach(({ path: filePath, content }) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content)
    }
  })
}

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cway-academy', {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
    })
    console.log('Connected to MongoDB Atlas')
    console.log('🌱 Starting database seeding...')

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Quiz.deleteMany({}),
      Attempt.deleteMany({}),
      DiscussionMessage.deleteMany({}),
      Certificate.deleteMany({}),
      Badge.deleteMany({}),
      UserBadge.deleteMany({}),
      Poll.deleteMany({})
    ])

    console.log('🧹 Cleared existing data')

    // Create mock files
    await createMockFiles()
    console.log('📁 Created mock media files')

    // Create badges
    const createdBadges = await Badge.insertMany(badges)
    console.log('🏆 Created badges')

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        hash: await bcrypt.hash(user.password, saltRounds)
      }))
    )

    const createdUsers = await User.insertMany(hashedUsers)
    console.log('👥 Created users')

    // Get user references
    const adminUser = createdUsers.find(u => u.role === 'admin')
    const aiTutor = createdUsers.find(u => u.email === 'tutor.ai@cway.ac')
    const mathTutor = createdUsers.find(u => u.email === 'tutor.math@cway.ac')
    const students = createdUsers.filter(u => u.role === 'student')

    // Create courses with tutors
    const coursesWithTutors = courses.map(course => ({
      ...course,
      tutor: course.slug.includes('data-structures') || course.slug.includes('ui-ux') ? aiTutor._id : mathTutor._id
    }))

    const createdCourses = await Course.insertMany(coursesWithTutors)
    console.log('📚 Created courses')

    // Create quizzes for each lesson
    for (const course of createdCourses) {
      const courseQuestions = quizQuestions[course.slug] || []

      for (const section of course.sections) {
        for (const lesson of section.lessons) {
          if (courseQuestions.length > 0) {
            const quiz = new Quiz({
              course: course._id,
              lesson: lesson._id,
              timeLimitSec: 600,
              attemptsAllowed: 2,
              questions: courseQuestions.slice(0, Math.min(5, courseQuestions.length))
            })
            await quiz.save()
          }
        }
      }
    }
    console.log('📝 Created quizzes')

    // Create discussion messages
    const discussionMessages = []
    const rooms = ['course-intro-data-structures', 'course-ui-ux-foundations', 'course-math-for-developers']

    for (const room of rooms) {
      for (let i = 0; i < 10; i++) {
        const randomUser = students[Math.floor(Math.random() * students.length)]
        const daysAgo = Math.floor(Math.random() * 7)
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)

        discussionMessages.push({
          room,
          user: randomUser._id,
          text: `This is discussion message ${i + 1} in ${room}. Great lesson!`,
          createdAt: date
        })
      }
    }

    await DiscussionMessage.insertMany(discussionMessages)
    console.log('💬 Created discussion messages')

    // Create certificates
    const certificates = []
    for (const student of students.slice(0, 3)) {
      for (const course of createdCourses.slice(0, 2)) {
        certificates.push({
          student: student._id,
          course: course._id,
          scorePct: Math.floor(Math.random() * 20) + 80, // 80-100%
          issuedAt: new Date(),
          verifyCode: `CWAY-${course.slug.toUpperCase().replace(/-/g, '')}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`,
          pdfUrl: `/certificates/${student._id}-${course._id}.pdf`
        })
      }
    }

    await Certificate.insertMany(certificates)
    console.log('🎓 Created certificates')

    // Create user badges
    const userBadges = []
    for (const student of students) {
      userBadges.push({
        user: student._id,
        badge: createdBadges.find(b => b.code === 'FIRST_QUIZ')._id,
        awardedAt: new Date()
      })

      if (Math.random() > 0.5) {
        userBadges.push({
          user: student._id,
          badge: createdBadges.find(b => b.code === 'CONSISTENT_7D')._id,
          awardedAt: new Date()
        })
      }
    }

    await UserBadge.insertMany(userBadges)
    console.log('🏅 Created user badges')

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📋 Demo Credentials:')
    console.log('Admin: admin@cway.ac / P@ssw0rd!')
    console.log('Tutor (AI): tutor.ai@cway.ac / P@ssw0rd!')
    console.log('Tutor (Math): tutor.math@cway.ac / P@ssw0rd!')
    console.log('Student (Ali): ali.student@cway.ac / P@ssw0rd!')
    console.log('Student (Rina): rina.student@cway.ac / P@ssw0rd!')
    console.log('Student (Dev): dev.student@cway.ac / P@ssw0rd!')

    // Close connection
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run seeder
seedDatabase().then(() => {
  console.log('🎉 Seeding process completed!')
  process.exit(0)
}).catch((error) => {
  console.error('💥 Seeding failed:', error)
  process.exit(1)
})