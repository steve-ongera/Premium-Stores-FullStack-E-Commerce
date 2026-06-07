const { query } = require('../config/db')

const ORDER_SELECT = `
  SELECT
    o.*,
    u.name AS customer_name, u.email AS customer_email,
    json_agg(
      json_build_object(
        'id', oi.id, 'product_id', oi.product_id,
        'product_name', oi.product_name, 'product_image', oi.product_image,
        'unit_price', oi.unit_price, 'quantity', oi.quantity, 'total', oi.total
      ) ORDER BY oi.id
    ) AS items,
    COUNT(oi.id)::int AS item_count
  FROM orders o
  JOIN users u ON u.id = o.user_id
  LEFT JOIN order_items oi ON oi.order_id = o.id
`

const findById = (id) =>
  query(`${ORDER_SELECT} WHERE o.id = $1 GROUP BY o.id, u.name, u.email`, [id])
    .then((r) => r.rows[0])

const findByUser = (userId) =>
  query(`${ORDER_SELECT} WHERE o.user_id = $1 GROUP BY o.id, u.name, u.email ORDER BY o.created_at DESC`, [userId])
    .then((r) => r.rows)

const getAll = ({ status, limit = 20, offset = 0 }) => {
  const where = status ? `WHERE o.status = '${status}'` : ''
  return query(
    `${ORDER_SELECT} ${where} GROUP BY o.id, u.name, u.email ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  ).then((r) => r.rows)
}

const countAll = (status) => {
  const where = status ? `WHERE status = '${status}'` : ''
  return query(`SELECT COUNT(*) FROM orders ${where}`).then((r) => parseInt(r.rows[0].count, 10))
}

const create = (client, { userId, subtotal, discount, shippingCost, total, couponCode, shippingAddress, notes }) =>
  client.query(
    `INSERT INTO orders (user_id, subtotal, discount, shipping_cost, total, coupon_code, shipping_address, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [userId, subtotal, discount || 0, shippingCost || 0, total, couponCode || null, JSON.stringify(shippingAddress), notes || null]
  ).then((r) => r.rows[0])

const createItem = (client, { orderId, productId, productName, productImage, sku, unitPrice, quantity }) =>
  client.query(
    `INSERT INTO order_items (order_id, product_id, product_name, product_image, sku, unit_price, quantity)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [orderId, productId, productName, productImage, sku, unitPrice, quantity]
  )

const updateStatus = (id, status) =>
  query(
    'UPDATE orders SET status = $2 WHERE id = $1 RETURNING *',
    [id, status]
  ).then((r) => r.rows[0])

const updatePaymentStatus = (id, paymentStatus) =>
  query(
    'UPDATE orders SET payment_status = $2 WHERE id = $1 RETURNING *',
    [id, paymentStatus]
  ).then((r) => r.rows[0])

module.exports = { findById, findByUser, getAll, countAll, create, createItem, updateStatus, updatePaymentStatus }