import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import {
  addItem, removeItem, updateQuantity, clearCart,
  applyCoupon, removeCoupon, openCart, closeCart, toggleCart,
  selectCartItems, selectCartCount, selectCartSubtotal, selectCartIsOpen, selectCoupon,
} from '@/store/cartSlice'

export function useCart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const subtotal = useSelector(selectCartSubtotal)
  const isOpen = useSelector(selectCartIsOpen)
  const coupon = useSelector(selectCoupon)

  const discount = coupon
    ? coupon.type === 'percent'
      ? subtotal * (coupon.value / 100)
      : Math.min(coupon.value, subtotal)
    : 0
  const total = Math.max(0, subtotal - discount)

  const handleAdd = (product, qty = 1) => {
    dispatch(addItem({ ...product, quantity: qty }))
    toast.success(`${product.name} added to cart`)
    dispatch(openCart())
  }

  const handleRemove = (id) => {
    dispatch(removeItem(id))
    toast('Item removed', { icon: '🗑️' })
  }

  const handleUpdateQty = (id, quantity) => dispatch(updateQuantity({ id, quantity }))
  const handleClear = () => dispatch(clearCart())
  const handleApplyCoupon = (c) => dispatch(applyCoupon(c))
  const handleRemoveCoupon = () => dispatch(removeCoupon())

  return {
    items,
    count,
    subtotal,
    discount,
    total,
    coupon,
    isOpen,
    addItem: handleAdd,
    removeItem: handleRemove,
    updateQuantity: handleUpdateQty,
    clearCart: handleClear,
    applyCoupon: handleApplyCoupon,
    removeCoupon: handleRemoveCoupon,
    openCart: () => dispatch(openCart()),
    closeCart: () => dispatch(closeCart()),
    toggleCart: () => dispatch(toggleCart()),
  }
}