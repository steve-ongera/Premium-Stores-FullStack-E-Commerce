const { query } = require('../config/db')

const getAll = () =>
  query(`
    SELECT c.*, COUNT(p.id)::int AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
    GROUP BY c.id ORDER BY c.name
  `).then((r) => r.rows)

const findById = (id) =>
  query('SELECT * FROM categories WHERE id = $1', [id]).then((r) => r.rows[0])

const findBySlug = (slug) =>
  query('SELECT * FROM categories WHERE slug = $1', [slug]).then((r) => r.rows[0])

const create = ({ name, slug, parent_id, image_url }) =>
  query(
    'INSERT INTO categories (name, slug, parent_id, image_url) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, slug, parent_id || null, image_url || null]
  ).then((r) => r.rows[0])

const update = (id, { name, slug, parent_id, image_url }) =>
  query(
    'UPDATE categories SET name=$2, slug=$3, parent_id=$4, image_url=$5 WHERE id=$1 RETURNING *',
    [id, name, slug, parent_id || null, image_url || null]
  ).then((r) => r.rows[0])

const remove = (id) => query('DELETE FROM categories WHERE id = $1', [id])

module.exports = { getAll, findById, findBySlug, create, update, remove }