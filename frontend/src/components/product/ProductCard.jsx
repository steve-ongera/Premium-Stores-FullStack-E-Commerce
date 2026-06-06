import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { StarRating, Badge } from '@/components/ui/index'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const [hovered, setHovered] = useState(false)
  const [adding, setAdding] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    addItem(product)
    setTimeout(() => setAdding(false), 1000)
  }

  const isNew = product.created_at && (Date.now() - new Date(product.created_at)) < 14 * 24 * 3600 * 1000
  const isLowStock = product.stock > 0 && product.stock <= 5

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block card card-hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-ink-100 overflow-hidden">
        {product.image
          ? <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-105' : 'scale-100'}`}
            />
          : <div className="w-full h-full flex items-center justify-center text-ink-200">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
        }

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && <Badge variant="ink">New</Badge>}
          {isLowStock && <Badge variant="ember">Low Stock</Badge>}
          {product.stock === 0 && <Badge variant="cream">Sold Out</Badge>}
        </div>

        {/* Quick add */}
        <div className={`absolute inset-x-0 bottom-0 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0 || adding}
            className={`w-full py-3 text-sm font-medium tracking-wide transition-colors
              ${adding
                ? 'bg-green-600 text-white'
                : product.stock === 0
                  ? 'bg-ink-300 text-white cursor-not-allowed'
                  : 'bg-ink-900 text-white hover:bg-ember'}`}
          >
            {adding ? '✓ Added' : product.stock === 0 ? 'Sold Out' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-ink-400 tracking-widest uppercase mb-1">{product.category_name}</p>
        <h3 className="font-medium text-ink-900 text-sm leading-snug group-hover:text-ember transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          {product.rating && <StarRating rating={product.rating} size="sm" />}
          {product.review_count > 0 && (
            <span className="text-xs text-ink-400">({product.review_count})</span>
          )}
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-semibold text-ink-900">${product.price?.toFixed(2)}</span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-xs text-ink-400 line-through">${product.compare_price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}