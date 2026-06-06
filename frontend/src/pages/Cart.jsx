import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { applyCoupon as applyCouponApi } from '@/api/cart.api'
import CartItem from '@/components/cart/CartItem'
import Button from '@/components/ui/Button'
import { toast } from 'react-hot-toast'

export default function Cart() {
  const { items, subtotal, discount, total, coupon, applyCoupon, removeCoupon, clearCart } = useCart()
  const [code, setCode] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const fmt = (n) => `$${n.toFixed(2)}`

  const handleApply = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setApplyingCoupon(true)
    try {
      const data = await applyCouponApi(code.trim().toUpperCase())
      applyCoupon(data.coupon)
      toast.success('Coupon applied!')
      setCode('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon')
    } finally {
      setApplyingCoupon(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 page-enter">
        <div className="w-24 h-24 flex items-center justify-center bg-ink-100 text-ink-300">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="font-display text-3xl text-ink-900">Your cart is empty</h2>
          <p className="text-ink-400 mt-2 text-sm">Add something beautiful to get started</p>
        </div>
        <Link to="/shop">
          <Button variant="brutal">Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <div className="container-app py-10">
        <h1 className="font-display text-5xl text-ink-900 mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="divide-y divide-ink-100 border border-ink-100 bg-white">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <button onClick={clearCart} className="mt-4 text-xs text-ink-400 hover:text-ember transition-colors underline">
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-ink-100 p-6 sticky top-24"
                 style={{ boxShadow: '4px 4px 0 #E8490F' }}>
              <h2 className="font-display text-2xl text-ink-900 mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-ink-600">
                  <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({coupon.code})</span>
                    <span>−{fmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink-400">
                  <span>Shipping</span>
                  <span>{subtotal >= 150 ? 'Free 🎉' : 'TBD'}</span>
                </div>
                <div className="border-t border-ink-100 pt-3 flex justify-between font-semibold text-ink-900 text-base">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>

              {/* Coupon */}
              {!coupon ? (
                <form onSubmit={handleApply} className="flex gap-0 mt-6">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="COUPON CODE"
                    className="flex-1 input py-2 text-xs tracking-widest placeholder-ink-300"
                  />
                  <button type="submit" disabled={applyingCoupon}
                          className="px-4 py-2 bg-ink-900 text-white text-xs font-medium hover:bg-ink-700 transition-colors">
                    Apply
                  </button>
                </form>
              ) : (
                <div className="mt-4 flex items-center justify-between text-xs bg-green-50 border border-green-200 px-3 py-2">
                  <span className="text-green-700 font-medium">✓ {coupon.code} applied</span>
                  <button onClick={removeCoupon} className="text-ink-400 hover:text-ember">Remove</button>
                </div>
              )}

              <Link to="/checkout">
                <Button variant="brutal" className="w-full mt-6">Proceed to Checkout →</Button>
              </Link>

              <Link to="/shop" className="block text-center text-xs text-ink-400 hover:text-ink-700 mt-3 transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}