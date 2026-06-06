import { Link } from 'react-router-dom'

const links = {
  Shop: [
    { label: 'New Arrivals', to: '/shop?sort=newest' },
    { label: 'Men', to: '/shop/men' },
    { label: 'Women', to: '/shop/women' },
    { label: 'Accessories', to: '/shop/accessories' },
    { label: 'Sale', to: '/shop?sort=sale' },
  ],
  Account: [
    { label: 'Sign In', to: '/login' },
    { label: 'Create Account', to: '/register' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Profile', to: '/profile' },
  ],
  Info: [
    { label: 'About Us', to: '#' },
    { label: 'Shipping & Returns', to: '#' },
    { label: 'Size Guide', to: '#' },
    { label: 'Contact', to: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-cream-200">
      {/* Main */}
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display text-3xl font-bold text-white tracking-tight">
              LUMA
            </Link>
            <p className="mt-4 text-sm text-ink-300 leading-relaxed max-w-xs">
              Curated essentials for a considered life. Every piece chosen with intention, built to last.
            </p>
            <div className="flex gap-3 mt-6">
              {['instagram', 'twitter', 'facebook'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 flex items-center justify-center border border-ink-700 text-ink-400 hover:border-cream-300 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-xs tracking-widest uppercase font-semibold text-cream-300 mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm text-ink-400 hover:text-cream-200 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 pt-12 border-t border-ink-800">
          <div className="flex flex-col md:flex-row md:items-end gap-8 justify-between">
            <div>
              <h3 className="font-display text-2xl text-white">Stay in the loop</h3>
              <p className="text-ink-400 text-sm mt-1">New arrivals, exclusive offers — straight to your inbox.</p>
            </div>
            <form className="flex gap-0 max-w-sm w-full" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-ink-800 text-cream-100 placeholder-ink-500 border border-ink-700 text-sm focus:outline-none focus:border-cream-300 transition-colors"
              />
              <button type="submit" className="px-5 py-3 bg-ember text-white text-sm font-medium hover:bg-ember-600 transition-colors flex-shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-800">
        <div className="container-app py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-500">© {new Date().getFullYear()} LUMA. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-ink-500 hover:text-ink-400 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-ink-500 hover:text-ink-400 transition-colors">Terms</a>
            <a href="#" className="text-xs text-ink-500 hover:text-ink-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}