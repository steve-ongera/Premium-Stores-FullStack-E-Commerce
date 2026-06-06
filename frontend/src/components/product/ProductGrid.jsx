import { useDispatch, useSelector } from 'react-redux'
import { setFilters, setPage } from '@/store/productSlice'
import ProductCard from './ProductCard'
import { Spinner, Pagination } from '@/components/ui/index'

// ─── ProductGrid ──────────────────────────────────────────────────
export function ProductGrid() {
  const { list, loading, pagination } = useSelector((s) => s.products)
  const dispatch = useDispatch()

  if (loading && list.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] skeleton" />
            <div className="p-4 space-y-2">
              <div className="h-3 skeleton w-2/3" />
              <div className="h-4 skeleton w-full" />
              <div className="h-4 skeleton w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!loading && list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-2xl text-ink-900">No products found</p>
        <p className="text-ink-400 mt-2 text-sm">Try adjusting your filters or search</p>
      </div>
    )
  }

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination
        page={pagination.page}
        pages={pagination.pages}
        onPageChange={(p) => dispatch(setPage(p))}
      />
    </>
  )
}

// ─── ProductFilters ───────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
]

export function ProductFilters() {
  const dispatch = useDispatch()
  const { filters } = useSelector((s) => s.products)

  const update = (key, value) => dispatch(setFilters({ [key]: value }))

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Sort */}
      <select
        value={filters.sort}
        onChange={(e) => update('sort', e.target.value)}
        className="input py-2 text-sm max-w-xs"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Price range */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min $"
          value={filters.minPrice}
          onChange={(e) => update('minPrice', e.target.value)}
          className="input py-2 text-sm w-24"
          min={0}
        />
        <span className="text-ink-400 text-sm">–</span>
        <input
          type="number"
          placeholder="Max $"
          value={filters.maxPrice}
          onChange={(e) => update('maxPrice', e.target.value)}
          className="input py-2 text-sm w-24"
          min={0}
        />
      </div>
    </div>
  )
}