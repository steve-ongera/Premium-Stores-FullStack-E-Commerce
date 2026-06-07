const SharedModel = require('../models/shared.model')
const CategoryModel = require('../models/category.model')
const UserModel = require('../models/user.model')
const OrderModel = require('../models/order.model')
const ProductModel = require('../models/product.model')
const { query } = require('../config/db')
const bcrypt = require('bcryptjs')
const { slugify, AppError } = require('../utils/helpers')
const { paginate, paginationMeta } = require('../utils/pagination')
const { asyncHandler } = require('../middleware/errorHandler')

// ─── Reviews ──────────────────────────────────────────────────────

const getReviews = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query)
  const { productId } = req.params
  const reviews = await SharedModel.getByProduct(productId, { limit, offset })
  const total = await SharedModel.countByProduct(productId)
  res.json({ success: true, reviews, pagination: paginationMeta(total, page, limit) })
})

const createReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body
  const { productId } = req.params
  const existing = await SharedModel.findUserReview(req.user.id, productId)
  if (existing) throw new AppError('You have already reviewed this product', 409)
  const review = await SharedModel.createReview({ userId: req.user.id, productId, rating, title, comment })
  res.status(201).json({ success: true, review })
})

const updateReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body
  const review = await SharedModel.updateReview(req.params.id, { rating, title, comment })
  res.json({ success: true, review })
})

const deleteReview = asyncHandler(async (req, res) => {
  await SharedModel.deleteReview(req.params.id, req.user.id)
  res.json({ success: true, message: 'Review deleted' })
})

// ─── Categories ───────────────────────────────────────────────────

const getCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryModel.getAll()
  res.json({ success: true, categories })
})

const createCategory = asyncHandler(async (req, res) => {
  const { name, parent_id, image_url } = req.body
  const slug = slugify(name)
  const existing = await CategoryModel.findBySlug(slug)
  if (existing) throw new AppError('Category already exists', 409)
  const category = await CategoryModel.create({ name, slug, parent_id, image_url })
  res.status(201).json({ success: true, category })
})

const updateCategory = asyncHandler(async (req, res) => {
  const existing = await CategoryModel.findById(req.params.id)
  if (!existing) throw new AppError('Category not found', 404)
  const { name, parent_id, image_url } = req.body
  const slug = name ? slugify(name) : existing.slug
  const category = await CategoryModel.update(req.params.id, { name: name || existing.name, slug, parent_id, image_url })
  res.json({ success: true, category })
})

const deleteCategory = asyncHandler(async (req, res) => {
  await CategoryModel.remove(req.params.id)
  res.json({ success: true, message: 'Category deleted' })
})

// ─── Users / Profile ──────────────────────────────────────────────

const updateMe = asyncHandler(async (req, res) => {
  const { name, email } = req.body
  const fields = {}
  if (name) fields.name = name
  if (email) fields.email = email
  if (req.file) fields.avatar = req.file.path
  const user = await UserModel.update(req.user.id, fields)
  res.json({ success: true, user })
})

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await UserModel.findByEmail(req.user.email)
  const valid = await bcrypt.compare(currentPassword, user.password_hash)
  if (!valid) throw new AppError('Current password is incorrect', 401)
  const passwordHash = await bcrypt.hash(newPassword, 12)
  await UserModel.update(req.user.id, { password_hash: passwordHash })
  res.json({ success: true, message: 'Password changed' })
})

// ─── Coupons ──────────────────────────────────────────────────────

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await SharedModel.getAllCoupons()
  res.json({ success: true, coupons })
})

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await SharedModel.createCoupon(req.body)
  res.status(201).json({ success: true, coupon })
})

const deleteCoupon = asyncHandler(async (req, res) => {
  await SharedModel.deleteCoupon(req.params.id)
  res.json({ success: true, message: 'Coupon deleted' })
})

// ─── Admin ────────────────────────────────────────────────────────

const getDashboard = asyncHandler(async (req, res) => {
  const [revenueRes, ordersRes, customersRes, productsRes, recentOrders, weeklyRevenue, categoryBreakdown] = await Promise.all([
    query(`SELECT COALESCE(SUM(total), 0) AS revenue, COUNT(*) AS orders FROM orders WHERE status != 'cancelled' AND created_at > NOW() - INTERVAL '30 days'`),
    query(`SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '7 days'`),
    query('SELECT COUNT(*) FROM users'),
    query('SELECT COUNT(*) FROM products WHERE is_active = true'),
    query(`
      SELECT o.id, u.name AS customer_name, o.total, o.status, o.created_at
      FROM orders o JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC LIMIT 10
    `),
    query(`
      SELECT TO_CHAR(gs.day, 'Dy') AS date,
             COALESCE(SUM(o.total), 0) AS revenue,
             COUNT(o.id)::int AS orders
      FROM generate_series(NOW()::date - 6, NOW()::date, INTERVAL '1 day') AS gs(day)
      LEFT JOIN orders o ON DATE(o.created_at) = gs.day AND o.status != 'cancelled'
      GROUP BY gs.day ORDER BY gs.day
    `),
    query(`
      SELECT c.name, COUNT(oi.id)::int AS value
      FROM categories c
      JOIN products p ON p.category_id = c.id
      JOIN order_items oi ON oi.product_id = p.id
      GROUP BY c.name ORDER BY value DESC LIMIT 5
    `),
  ])

  res.json({
    success: true,
    stats: {
      revenue: parseFloat(revenueRes.rows[0].revenue),
      orders: parseInt(ordersRes.rows[0].count, 10),
      customers: parseInt(customersRes.rows[0].count, 10),
      products: parseInt(productsRes.rows[0].count, 10),
    },
    recentOrders: recentOrders.rows,
    salesChart: weeklyRevenue.rows,
    categoryBreakdown: categoryBreakdown.rows,
  })
})

const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query)
  const { status } = req.query
  const orders = await OrderModel.getAll({ status, limit, offset })
  const total = await OrderModel.countAll(status)
  res.json({ success: true, orders, pagination: paginationMeta(total, page, limit) })
})

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const order = await OrderModel.updateStatus(req.params.id, status)
  if (!order) throw new AppError('Order not found', 404)
  res.json({ success: true, order })
})

const getAllCustomers = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query)
  const { search } = req.query
  const customers = await UserModel.getAllWithStats({ search, limit, offset })
  const total = await UserModel.countAll(search)
  res.json({ success: true, customers, pagination: paginationMeta(total, page, limit) })
})

module.exports = {
  getReviews, createReview, updateReview, deleteReview,
  getCategories, createCategory, updateCategory, deleteCategory,
  updateMe, changePassword,
  getCoupons, createCoupon, deleteCoupon,
  getDashboard, getAllOrders, updateOrderStatus, getAllCustomers,
}