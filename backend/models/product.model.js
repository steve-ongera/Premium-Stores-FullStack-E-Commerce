const { query } = require('../config/db')

const BASE_SELECT = `
  SELECT
    p.*,
    c.name AS category_name,
    c.slug AS category_slug,
    COALESCE(AVG(r.rating), 0)::NUMERIC(3,1) AS rating,
    COUNT(DISTINCT r.id)::int AS review_count,
    (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) AS image,
    (SELECT json_agg(pi ORDER BY pi.sort_order)
     FROM (SELECT id, url, public_id, is_primary, sort_order FROM product_images WHERE product_id = p.id) pi
    ) AS images
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN reviews r ON r.product_id = p.id
`

const buildFilters = (params) => {
  const conditions = ['p.is_active = true']
  const values = []
  let idx = 1

  if (params.category) {
    conditions.push(`c.slug = $${idx++}`)
    values.push(params.category)
  }
  if (params.search) {
    conditions.push(`p.search_vector @@ plainto_tsquery('english', $${idx++})`)
    values.push(params.search)
  }
  if (params.minPrice) {
    conditions.push(`p.price >= $${idx++}`)
    values.push(params.minPrice)
  }
  if (params.maxPrice) {
    conditions.push(`p.price <= $${idx++}`)
    values.push(params.maxPrice)
  }

  return { where: conditions.join(' AND '), values, nextIdx: idx }
}

const SORT_MAP = {
  newest:     'p.created_at DESC',
  oldest:     'p.created_at ASC',
  price_asc:  'p.price ASC',
  price_desc: 'p.price DESC',
  popular:    'review_count DESC',
  rating:     'rating DESC',
  sale:       'p.compare_price DESC NULLS LAST',
}

const getAll = async ({ category, search, sort, minPrice, maxPrice, limit = 12, offset = 0 }) => {
  const { where, values, nextIdx } = buildFilters({ category, search, minPrice, maxPrice })
  const orderBy = SORT_MAP[sort] || SORT_MAP.newest

  const countRes = await query(
    `SELECT COUNT(DISTINCT p.id) FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE ${where}`,
    values
  )

  const rows = await query(
    `${BASE_SELECT} WHERE ${where} GROUP BY p.id, c.name, c.slug ORDER BY ${orderBy} LIMIT $${nextIdx} OFFSET $${nextIdx + 1}`,
    [...values, limit, offset]
  )

  return { products: rows.rows, total: parseInt(countRes.rows[0].count, 10) }
}

const findBySlug = (slug) =>
  query(
    `${BASE_SELECT} WHERE p.slug = $1 AND p.is_active = true GROUP BY p.id, c.name, c.slug`,
    [slug]
  ).then((r) => r.rows[0])

const findById = (id) =>
  query(
    `${BASE_SELECT} WHERE p.id = $1 GROUP BY p.id, c.name, c.slug`,
    [id]
  ).then((r) => r.rows[0])

const getFeatured = (limit = 8) =>
  query(
    `${BASE_SELECT} WHERE p.is_featured = true AND p.is_active = true GROUP BY p.id, c.name, c.slug ORDER BY p.created_at DESC LIMIT $1`,
    [limit]
  ).then((r) => r.rows)

const getRelated = (productId, categoryId, limit = 4) =>
  query(
    `${BASE_SELECT} WHERE p.category_id = $2 AND p.id != $1 AND p.is_active = true GROUP BY p.id, c.name, c.slug ORDER BY RANDOM() LIMIT $3`,
    [productId, categoryId, limit]
  ).then((r) => r.rows)

const create = (data) => {
  const { name, slug, description, price, compare_price, cost_price, sku, stock, category_id, is_featured, weight, tags } = data
  return query(
    `INSERT INTO products (name, slug, description, price, compare_price, cost_price, sku, stock, category_id, is_featured, weight, tags)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [name, slug, description, price, compare_price, cost_price, sku, stock || 0, category_id, is_featured || false, weight, tags]
  ).then((r) => r.rows[0])
}

const update = (id, fields) => {
  const keys = Object.keys(fields)
  const values = Object.values(fields)
  const set = keys.map((k, i) => `${k} = $${i + 2}`).join(', ')
  return query(
    `UPDATE products SET ${set} WHERE id = $1 RETURNING *`,
    [id, ...values]
  ).then((r) => r.rows[0])
}

const remove = (id) => query('DELETE FROM products WHERE id = $1', [id])

const decrementStock = (client, productId, qty) =>
  client.query(
    'UPDATE products SET stock = stock - $2 WHERE id = $1 AND stock >= $2 RETURNING stock',
    [productId, qty]
  )

module.exports = { getAll, findBySlug, findById, getFeatured, getRelated, create, update, remove, decrementStock }