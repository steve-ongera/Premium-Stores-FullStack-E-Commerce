const ProductModel = require('../models/product.model')
const { query } = require('../config/db')
const { cloudinary } = require('../config/cloudinary')
const { slugify, AppError } = require('../utils/helpers')
const { paginate, paginationMeta } = require('../utils/pagination')
const { asyncHandler } = require('../middleware/errorHandler')

// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req.query)
  const { category, search, sort, minPrice, maxPrice } = req.query

  const { products, total } = await ProductModel.getAll({ category, search, sort, minPrice, maxPrice, limit, offset })

  res.json({
    success: true,
    products,
    pagination: paginationMeta(total, page, limit),
  })
})

// GET /api/products/featured
const getFeatured = asyncHandler(async (req, res) => {
  const products = await ProductModel.getFeatured(8)
  res.json({ success: true, products })
})

// GET /api/products/search
const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query
  if (!q?.trim()) return res.json({ success: true, products: [] })

  const { page, limit, offset } = paginate(req.query)
  const { products, total } = await ProductModel.getAll({ search: q.trim(), limit, offset })

  res.json({ success: true, products, pagination: paginationMeta(total, page, limit) })
})

// GET /api/products/:slug
const getProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findBySlug(req.params.slug)
  if (!product) throw new AppError('Product not found', 404)
  res.json({ success: true, product })
})

// GET /api/products/:id/related
const getRelated = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id)
  if (!product) throw new AppError('Product not found', 404)
  const products = await ProductModel.getRelated(product.id, product.category_id)
  res.json({ success: true, products })
})

// POST /api/products (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, compare_price, cost_price, sku, stock, category_id, is_featured, weight, tags } = req.body

  if (!name || !price) throw new AppError('Name and price are required', 400)

  const slug = slugify(name)
  const product = await ProductModel.create({
    name, slug, description, price, compare_price, cost_price, sku, stock, category_id, is_featured, weight,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : null,
  })

  // Handle uploaded images
  if (req.files?.length) {
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i]
      await query(
        'INSERT INTO product_images (product_id, url, public_id, is_primary, sort_order) VALUES ($1,$2,$3,$4,$5)',
        [product.id, file.path, file.filename, i === 0, i]
      )
    }
  }

  const full = await ProductModel.findById(product.id)
  res.status(201).json({ success: true, product: full })
})

// PUT /api/products/:id (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const existing = await ProductModel.findById(id)
  if (!existing) throw new AppError('Product not found', 404)

  const fields = {}
  const allowed = ['name', 'description', 'price', 'compare_price', 'cost_price', 'sku', 'stock', 'category_id', 'is_featured', 'weight', 'is_active']
  allowed.forEach((k) => { if (req.body[k] !== undefined) fields[k] = req.body[k] })
  if (req.body.name && req.body.name !== existing.name) fields.slug = slugify(req.body.name)

  const product = await ProductModel.update(id, fields)

  // Add new images if uploaded
  if (req.files?.length) {
    const { rows: existing_images } = await query('SELECT COUNT(*) FROM product_images WHERE product_id = $1', [id])
    const startOrder = parseInt(existing_images[0].count, 10)
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i]
      await query(
        'INSERT INTO product_images (product_id, url, public_id, is_primary, sort_order) VALUES ($1,$2,$3,$4,$5)',
        [id, file.path, file.filename, false, startOrder + i]
      )
    }
  }

  const full = await ProductModel.findById(product.id)
  res.json({ success: true, product: full })
})

// DELETE /api/products/:id (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id)
  if (!product) throw new AppError('Product not found', 404)

  // Delete Cloudinary images
  const { rows: images } = await query('SELECT public_id FROM product_images WHERE product_id = $1', [req.params.id])
  await Promise.all(images.filter((i) => i.public_id).map((i) => cloudinary.uploader.destroy(i.public_id).catch(() => {})))

  await ProductModel.remove(req.params.id)
  res.json({ success: true, message: 'Product deleted' })
})

module.exports = { getProducts, getFeatured, searchProducts, getProduct, getRelated, createProduct, updateProduct, deleteProduct }