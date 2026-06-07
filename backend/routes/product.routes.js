const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/product.controller')
const { protect } = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')
const { uploadProduct } = require('../config/cloudinary')
const { uploadLimiter } = require('../middleware/rateLimiter')

router.get('/',          ctrl.getProducts)
router.get('/featured',  ctrl.getFeatured)
router.get('/search',    ctrl.searchProducts)
router.get('/:slug',     ctrl.getProduct)
router.get('/:id/related', ctrl.getRelated)

// Admin only
router.post('/',    protect, isAdmin, uploadLimiter, uploadProduct.array('images', 6), ctrl.createProduct)
router.put('/:id',  protect, isAdmin, uploadLimiter, uploadProduct.array('images', 6), ctrl.updateProduct)
router.delete('/:id', protect, isAdmin, ctrl.deleteProduct)

module.exports = router

// Review subroutes
const reviewRouter = require('./review.routes')
router.use('/:productId/reviews', reviewRouter)