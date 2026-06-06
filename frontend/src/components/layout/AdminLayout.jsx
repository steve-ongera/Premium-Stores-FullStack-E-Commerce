import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
  { label: 'Products', to: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { label: 'Orders', to: '/admin/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { label: 'Customers', to: '/admin/customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Categories', to: '/admin/categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
  { label: 'Coupons', to: '/admin/coupons', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-ink-50 font-body">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 bg-ink-900 text-cream-200 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-ink-800">
          {!collapsed && (
            <Link to="/" className="font-display text-xl font-bold text-white">LUMA</Link>
          )}
          <button onClick={() => setCollapsed(v => !v)} className="p-1.5 text-ink-400 hover:text-white hover:bg-ink-800 transition-colors ml-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm transition-colors group
                 ${isActive ? 'bg-ember text-white' : 'text-ink-400 hover:bg-ink-800 hover:text-white'}`
              }
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-ink-800 p-3">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 flex-shrink-0 bg-ember flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-cream-100 truncate">{user?.name}</p>
                <p className="text-xs text-ink-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={logout} className="mt-2 w-full text-left text-xs text-ink-500 hover:text-cream-200 transition-colors px-1 py-1">
              Sign out →
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-ink-100 flex items-center justify-between px-6">
          <h1 className="font-display text-lg font-semibold text-ink-900">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-ink-500 hover:text-ink-900 transition-colors">
              ← View Store
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}