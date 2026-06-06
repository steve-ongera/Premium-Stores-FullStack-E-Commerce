import api from './axiosInstance'

// ── Cart ─────────────────────────────────────────────────────────
export const getCart = () => api.get('/cart')
export const addToCart = (productId, quantity) => api.post('/cart/items', { productId, quantity })
export const updateCartItem = (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity })
export const removeCartItem = (itemId) => api.delete(`/cart/items/${itemId}`)
export const clearCart = () => api.delete('/cart')
export const applyCoupon = (code) => api.post('/cart/coupon', { code })