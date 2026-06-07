const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const OrderModel = require('../models/order.model')
const { createPayment, updatePayment, findPaymentByTransaction } = require('../models/shared.model')
const { AppError } = require('../utils/helpers')
const { asyncHandler } = require('../middleware/errorHandler')

// POST /api/payments/create-intent
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body
  const order = await OrderModel.findById(orderId)
  if (!order) throw new AppError('Order not found', 404)
  if (order.user_id !== req.user.id) throw new AppError('Forbidden', 403)
  if (order.payment_status === 'paid') throw new AppError('Order already paid', 400)

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(parseFloat(order.total) * 100), // cents
    currency: 'usd',
    metadata: { orderId: order.id.toString(), userId: req.user.id.toString() },
    automatic_payment_methods: { enabled: true },
  })

  await createPayment({
    orderId: order.id,
    provider: 'stripe',
    amount: order.total,
    currency: 'USD',
    transactionId: intent.id,
    providerData: { clientSecret: intent.client_secret },
  })

  res.json({ success: true, clientSecret: intent.client_secret, paymentIntentId: intent.id })
})

// POST /api/payments/webhook (raw body, no auth)
const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Stripe webhook signature failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object
        const { orderId } = intent.metadata

        await OrderModel.updateStatus(orderId, 'processing')
        await OrderModel.updatePaymentStatus(orderId, 'paid')

        const payment = await findPaymentByTransaction(intent.id)
        if (payment) await updatePayment(payment.id, { status: 'paid', transactionId: intent.id })
        break
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object
        const payment = await findPaymentByTransaction(intent.id)
        if (payment) await updatePayment(payment.id, { status: 'failed', transactionId: intent.id })
        break
      }
      case 'charge.refunded': {
        const charge = event.data.object
        const orderId = charge.metadata?.orderId
        if (orderId) {
          await OrderModel.updateStatus(orderId, 'refunded')
          await OrderModel.updatePaymentStatus(orderId, 'refunded')
        }
        break
      }
    }
    res.json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
}

// POST /api/payments/refund (admin)
const createRefund = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body
  const order = await OrderModel.findById(orderId)
  if (!order) throw new AppError('Order not found', 404)

  const payment = await findPaymentByTransaction(order.id)
  if (!payment?.transaction_id) throw new AppError('No payment found for this order', 404)

  const refundParams = { payment_intent: payment.transaction_id }
  if (amount) refundParams.amount = Math.round(amount * 100)

  const refund = await stripe.refunds.create(refundParams)
  res.json({ success: true, refund })
})

module.exports = { createPaymentIntent, stripeWebhook, createRefund }