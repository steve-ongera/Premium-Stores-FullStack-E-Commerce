import { useEffect, useState } from 'react'
import { getAllCustomers } from '@/api/admin.api'
import { Badge, Spinner } from '@/components/ui/index'
import Input from '@/components/ui/Input'
import { toast } from 'react-hot-toast'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAllCustomers()
      .then((data) => setCustomers(data.customers || data))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-ink-900">Customers</h2>
        <p className="text-ink-400 text-sm">{customers.length} registered</p>
      </div>

      <div className="max-w-xs">
        <Input placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-white border border-ink-100 card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50">
                  {['Customer', 'Email', 'Joined', 'Orders', 'Spent', 'Role'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs tracking-widest uppercase text-ink-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-ink-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0 bg-ember flex items-center justify-center text-white text-xs font-bold">
                          {c.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-ink-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-500">{c.email}</td>
                    <td className="px-5 py-3 text-ink-500 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-ink-700">{c.order_count || 0}</td>
                    <td className="px-5 py-3 font-semibold text-ink-900">${(c.total_spent || 0).toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <Badge variant={c.role === 'admin' ? 'ember' : 'cream'}>{c.role}</Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-ink-400 text-sm">No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}