import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import courseRoutes from './routes/courses.js'
import quizRoutes from './routes/quizzes.js'
import discussionRoutes from './routes/discussions.js'
import analyticsRoutes from './routes/analytics.js'
import certificateRoutes from './routes/certificates.js'
import aiRoutes from './routes/ai.js'
import { DiscussionMessage, Poll } from './models/index.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use('/media', express.static(path.join(__dirname, '../storage/media')))
app.use('/certificates', express.static(path.join(__dirname, '../storage/certificates')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/discussions', discussionRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/certificates', certificateRoutes)
app.use('/api/ai', aiRoutes)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cway-academy', {
    serverSelectionTimeoutMS: 10000, // 10 seconds for Atlas connection
    socketTimeoutMS: 45000,
    bufferCommands: false,
    maxPoolSize: 10, // Maintain up to 10 socket connections
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => {
    console.error('MongoDB Atlas connection error:', error)
    process.exit(1)
  })
  .catch((err) => console.error('MongoDB connection error:', err))

// Socket.IO events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join_room', (data) => {
    const { roomId } = data
    socket.join(roomId)
    console.log(`User ${socket.id} joined room ${roomId}`)
  })

  socket.on('new_message', async (data) => {
    try {
      const { roomId, text } = data
      const userId = socket.handshake.auth.userId // Would be set by auth middleware

      if (!userId) return

      const message = new DiscussionMessage({
        room: roomId,
        user: userId,
        text,
      })

      await message.save()
      await message.populate('user', 'name avatarUrl')

      io.to(roomId).emit('message', message)
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  })

  socket.on('typing', (data) => {
    const { roomId } = data
    socket.to(roomId).emit('user_typing', { userId: socket.id })
  })

  socket.on('live_poll_create', async (data) => {
    try {
      const { courseId, question, options } = data

      const poll = new Poll({
        course: courseId,
        question,
        options: options.map((opt, index) => ({
          key: String.fromCharCode(65 + index),
          text: opt,
        })),
      })

      await poll.save()
      io.to(`course-${courseId}`).emit('poll_created', poll)
    } catch (error) {
      console.error('Failed to create poll:', error)
    }
  })

  socket.on('live_poll_vote', async (data) => {
    try {
      const { pollId, optionKey } = data
      const poll = await Poll.findById(pollId)

      if (!poll || !poll.isOpen) return

      const currentCount = poll.counts.get(optionKey) || 0
      poll.counts.set(optionKey, currentCount + 1)

      await poll.save()

      // Send updated results to room
      const results = {}
      for (const [key, count] of poll.counts) {
        results[key] = count
      }

      io.to(`poll-${pollId}`).emit('poll_results', { pollId, results })
    } catch (error) {
      console.error('Failed to record vote:', error)
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})