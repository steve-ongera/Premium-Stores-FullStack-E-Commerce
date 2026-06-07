const jwt = require('jsonwebtoken')

const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' })

const signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' })

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET)

const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET)

/**
 * Signs both tokens and returns them.
 * Sets refresh token as httpOnly cookie.
 */
const issueTokens = (res, user) => {
  const payload = { id: user.id, role: user.role }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  return accessToken
}

const clearTokenCookie = (res) => {
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) })
}

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, issueTokens, clearTokenCookie }