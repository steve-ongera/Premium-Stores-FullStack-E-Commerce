const nodemailer = require('nodemailer')

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

const sendMail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter()
  return transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || 'LUMA Store'}" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    text,
  })
}

// ── Email templates ───────────────────────────────────────────────

const sendWelcomeEmail = (user) =>
  sendMail({
    to: user.email,
    subject: 'Welcome to LUMA 🎉',
    html: `
      <h2>Hi ${user.name},</h2>
      <p>Welcome to LUMA. Your account is ready.</p>
      <p><a href="${process.env.CLIENT_URL}/shop">Start Shopping →</a></p>
    `,
  })

const sendPasswordResetEmail = (user, resetToken) =>
  sendMail({
    to: user.email,
    subject: 'Reset your LUMA password',
    html: `
      <h2>Password Reset</h2>
      <p>Hi ${user.name}, click the link below to reset your password. Expires in 1 hour.</p>
      <p><a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}">Reset Password →</a></p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  })

const sendOrderConfirmationEmail = (user, order) =>
  sendMail({
    to: user.email,
    subject: `LUMA — Order #${order.id} confirmed`,
    html: `
      <h2>Order Confirmed!</h2>
      <p>Hi ${user.name}, we've received your order.</p>
      <p><strong>Order #${order.id}</strong> — Total: $${parseFloat(order.total).toFixed(2)}</p>
      <p><a href="${process.env.CLIENT_URL}/orders">View My Orders →</a></p>
    `,
  })

const sendShippingEmail = (user, order) =>
  sendMail({
    to: user.email,
    subject: `LUMA — Order #${order.id} has shipped!`,
    html: `
      <h2>Your order is on the way 🚚</h2>
      <p>Hi ${user.name}, order #${order.id} has been shipped.</p>
      ${order.tracking_number ? `<p>Tracking: <strong>${order.tracking_number}</strong></p>` : ''}
    `,
  })

module.exports = { sendMail, sendWelcomeEmail, sendPasswordResetEmail, sendOrderConfirmationEmail, sendShippingEmail }