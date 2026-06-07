const slugifyLib = require('slugify')

const slugify = (text) =>
  slugifyLib(text, { lower: true, strict: true, trim: true })

/**
 * Operational error with HTTP status code.
 * Thrown from controllers/services and handled by errorHandler.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = { slugify, AppError }