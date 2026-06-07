const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,                // max pool connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err)
})

/**
 * Execute a single query
 * @param {string} text  - SQL string
 * @param {any[]}  params - Parameterised values
 */
const query = (text, params) => pool.query(text, params)

/**
 * Get a client from the pool for transactions
 */
const getClient = () => pool.connect()

/**
 * Run a callback inside a transaction; rolls back on error.
 */
const withTransaction = async (callback) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

const testConnection = async () => {
  try {
    const { rows } = await query('SELECT NOW() AS now, current_database() AS db')
    console.log(`✅ PostgreSQL connected — DB: ${rows[0].db} at ${rows[0].now}`)
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message)
    process.exit(1)
  }
}

module.exports = { query, getClient, withTransaction, testConnection, pool }