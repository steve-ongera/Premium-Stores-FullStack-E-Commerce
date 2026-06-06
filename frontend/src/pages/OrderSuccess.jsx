import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrder } from '@/store/orderSlice'
import { Spinner, Badge } from '@/components/ui/index'
import Button from '@/components/ui/Button'

export default function OrderSuccess() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { current: order, loading } = useSelector((s) => s.orders)

  useEffect(() => {
    dispatch(fetchOrder(id))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream page-enter">
      <div className="w-full max-w-lg px-4 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-ink-900 flex items-center justify-center mx-auto mb-6"
             style={{ boxShadow: '4px 4px 0 #E8490F' }}>
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display text-5xl text-ink-900">Order Placed!</h1>
        <p className="text-ink-500 mt-3 text-sm leading-relaxed">
          Thank you for your purchase. We'll send you a confirmation email shortly.
        </p>

        {order && (
          <div className="bg-white border border-ink-100 mt-8 p-6 text-left"
               style={{ boxShadow: '4px 4px 0 #0D0D0D' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-ink-400 tracking-widest uppercase">Order</p>
                <p className="font-mono text-sm font-medium text-ink-900">#{order.id}</p>
              </div>
              <Badge variant="warning">Processing</Badge>
            </div>

            <div className="divide-y divide-ink-100">
              {order.items?.map((item) => (
                <div key={item.id} className="flex justify-between py-3 text-sm">
                  <span className="text-ink-700">{item.product_name} <span className="text-ink-400">× {item.quantity}</span></span>
                  <span className="font-medium">${(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-ink-200 mt-4 pt-4 flex justify-between font-bold text-ink-900">
              <span>Total</span>
              <span>${parseFloat(order.total).toFixed(2)}</span>
            </div>

            {order.shipping_address && (
              <div className="mt-4 pt-4 border-t border-ink-100">
                <p className="text-xs text-ink-400 tracking-widest uppercase mb-1">Ships to</p>
                <p className="text-sm text-ink-700">
                  {order.shipping_address.name}, {order.shipping_address.address}, {order.shipping_address.city}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 mt-8 justify-center">
          <Link to="/orders">
            <Button variant="outline">View My Orders</Button>
          </Link>
          <Link to="/shop">
            <Button variant="brutal">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}