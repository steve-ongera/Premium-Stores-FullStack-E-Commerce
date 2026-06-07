const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const UserModel = require('../models/user.model')
const { issueTokens, verifyRefreshToken, clearTokenCookie, signAccessToken } = require('../utils/jwt')
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/email')
const { AppError } = require('../utils/helpers')
const { asyncHandler } = require('../middleware/errorHandler')

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existing = await UserModel.findByEmail(email)
  if (existing) throw new AppError('Email already registered', 409)

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await UserModel.create({ name, email, passwordHash })

  const token = issueTokens(res, user)

  sendWelcomeEmail(user).catch(() => {})  // fire and forget

  res.status(201).json({ success: true, token, user })
})

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await UserModel.findByEmail(email)
  if (!user) throw new AppError('Invalid email or password', 401)

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) throw new AppError('Invalid email or password', 401)

  const token = issueTokens(res, user)

  res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  })
})

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res)
  res.json({ success: true, message: 'Logged out' })
})

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.id)
  if (!user) throw new AppError('User not found', 404)
  res.json({ success: true, user })
})

// POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken
  if (!token) throw new AppError('No refresh token', 401)

  const decoded = verifyRefreshToken(token)
  const user = await UserModel.findById(decoded.id)
  if (!user) throw new AppError('User not found', 401)

  const accessToken = signAccessToken({ id: user.id, role: user.role })
  res.json({ success: true, token: accessToken })
})

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  const resetToken = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  const user = await UserModel.setResetToken(email, resetToken, expiry)
  if (user) {
    const fullUser = await UserModel.findById(user.id)
    sendPasswordResetEmail(fullUser, resetToken).catch(() => {})
  }

  // Always respond 200 to avoid email enumeration
  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' })
})

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body

  const user = await UserModel.findByResetToken(token)
  if (!user) throw new AppError('Invalid or expired reset token', 400)

  const passwordHash = await bcrypt.hash(password, 12)
  await UserModel.clearResetToken(user.id, passwordHash)

  res.json({ success: true, message: 'Password reset successfully' })
})

module.exports = { register, login, logout, getMe, refresh, forgotPassword, resetPassword }