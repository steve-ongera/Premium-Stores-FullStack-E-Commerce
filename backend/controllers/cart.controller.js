const CartModel = require('../models/cart.model')
const ProductModel = require('../models/product.model')
const { validateCoupon } = require('../models/shared.model')
const { AppError } = require('../utils/helpers')
const { asyncHandler } = require('../middleware/errorHandler')

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cartId = await CartModel.getOrCreate(req.user.id)
  const items = await CartModel.getItems(cartId)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  res.json({ success: true, cartId, items, subtotal })
})

// POST /api/cart/items
const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body

  const product = await ProductModel.findById(productId)
  if (!product) throw new AppError('Product not found', 404)
  if (product.stock < quantity) throw new AppError(`Only ${product.stock} units available`, 400)

  const cartId = await CartModel.getOrCreate(req.user.id)
  const items = await CartModel.addItem(cartId, productId, quantity)

  res.status(201).json({ success: true, items })
})

// PUT /api/cart/items/:itemId
const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body
  const cartId = await CartModel.getOrCreate(req.user.id)
  const items = await CartModel.updateItem(cartId, req.params.itemId, quantity)
  res.json({ success: true, items })
})

// DELETE /api/cart/items/:itemId
const removeItem = asyncHandler(async (req, res) => {
  const cartId = await CartModel.getOrCreate(req.user.id)
  await CartModel.removeItem(cartId, req.params.itemId)
  const items = await CartModel.getItems(cartId)
  res.json({ success: true, items })
})

// DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  const cartId = await CartModel.getOrCreate(req.user.id)
  await CartModel.clearItems(cartId)
  res.json({ success: true, message: 'Cart cleared' })
})

// POST /api/cart/coupon
const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body
  const cartId = await CartModel.getOrCreate(req.user.id)
  const items = await CartModel.getItems(cartId)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const { valid, message, coupon } = await validateCoupon(code, subtotal)
  if (!valid) throw new AppError(message, 400)

  const discount = coupon.discount_type === 'percent'
    ? subtotal * (coupon.value / 100)
    : Math.min(parseFloat(coupon.value), subtotal)

  res.json({
    success: true,
    coupon: { id: coupon.id, code: coupon.code, type: coupon.discount_type, value: coupon.value },
    discount: parseFloat(discount.toFixed(2)),
  })
})

module.exports = { getCart, addItem, updateItem, removeItem, clearCart, applyCoupon }