import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import { hashPassword, comparePassword, generateTokens } from '../utils/auth.js'
import { authenticate, validate, schemas } from '../middleware/auth.js'

const router = express.Router()

// Register
router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Hash password and create user
    const hash = await hashPassword(password)
    const user = new User({ name, email, hash, role })
    await user.save()

    // Generate tokens
    const tokens = generateTokens(user._id)

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      ...tokens,
    })
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login
router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.hash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate tokens
    const tokens = generateTokens(user._id)

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      ...tokens,
    })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
})

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    const tokens = generateTokens(user._id)
    res.json(tokens)
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
})

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatarUrl: req.user.avatarUrl,
    },
  })
})

// Update profile
router.patch('/me', authenticate, async (req, res) => {
  try {
    const { name, avatarUrl } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatarUrl },
      { new: true, select: '-hash' }
    )
    res.json({ user })
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed' })
  }
})

// Forgot password (mock implementation)
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // In a real app, send email with reset token
    // For demo, just log to console
    console.log(`Password reset requested for ${email}`)
    console.log(`Reset link: http://localhost:5173/reset-password?token=mock-token-${user._id}`)

    res.json({ message: 'Password reset email sent' })
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' })
  }
})

// Reset password (mock implementation)
router.post('/reset', async (req, res) => {
  try {
    const { token, password } = req.body

    // In a real app, verify token and update password
    // For demo, just accept any token
    if (!token.startsWith('mock-token-')) {
      return res.status(400).json({ error: 'Invalid reset token' })
    }

    const userId = token.replace('mock-token-', '')
    const hash = await hashPassword(password)
    await User.findByIdAndUpdate(userId, { hash })

    res.json({ message: 'Password reset successful' })
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' })
  }
})

export default router