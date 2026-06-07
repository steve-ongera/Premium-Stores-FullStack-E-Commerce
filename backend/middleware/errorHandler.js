/**
 * Central error handler — last middleware in the chain.
 * Formats all thrown errors into consistent JSON responses.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500
  let message = err.message || 'Internal Server Error'

  // Log non-operational errors
  if (statusCode === 500) {
    console.error(`[ERROR] ${req.method} ${req.path}`, err)
  }

  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    statusCode = 409
    const field = err.detail?.match(/\((.+?)\)/)?.[1] || 'field'
    message = `Duplicate value: ${field} already exists`
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    statusCode = 400
    message = 'Referenced resource does not exist'
  }

  // PostgreSQL not null violation
  if (err.code === '23502') {
    statusCode = 400
    const field = err.column || 'field'
    message = `Missing required field: ${field}`
  }

  // JWT errors (caught in middleware but just in case)
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400
    message = 'File too large'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

/**
 * Wrap async route handlers to forward errors to errorHandler.
 * Usage: router.get('/path', asyncHandler(myAsyncFn))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = errorHandler
module.exports.asyncHandler = asyncHandler