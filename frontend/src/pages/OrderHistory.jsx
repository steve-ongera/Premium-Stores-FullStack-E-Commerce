import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders } from '@/store/orderSlice'
import { cancelOrder } from '@/api/order.api'
import { Badge, Spinner } from '@/components/ui/index'
import { toast } from 'react-hot-toast'

const statusVariant = {
  pending: 'warning',
  processing: 'ink',
  shipped: 'cream',
  delivered: 'success',
  cancelled: 'error',
}

export default function OrderHistory() {
  const dispatch = useDispatch()
  const { list: orders, loading } = useSelector((s) => s.orders)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [])

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id)
      dispatch(fetchOrders())
      toast.success('Order cancelled')
    } catch {
      toast.error('Cannot cancel this order')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>
  )

  return (
    <div className="page-enter">
      <div className="container-app py-10">
        <h1 className="font-display text-5xl text-ink-900 mb-10">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <p className="font-display text-2xl text-ink-900">No orders yet</p>
            <p className="text-ink-400 text-sm">Your order history will appear here</p>
            <Link to="/shop" className="text-sm text-ember hover:underline mt-2">Start shopping →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-ink-100 p-6 card">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-sm font-semibold text-ink-900">#{order.id}</p>
                      <Badge variant={statusVariant[order.status] || 'cream'}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-ink-400 mt-1">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ink-900">${parseFloat(order.total).toFixed(2)}</p>
                    <p className="text-xs text-ink-400">{order.item_count} item{order.item_count !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Items preview */}
                {order.items?.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-t border-ink-50">
                    <div className="w-10 h-12 bg-ink-100 flex-shrink-0">
                      {item.image && <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink-800 truncate">{item.product_name}</p>
                      <p className="text-xs text-ink-400">Qty: {item.quantity} · ${item.unit_price}</p>
                    </div>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <p className="text-xs text-ink-400 pt-2">+{order.items.length - 3} more items</p>
                )}

                <div className="flex gap-3 mt-4 pt-4 border-t border-ink-100">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors underline"
                    >
                      Cancel Order
                    </button>
                  )}
                  <span className="flex-1" />
                  <Link
                    to={`/order-success/${order.id}`}
                    className="text-xs text-ink-500 hover:text-ember transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}