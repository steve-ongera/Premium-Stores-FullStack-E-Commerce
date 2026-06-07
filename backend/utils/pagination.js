/**
 * Build SQL LIMIT/OFFSET from page & limit query params.
 * Returns { limit, offset, page } — safe, clamped values.
 */
const paginate = (query) => {
  const page  = Math.max(1, parseInt(query.page,  10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 12))
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

/**
 * Build the pagination meta object returned to clients.
 */
const paginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  pages: Math.ceil(total / limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrev: page > 1,
})

module.exports = { paginate, paginationMeta }