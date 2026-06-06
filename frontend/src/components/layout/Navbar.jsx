import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import CartDrawer from '@/components/cart/CartDrawer'

const categories = [
  { label: 'New Arrivals', to: '/shop?sort=newest' },
  { label: 'Men', to: '/shop/men' },
  { label: 'Women', to: '/shop/women' },
  { label: 'Accessories', to: '/shop/accessories' },
  { label: 'Sale', to: '/shop?sort=sale' },
]

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { count, toggleCart } = useCart()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <>
      {/* ── Announcement bar ── */}
      <div className="bg-ink-900 text-cream-100 text-xs text-center py-2 font-body tracking-widest uppercase">
        Free shipping on orders over $150 &nbsp;·&nbsp; Use code <strong>WELCOME10</strong> for 10% off
      </div>

      {/* ── Main nav ── */}
      <header className={`sticky top-0 z-40 bg-cream transition-all duration-300 ${scrolled ? 'shadow-md' : 'border-b border-ink-100'}`}>
        <div className="container-app">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="font-display text-2xl font-bold tracking-tight text-ink-900 flex-shrink-0">
              LUMA
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-8">
              {categories.map((c) => (
                <NavLink
                  key={c.label}
                  to={c.to}
                  className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors tracking-wide relative group"
                >
                  {c.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-ember transition-all duration-300 group-hover:w-full" />
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-icon text-ink-600 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="btn-icon text-ink-600 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                  aria-label="Account"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-ink-100 shadow-card-hover animate-scale-in z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-ink-100">
                          <p className="text-xs text-ink-400 tracking-widest uppercase">Signed in as</p>
                          <p className="text-sm font-medium text-ink-900 truncate">{user?.name}</p>
                        </div>
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">Profile</Link>
                        <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">My Orders</Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-ember font-medium hover:bg-ink-50 transition-colors">Admin Panel</Link>
                        )}
                        <div className="border-t border-ink-100 mt-1">
                          <button onClick={() => { logout(); setUserMenuOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm text-ink-500 hover:bg-ink-50 transition-colors">Sign out</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setUserMenuOpen(false)} className="flex px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">Sign in</Link>
                        <Link to="/register" onClick={() => setUserMenuOpen(false)} className="flex px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition-colors">Create account</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="btn-icon relative text-ink-600 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                aria-label="Cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-ember text-white text-[10px] font-bold rounded-full">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden btn-icon text-ink-600 hover:bg-ink-100 transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-ink-100 bg-cream animate-fade-in">
            <nav className="container-app py-4 flex flex-col gap-1">
              {categories.map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-2 py-2.5 text-sm font-medium text-ink-700 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-ink-900/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in">
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSearch} className="flex gap-0">
              <input
                ref={searchRef}
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="flex-1 px-6 py-4 text-lg bg-white text-ink-900 placeholder-ink-400 focus:outline-none border-2 border-white"
              />
              <button type="submit" className="px-6 py-4 bg-ember text-white hover:bg-ember-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            <button onClick={() => setSearchOpen(false)} className="mt-4 text-cream-200 text-sm hover:text-white transition-colors">
              Press Esc to close
            </button>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      <CartDrawer />
    </>
  )
}