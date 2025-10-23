import Joi from 'joi'
import { getUserFromToken } from '../utils/auth.js'

// Authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' })
    }

    const token = authHeader.substring(7)
    const user = await getUserFromToken(token)

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' })
  }
}

// Role-based access control middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
      return res.status(400).json({ error: 'Validation failed', details: errors })
    }
    next()
  }
}

// Common validation schemas
export const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('student', 'tutor', 'admin').default('student'),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  course: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).required(),
    category: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().min(0),
    published: Joi.boolean().default(false),
  }),

  quiz: Joi.object({
    course: Joi.string().hex().length(24).required(),
    lesson: Joi.string().hex().length(24).required(),
    timeLimitSec: Joi.number().min(60).max(3600).default(600),
    attemptsAllowed: Joi.number().min(1).max(10).default(1),
    questions: Joi.array().items(
      Joi.object({
        type: Joi.string().valid('MCQ', 'MAQ', 'TF').required(),
        prompt: Joi.string().min(5).max(500).required(),
        options: Joi.array().items(
          Joi.object({
            key: Joi.string().length(1).required(),
            text: Joi.string().min(1).max(200).required(),
          })
        ).min(2).max(6).required(),
        answerKeys: Joi.array().items(Joi.string().length(1)).min(1).required(),
        points: Joi.number().min(1).max(10).default(1),
      })
    ).min(1).max(50).required(),
  }),

  attempt: Joi.object({
    answers: Joi.array().items(
      Joi.object({
        qid: Joi.string().required(),
        selectedKeys: Joi.array().items(Joi.string().length(1)).required(),
      })
    ).required(),
  }),
}