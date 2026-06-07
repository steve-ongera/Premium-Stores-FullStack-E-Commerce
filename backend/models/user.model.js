const { query } = require('../config/db')

const findByEmail = (email) =>
  query('SELECT * FROM users WHERE email = $1', [email]).then((r) => r.rows[0])

const findById = (id) =>
  query('SELECT id, name, email, role, avatar, created_at FROM users WHERE id = $1', [id])
    .then((r) => r.rows[0])

const create = ({ name, email, passwordHash }) =>
  query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at',
    [name, email, passwordHash]
  ).then((r) => r.rows[0])

const update = (id, fields) => {
  const keys = Object.keys(fields)
  const values = Object.values(fields)
  const set = keys.map((k, i) => `${k} = $${i + 2}`).join(', ')
  return query(
    `UPDATE users SET ${set} WHERE id = $1 RETURNING id, name, email, role, avatar`,
    [id, ...values]
  ).then((r) => r.rows[0])
}

const setResetToken = (email, token, expiry) =>
  query(
    'UPDATE users SET reset_token = $2, reset_token_expiry = $3 WHERE email = $1 RETURNING id',
    [email, token, expiry]
  ).then((r) => r.rows[0])

const findByResetToken = (token) =>
  query(
    'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
    [token]
  ).then((r) => r.rows[0])

const clearResetToken = (id, passwordHash) =>
  query(
    'UPDATE users SET password_hash = $2, reset_token = NULL, reset_token_expiry = NULL WHERE id = $1',
    [id, passwordHash]
  )

const getAllWithStats = ({ search, limit, offset }) => {
  const where = search ? `WHERE u.name ILIKE $3 OR u.email ILIKE $3` : ''
  const params = search
    ? [limit, offset, `%${search}%`]
    : [limit, offset]

  return query(`
    SELECT
      u.id, u.name, u.email, u.role, u.avatar, u.created_at,
      COUNT(DISTINCT o.id)::int AS order_count,
      COALESCE(SUM(o.total), 0) AS total_spent
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id AND o.status != 'cancelled'
    ${where}
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT $1 OFFSET $2
  `, params).then((r) => r.rows)
}

const countAll = (search) => {
  if (search) {
    return query('SELECT COUNT(*) FROM users WHERE name ILIKE $1 OR email ILIKE $1', [`%${search}%`])
      .then((r) => parseInt(r.rows[0].count, 10))
  }
  return query('SELECT COUNT(*) FROM users').then((r) => parseInt(r.rows[0].count, 10))
}

module.exports = { findByEmail, findById, create, update, setResetToken, findByResetToken, clearResetToken, getAllWithStats, countAll }