const OrderModel = require('../models/order.model')
const ProductModel = require('../models/product.model')
const CartModel = require('../models/cart.model')
const { validateCoupon, incrementCouponUsage } = require('../models/shared.model')
const { withTransaction } = require('../config/db')
const { sendOrderConfirmationEmail } = require('../utils/email')
const { AppError } = require('../utils/helpers')
const { asyncHandler } = require('../middleware/errorHandler')
const UserModel = require('../models/user.model')

// POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, couponCode, notes } = req.body

  if (!items?.length) throw new AppError('Order must have at least one item', 400)
  if (!shippingAddress) throw new AppError('Shipping address is required', 400)

  const order = await withTransaction(async (client) => {
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await ProductModel.findById(item.productId)
      if (!product) throw new AppError(`Product ${item.productId} not found`, 404)
      if (product.stock < item.quantity) throw new AppError(`Insufficient stock for ${product.name}`, 400)

      // Decrement stock atomically
      const stockResult = await ProductModel.decrementStock(client, product.id, item.quantity)
      if (!stockResult.rows[0]) throw new AppError(`Insufficient stock for ${product.name}`, 400)

      const lineTotal = product.price * item.quantity
      subtotal += lineTotal
      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        sku: product.sku,
        unitPrice: product.price,
        quantity: item.quantity,
      })
    }

    // Apply coupon
    let discount = 0
    let validCoupon = null
    if (couponCode) {
      const result = await validateCoupon(couponCode, subtotal)
      if (!result.valid) throw new AppError(result.message, 400)
      validCoupon = result.coupon
      discount = result.coupon.discount_type === 'percent'
        ? subtotal * (result.coupon.value / 100)
        : Math.min(parseFloat(result.coupon.value), subtotal)
    }

    const shippingCost = subtotal - discount >= 150 ? 0 : 9.99
    const total = Math.max(0, subtotal - discount) + shippingCost

    const newOrder = await OrderModel.create(client, {
      userId: req.user.id,
      subtotal,
      discount,
      shippingCost,
      total,
      couponCode: validCoupon?.code,
      shippingAddress,
      notes,
    })

    for (const item of orderItems) {
      await OrderModel.createItem(client, { orderId: newOrder.id, ...item })
    }

    if (validCoupon) await incrementCouponUsage(validCoupon.id)

    // Clear cart
    const cartId = await CartModel.getOrCreate(req.user.id)
    await CartModel.clearItems(cartId)

    return newOrder
  })

  const fullOrder = await OrderModel.findById(order.id)

  // Fire confirmation email
  const user = await UserModel.findById(req.user.id)
  sendOrderConfirmationEmail(user, fullOrder).catch(() => {})

  res.status(201).json({ success: true, order: fullOrder })
})

// GET /api/orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.findByUser(req.user.id)
  res.json({ success: true, orders })
})

// GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id)
  if (!order) throw new AppError('Order not found', 404)
  if (order.user_id !== req.user.id && req.user.role !== 'admin') throw new AppError('Forbidden', 403)
  res.json({ success: true, order })
})

// PUT /api/orders/:id/cancel
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id)
  if (!order) throw new AppError('Order not found', 404)
  if (order.user_id !== req.user.id) throw new AppError('Forbidden', 403)
  if (!['pending', 'processing'].includes(order.status)) throw new AppError('Cannot cancel this order', 400)

  const updated = await OrderModel.updateStatus(req.params.id, 'cancelled')
  res.json({ success: true, order: updated })
})

module.exports = { createOrder, getOrders, getOrder, cancelOrder }