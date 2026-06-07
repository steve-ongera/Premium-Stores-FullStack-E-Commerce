const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const ctrl = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth')
const { authLimiter } = require('../middleware/rateLimiter')
const validate = require('../middleware/validate')

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
]

const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name too short'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]

router.post('/register',        registerRules, validate, ctrl.register)
router.post('/login',  authLimiter, loginRules,    validate, ctrl.login)
router.post('/logout',          ctrl.logout)
router.get( '/me',    protect,  ctrl.getMe)
router.post('/refresh',         ctrl.refresh)
router.post('/forgot-password', body('email').isEmail(), validate, ctrl.forgotPassword)
router.post('/reset-password',
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }),
  validate, ctrl.resetPassword
)

module.exports = router