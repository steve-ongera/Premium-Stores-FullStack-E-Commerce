/**
 * Must be used after protect middleware.
 * Restricts route to admin role only.
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden — admin access required' })
  }
  next()
}

module.exports = isAdmin