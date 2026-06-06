import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFeatured } from '@/api/product.api'
import ProductCard from '@/components/product/ProductCard'
import Button from '@/components/ui/Button'

const categories = [
  { label: 'Men', to: '/shop/men', bg: 'bg-ink-800' },
  { label: 'Women', to: '/shop/women', bg: 'bg-cream-300' },
  { label: 'Accessories', to: '/shop/accessories', bg: 'bg-ember' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    getFeatured().then(setFeatured).catch(() => {})
  }, [])

  return (
    <div className="page-enter">
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center bg-ink-900 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'radial-gradient(circle at 60% 50%, #E8490F 0%, transparent 60%)' }} />
        <div className="absolute inset-0 opacity-5"
             style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(245,240,232,0.3) 40px, rgba(245,240,232,0.3) 41px)' }} />

        <div className="container-app relative z-10">
          <div className="max-w-3xl stagger">
            <p className="text-xs tracking-[0.4em] uppercase text-ember font-medium mb-6">
              New Season — SS 2026
            </p>
            <h1 className="font-display text-6xl md:text-8xl font-bold text-white leading-[0.9] tracking-tight">
              Wear What<br />
              <em className="not-italic text-cream-300">Matters.</em>
            </h1>
            <p className="mt-8 text-lg text-ink-300 max-w-md leading-relaxed">
              Curated essentials designed for a considered life — crafted to outlast trends and outlive seasons.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/shop">
                <Button variant="brutal" size="lg">Shop Collection</Button>
              </Link>
              <Link to="/shop?sort=newest">
                <Button variant="ghost" size="lg" className="text-cream-200 hover:text-white hover:bg-ink-800">
                  New Arrivals →
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating stat cards */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
            {[
              { label: 'Products', value: '400+' },
              { label: 'Customers', value: '12K+' },
              { label: 'Countries', value: '30+' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 text-white">
                <p className="font-display text-3xl font-bold">{s.value}</p>
                <p className="text-xs text-ink-400 tracking-widest uppercase mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-500">
          <p className="text-xs tracking-widest uppercase">Scroll</p>
          <div className="w-px h-12 bg-gradient-to-b from-ink-600 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section bg-cream">
        <div className="container-app">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-4xl text-ink-900">Shop by Category</h2>
            <Link to="/shop" className="text-sm text-ink-500 hover:text-ink-900 transition-colors">View all →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className={`${cat.bg} group relative flex items-end p-8 min-h-[280px] overflow-hidden hover:opacity-95 transition-opacity`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
                <div>
                  <h3 className="font-display text-3xl font-bold text-white">{cat.label}</h3>
                  <p className="text-white/70 text-sm mt-1 group-hover:text-white transition-colors">Explore →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      {featured.length > 0 && (
        <section className="section bg-white">
          <div className="container-app">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-ember mb-2">Hand-picked</p>
                <h2 className="font-display text-4xl text-ink-900">Featured Pieces</h2>
              </div>
              <Link to="/shop" className="text-sm text-ink-500 hover:text-ink-900 transition-colors">All products →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger">
              {featured.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Brand strip ── */}
      <section className="py-16 bg-ink-900">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $150' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
              { icon: '🔒', title: 'Secure Payment', desc: 'SSL encrypted checkout' },
              { icon: '💬', title: '24/7 Support', desc: 'Dedicated customer care' },
            ].map((item) => (
              <div key={item.title} className="text-cream-200">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-medium text-white text-sm tracking-wide">{item.title}</h4>
                <p className="text-xs text-ink-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="overflow-hidden py-6 border-y border-ink-100 bg-cream">
        <div className="flex gap-12 whitespace-nowrap animate-marquee" style={{ animation: 'marquee 20s linear infinite' }}>
          {['Quality First', 'Designed to Last', 'Sustainable Materials', 'Ethically Made', 'Free Returns', 'New Every Season'].concat(
            ['Quality First', 'Designed to Last', 'Sustainable Materials', 'Ethically Made', 'Free Returns', 'New Every Season']
          ).map((t, i) => (
            <span key={i} className="font-display italic text-2xl text-ink-300 flex-shrink-0">{t} &nbsp;·</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}