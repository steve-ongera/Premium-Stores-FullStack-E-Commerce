require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const { testConnection } = require('./config/db')
const errorHandler = require('./middleware/errorHandler')
const { globalLimiter } = require('./middleware/rateLimiter')

// Route imports
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const productRoutes = require('./routes/product.routes')
const categoryRoutes = require('./routes/category.routes')
const cartRoutes = require('./routes/cart.routes')
const orderRoutes = require('./routes/order.routes')
const reviewRoutes = require('./routes/review.routes')
const paymentRoutes = require('./routes/payment.routes')
const couponRoutes = require('./routes/coupon.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()
const PORT = process.env.PORT || 5000

// ── Security & parsing middleware ─────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(compression())
app.use(cookieParser())

// Stripe webhook needs raw body — register before json parser
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Logging ───────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// ── Rate limiting ─────────────────────────────────────────────────
app.use('/api', globalLimiter)

// ── Health check ──────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
})

// ── API routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/admin', adminRoutes)

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` })
})

// ── Global error handler ──────────────────────────────────────────
app.use(errorHandler)

// ── Start server ──────────────────────────────────────────────────
const start = async () => {
  await testConnection()
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`)
    console.log(`   Env:    ${process.env.NODE_ENV}`)
    console.log(`   API:    http://localhost:${PORT}/api`)
    console.log(`   Health: http://localhost:${PORT}/health\n`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})