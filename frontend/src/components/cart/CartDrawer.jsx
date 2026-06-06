import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import CartItem from './CartItem'
import Button from '@/components/ui/Button'

export default function CartDrawer() {
  const { items, count, subtotal, discount, total, coupon, isOpen, closeCart } = useCart()

  const fmt = (n) => `$${n.toFixed(2)}`

  return createPortal(
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-cream flex flex-col
                       transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]
                       ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
           style={{ boxShadow: isOpen ? '-8px 0 40px rgba(0,0,0,0.15)' : 'none' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-semibold">Your Cart</h2>
            {count > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-ink-900 text-white text-xs font-bold rounded-full">
                {count}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-ink-100 transition-colors text-ink-500 hover:text-ink-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <div className="w-20 h-20 flex items-center justify-center bg-ink-100 text-ink-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="font-display text-lg text-ink-900">Your cart is empty</p>
                <p className="text-sm text-ink-400 mt-1">Discover something you'll love</p>
              </div>
              <Button onClick={closeCart} variant="outline" size="sm">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-ink-100">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer totals + CTA */}
        {items.length > 0 && (
          <div className="border-t border-ink-100 px-6 py-5 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-ink-600">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon ({coupon?.code})</span>
                  <span>−{fmt(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-ink-400">
                <span>Shipping</span>
                <span>{subtotal >= 150 ? 'Free' : 'Calculated at checkout'}</span>
              </div>
              <div className="flex justify-between font-semibold text-ink-900 pt-2 border-t border-ink-100">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
            </div>

            <Link to="/checkout" onClick={closeCart}>
              <Button variant="brutal" className="w-full">
                Checkout →
              </Button>
            </Link>
            <button onClick={closeCart} className="w-full mt-2 text-xs text-center text-ink-400 hover:text-ink-700 transition-colors py-1">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  )
}