import { createSlice } from '@reduxjs/toolkit'

const loadCart = () => {
  try {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : { items: [], coupon: null }
  } catch {
    return { items: [], coupon: null }
  }
}

const saveCart = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify({ items: state.items, coupon: state.coupon }))
  } catch {}
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...loadCart(),
    isOpen: false,
  },
  reducers: {
    addItem(state, { payload }) {
      const existing = state.items.find((i) => i.id === payload.id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + (payload.quantity || 1), payload.stock || 99)
      } else {
        state.items.push({ ...payload, quantity: payload.quantity || 1 })
      }
      saveCart(state)
    },
    removeItem(state, { payload }) {
      state.items = state.items.filter((i) => i.id !== payload)
      saveCart(state)
    },
    updateQuantity(state, { payload: { id, quantity } }) {
      const item = state.items.find((i) => i.id === id)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id)
        } else {
          item.quantity = quantity
        }
      }
      saveCart(state)
    },
    clearCart(state) {
      state.items = []
      state.coupon = null
      localStorage.removeItem('cart')
    },
    applyCoupon(state, { payload }) {
      state.coupon = payload
      saveCart(state)
    },
    removeCoupon(state) {
      state.coupon = null
      saveCart(state)
    },
    openCart(state) { state.isOpen = true },
    closeCart(state) { state.isOpen = false },
    toggleCart(state) { state.isOpen = !state.isOpen },
  },
})

// Selectors
export const selectCartItems = (s) => s.cart.items
export const selectCartCount = (s) => s.cart.items.reduce((acc, i) => acc + i.quantity, 0)
export const selectCartSubtotal = (s) => s.cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0)
export const selectCartIsOpen = (s) => s.cart.isOpen
export const selectCoupon = (s) => s.cart.coupon

export const {
  addItem, removeItem, updateQuantity, clearCart,
  applyCoupon, removeCoupon, openCart, closeCart, toggleCart,
} = cartSlice.actions

export default cartSlice.reducer