import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '../models/index.js'

export const hashPassword = async (password) => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )

  return { accessToken, refreshToken }
}

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}

export const getUserFromToken = async (token) => {
  const decoded = verifyToken(token, process.env.JWT_SECRET)
  if (!decoded) return null

  const user = await User.findById(decoded.userId).select('-hash')
  return user
}