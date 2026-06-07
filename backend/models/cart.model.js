const { query } = require('../config/db')

const CART_SELECT = `
  SELECT
    ci.id, ci.quantity,
    p.id AS product_id, p.name, p.slug, p.price, p.stock,
    p.compare_price,
    (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) AS image
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  WHERE ci.cart_id = $1
  ORDER BY ci.created_at
`

const getOrCreate = async (userId) => {
  let { rows } = await query('SELECT id FROM carts WHERE user_id = $1', [userId])
  if (!rows[0]) {
    const res = await query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId])
    rows = res.rows
  }
  return rows[0].id
}

const getItems = (cartId) => query(CART_SELECT, [cartId]).then((r) => r.rows)

const addItem = async (cartId, productId, quantity) => {
  await query(`
    INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)
    ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + $3
  `, [cartId, productId, quantity])
  return getItems(cartId)
}

const updateItem = async (cartId, itemId, quantity) => {
  if (quantity <= 0) {
    await query('DELETE FROM cart_items WHERE id = $1 AND cart_id = $2', [itemId, cartId])
  } else {
    await query('UPDATE cart_items SET quantity = $3 WHERE id = $1 AND cart_id = $2', [itemId, cartId, quantity])
  }
  return getItems(cartId)
}

const removeItem = (cartId, itemId) =>
  query('DELETE FROM cart_items WHERE id = $1 AND cart_id = $2', [itemId, cartId])

const clearItems = (cartId) =>
  query('DELETE FROM cart_items WHERE cart_id = $1', [cartId])

const getItemCount = (userId) =>
  query(`
    SELECT COALESCE(SUM(ci.quantity), 0)::int AS count
    FROM carts c
    JOIN cart_items ci ON ci.cart_id = c.id
    WHERE c.user_id = $1
  `, [userId]).then((r) => r.rows[0]?.count || 0)

module.exports = { getOrCreate, getItems, addItem, updateItem, removeItem, clearItems, getItemCount }