import { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus } from '@/api/admin.api'
import { Badge, Spinner } from '@/components/ui/index'
import { toast } from 'react-hot-toast'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const statusVariant = {
  pending: 'warning', processing: 'ink', shipped: 'cream', delivered: 'success', cancelled: 'error',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [updating, setUpdating] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getAllOrders({ status: statusFilter || undefined })
      setOrders(data.orders || data)
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [statusFilter])

  const handleStatus = async (id, status) => {
    setUpdating(id)
    try {
      await updateOrderStatus(id, status)
      toast.success('Status updated')
      load()
    } catch { toast.error('Update failed') }
    finally { setUpdating(null) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-ink-900">Orders</h2>
          <p className="text-ink-400 text-sm">{orders.length} orders</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {['', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 text-xs font-medium border transition-colors
              ${statusFilter === s
                ? 'bg-ink-900 text-white border-ink-900'
                : 'border-ink-200 text-ink-500 hover:border-ink-900 hover:text-ink-900'}`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white border border-ink-100 card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50">
                  {['Order #', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Update'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs tracking-widest uppercase text-ink-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-ink-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-ink-600">#{order.id}</td>
                    <td className="px-5 py-3">
                      <p className="text-ink-900 font-medium">{order.customer_name}</p>
                      <p className="text-xs text-ink-400">{order.customer_email}</p>
                    </td>
                    <td className="px-5 py-3 text-ink-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-ink-700">{order.item_count}</td>
                    <td className="px-5 py-3 font-semibold text-ink-900">${parseFloat(order.total).toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={statusVariant[order.status] || 'cream'}>{order.status}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        disabled={updating === order.id}
                        value={order.status}
                        onChange={(e) => handleStatus(order.id, e.target.value)}
                        className="input py-1.5 text-xs max-w-[130px]"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-ink-400 text-sm">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}