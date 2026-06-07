// ─── category.routes.js ───────────────────────────────────────────
const express = require('express')
const { protect } = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')
const ctrl = require('../controllers/combined.controller')

const categoryRouter = express.Router()
categoryRouter.get('/', ctrl.getCategories)
categoryRouter.post('/', protect, isAdmin, ctrl.createCategory)
categoryRouter.put('/:id', protect, isAdmin, ctrl.updateCategory)
categoryRouter.delete('/:id', protect, isAdmin, ctrl.deleteCategory)

// ─── cart.routes.js ───────────────────────────────────────────────
const cartRouter = express.Router()
const cartCtrl = require('../controllers/cart.controller')
cartRouter.use(protect)
cartRouter.get('/',                    cartCtrl.getCart)
cartRouter.post('/items',              cartCtrl.addItem)
cartRouter.put('/items/:itemId',       cartCtrl.updateItem)
cartRouter.delete('/items/:itemId',    cartCtrl.removeItem)
cartRouter.delete('/',                 cartCtrl.clearCart)
cartRouter.post('/coupon',             cartCtrl.applyCoupon)

// ─── order.routes.js ─────────────────────────────────────────────
const orderRouter = express.Router()
const orderCtrl = require('../controllers/order.controller')
orderRouter.use(protect)
orderRouter.post('/',              orderCtrl.createOrder)
orderRouter.get('/',               orderCtrl.getOrders)
orderRouter.get('/:id',            orderCtrl.getOrder)
orderRouter.put('/:id/cancel',     orderCtrl.cancelOrder)

// ─── review.routes.js ────────────────────────────────────────────
const reviewRouter = express.Router({ mergeParams: true })
reviewRouter.get('/',       ctrl.getReviews)
reviewRouter.post('/',      protect, ctrl.createReview)
reviewRouter.put('/:id',    protect, ctrl.updateReview)
reviewRouter.delete('/:id', protect, ctrl.deleteReview)

// ─── user.routes.js ──────────────────────────────────────────────
const userRouter = express.Router()
const { uploadAvatar } = require('../config/cloudinary')
userRouter.put('/me',          protect, uploadAvatar.single('avatar'), ctrl.updateMe)
userRouter.put('/me/password', protect, ctrl.changePassword)

// ─── coupon.routes.js ────────────────────────────────────────────
const couponRouter = express.Router()
couponRouter.get('/',     protect, isAdmin, ctrl.getCoupons)
couponRouter.post('/',    protect, isAdmin, ctrl.createCoupon)
couponRouter.delete('/:id', protect, isAdmin, ctrl.deleteCoupon)

// ─── payment.routes.js ───────────────────────────────────────────
const paymentRouter = express.Router()
const payCtrl = require('../controllers/payment.controller')
paymentRouter.post('/webhook',        payCtrl.stripeWebhook)   // raw body — no auth
paymentRouter.post('/create-intent',  protect, payCtrl.createPaymentIntent)
paymentRouter.post('/refund',         protect, isAdmin, payCtrl.createRefund)

// ─── admin.routes.js ─────────────────────────────────────────────
const adminRouter = express.Router()
adminRouter.use(protect, isAdmin)
adminRouter.get('/dashboard',         ctrl.getDashboard)
adminRouter.get('/orders',            ctrl.getAllOrders)
adminRouter.put('/orders/:id/status', ctrl.updateOrderStatus)
adminRouter.get('/customers',         ctrl.getAllCustomers)

module.exports = {
  categoryRouter,
  cartRouter,
  orderRouter,
  reviewRouter,
  userRouter,
  couponRouter,
  paymentRouter,
  adminRouter,
}