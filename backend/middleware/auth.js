const jwt = require('jsonwebtoken')
const { query } = require('../config/db')

/**
 * Verify JWT and attach user to req.user
 */
const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies?.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated — token missing' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { rows } = await query(
      'SELECT id, name, email, role, avatar FROM users WHERE id = $1',
      [decoded.id]
    )

    if (!rows[0]) {
      return res.status(401).json({ success: false, message: 'User no longer exists' })
    }

    req.user = rows[0]
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' })
    }
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

/**
 * Optional auth — attaches user if token present but doesn't block
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const { rows } = await query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id])
      if (rows[0]) req.user = rows[0]
    }
  } catch {
    // silently ignore — user stays unauthenticated
  }
  next()
}

module.exports = { protect, optionalAuth }