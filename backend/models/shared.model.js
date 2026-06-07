const { query } = require('../config/db')

// ─── Reviews ──────────────────────────────────────────────────────
const getByProduct = (productId, { limit = 10, offset = 0 } = {}) =>
  query(`
    SELECT r.*, u.name AS user_name, u.avatar AS user_avatar
    FROM reviews r
    JOIN users u ON u.id = r.user_id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC LIMIT $2 OFFSET $3
  `, [productId, limit, offset]).then((r) => r.rows)

const countByProduct = (productId) =>
  query('SELECT COUNT(*) FROM reviews WHERE product_id = $1', [productId])
    .then((r) => parseInt(r.rows[0].count, 10))

const findUserReview = (userId, productId) =>
  query('SELECT * FROM reviews WHERE user_id = $1 AND product_id = $2', [userId, productId])
    .then((r) => r.rows[0])

const createReview = ({ userId, productId, rating, title, comment }) =>
  query(
    'INSERT INTO reviews (user_id, product_id, rating, title, comment) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [userId, productId, rating, title || null, comment || null]
  ).then((r) => r.rows[0])

const updateReview = (id, { rating, title, comment }) =>
  query(
    'UPDATE reviews SET rating=$2, title=$3, comment=$4 WHERE id=$1 RETURNING *',
    [id, rating, title, comment]
  ).then((r) => r.rows[0])

const deleteReview = (id, userId) =>
  query('DELETE FROM reviews WHERE id=$1 AND user_id=$2', [id, userId])

// ─── Coupons ──────────────────────────────────────────────────────
const findCoupon = (code) =>
  query('SELECT * FROM coupons WHERE code = $1 AND is_active = true', [code]).then((r) => r.rows[0])

const validateCoupon = async (code, orderSubtotal) => {
  const coupon = await findCoupon(code)
  if (!coupon) return { valid: false, message: 'Coupon not found or inactive' }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return { valid: false, message: 'Coupon expired' }
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return { valid: false, message: 'Coupon usage limit reached' }
  if (coupon.min_order && orderSubtotal < coupon.min_order) return { valid: false, message: `Minimum order $${coupon.min_order} required` }
  return { valid: true, coupon }
}

const incrementCouponUsage = (id) =>
  query('UPDATE coupons SET used_count = used_count + 1 WHERE id = $1', [id])

const getAllCoupons = () =>
  query('SELECT * FROM coupons ORDER BY created_at DESC').then((r) => r.rows)

const createCoupon = ({ code, discount_type, value, min_order, max_uses, expires_at }) =>
  query(
    'INSERT INTO coupons (code, discount_type, value, min_order, max_uses, expires_at) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [code.toUpperCase(), discount_type, value, min_order || 0, max_uses || null, expires_at || null]
  ).then((r) => r.rows[0])

const deleteCoupon = (id) => query('DELETE FROM coupons WHERE id = $1', [id])

// ─── Payments ─────────────────────────────────────────────────────
const createPayment = ({ orderId, provider, amount, currency, transactionId, providerData }) =>
  query(
    'INSERT INTO payments (order_id, provider, amount, currency, transaction_id, provider_data) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [orderId, provider, amount, currency || 'USD', transactionId || null, providerData ? JSON.stringify(providerData) : null]
  ).then((r) => r.rows[0])

const updatePayment = (id, { status, transactionId, providerData }) =>
  query(
    'UPDATE payments SET status=$2, transaction_id=$3, provider_data=$4 WHERE id=$1 RETURNING *',
    [id, status, transactionId, providerData ? JSON.stringify(providerData) : null]
  ).then((r) => r.rows[0])

const findPaymentByTransaction = (transactionId) =>
  query('SELECT * FROM payments WHERE transaction_id = $1', [transactionId]).then((r) => r.rows[0])

module.exports = {
  getByProduct, countByProduct, findUserReview, createReview, updateReview, deleteReview,
  findCoupon, validateCoupon, incrementCouponUsage, getAllCoupons, createCoupon, deleteCoupon,
  createPayment, updatePayment, findPaymentByTransaction,
}