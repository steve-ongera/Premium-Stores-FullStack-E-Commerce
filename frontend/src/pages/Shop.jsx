import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchProducts, setFilters } from '@/store/productSlice'
import { ProductGrid, ProductFilters } from '@/components/product/ProductGrid'

export default function Shop() {
  const dispatch = useDispatch()
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const { filters, pagination, loading } = useSelector((s) => s.products)

  // Sync URL params → filters
  useEffect(() => {
    const newFilters = {}
    if (category) newFilters.category = category
    if (searchParams.get('search')) newFilters.search = searchParams.get('search')
    if (searchParams.get('sort')) newFilters.sort = searchParams.get('sort')
    if (Object.keys(newFilters).length) dispatch(setFilters(newFilters))
  }, [category, searchParams.toString()])

  // Fetch when filters/page changes
  useEffect(() => {
    dispatch(fetchProducts({ ...filters, page: pagination.page }))
  }, [filters, pagination.page])

  const title = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : filters.search
      ? `Results for "${filters.search}"`
      : 'All Products'

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="bg-cream border-b border-ink-100">
        <div className="container-app py-10">
          <h1 className="font-display text-5xl text-ink-900">{title}</h1>
          {!loading && (
            <p className="text-sm text-ink-400 mt-2">
              {pagination.total} {pagination.total === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>
      </div>

      <div className="container-app py-8">
        {/* Filters bar */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-ink-100 flex-wrap">
          <ProductFilters />
        </div>

        {/* Grid */}
        <ProductGrid />
      </div>
    </div>
  )
}