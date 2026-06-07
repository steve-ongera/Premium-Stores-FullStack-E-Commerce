import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '@/api/admin.api'
import { Spinner, Badge } from '@/components/ui/index'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'

const statusVariant = {
  pending: 'warning', processing: 'ink', shipped: 'cream', delivered: 'success', cancelled: 'error',
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  )

  // Fallback demo data
  const stats = data?.stats || {
    revenue: 48320, orders: 284, customers: 1203, products: 412,
    revenueChange: 12.5, ordersChange: 8.2, customersChange: 5.1, productsChange: 3.0,
  }

  const salesData = data?.salesChart || Array.from({ length: 7 }, (_, i) => ({
    date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    revenue: Math.floor(Math.random() * 8000 + 2000),
    orders: Math.floor(Math.random() * 40 + 10),
  }))

  const categoryData = data?.categoryBreakdown || [
    { name: 'Men', value: 35 },
    { name: 'Women', value: 45 },
    { name: 'Accessories', value: 20 },
  ]

  const recentOrders = data?.recentOrders || []

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.revenue?.toLocaleString()}`, change: stats.revenueChange, icon: '💰' },
    { label: 'Orders', value: stats.orders?.toLocaleString(), change: stats.ordersChange, icon: '📦' },
    { label: 'Customers', value: stats.customers?.toLocaleString(), change: stats.customersChange, icon: '👥' },
    { label: 'Products', value: stats.products?.toLocaleString(), change: stats.productsChange, icon: '🏷️' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl text-ink-900">Dashboard</h2>
        <p className="text-ink-400 text-sm mt-1">Welcome back — here's what's happening today.</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border border-ink-100 p-5 card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-ink-400 tracking-widest uppercase">{s.label}</p>
                <p className="font-display text-3xl font-bold text-ink-900 mt-1">{s.value}</p>
              </div>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <span className={`text-xs font-medium ${s.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {s.change >= 0 ? '↑' : '↓'} {Math.abs(s.change)}%
              </span>
              <span className="text-xs text-ink-400">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue area chart */}
        <div className="xl:col-span-2 bg-white border border-ink-100 p-6 card">
          <h3 className="font-semibold text-ink-900 mb-4">Revenue This Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8490F" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#E8490F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDEA" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#A0A0A0' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#A0A0A0' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip
                contentStyle={{ fontFamily: 'Outfit', fontSize: 13, border: '1px solid #E8E8E8', borderRadius: 0 }}
                formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#E8490F" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="bg-white border border-ink-100 p-6 card">
          <h3 className="font-semibold text-ink-900 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDEA" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#A0A0A0' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#484848' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{ fontFamily: 'Outfit', fontSize: 13, border: '1px solid #E8E8E8', borderRadius: 0 }}
                formatter={(v) => [`${v}%`, 'Share']}
              />
              <Bar dataKey="value" fill="#0D0D0D" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Recent orders ── */}
      <div className="bg-white border border-ink-100 card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <h3 className="font-semibold text-ink-900">Recent Orders</h3>
          <Link to="/admin/orders" className="text-xs text-ember hover:underline">View all →</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-ink-400 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100">
                  {['Order', 'Customer', 'Date', 'Total', 'Status'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs tracking-widest uppercase text-ink-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-ink-50 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-ink-600">#{order.id}</td>
                    <td className="px-6 py-3 text-ink-800">{order.customer_name}</td>
                    <td className="px-6 py-3 text-ink-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-3 font-semibold text-ink-900">${parseFloat(order.total).toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <Badge variant={statusVariant[order.status] || 'cream'}>{order.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}