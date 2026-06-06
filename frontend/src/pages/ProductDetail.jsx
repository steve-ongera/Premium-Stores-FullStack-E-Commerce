import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct, clearCurrent } from '@/store/productSlice'
import { useCart } from '@/hooks/useCart'
import { StarRating, Badge, Spinner } from '@/components/ui/index'
import Button from '@/components/ui/Button'

export default function ProductDetail() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const { current: product, loading } = useSelector((s) => s.products)
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    dispatch(fetchProduct(slug))
    return () => dispatch(clearCurrent())
  }, [slug])

  const handleAdd = () => {
    setAdding(true)
    addItem(product, qty)
    setTimeout(() => setAdding(false), 1200)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  )

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="font-display text-2xl text-ink-900">Product not found</p>
      <Link to="/shop" className="text-sm text-ember hover:underline">← Back to shop</Link>
    </div>
  )

  const images = product.images?.length ? product.images : [{ url: null }]
  const inStock = product.stock > 0

  return (
    <div className="page-enter">
      <div className="container-app py-10">
        {/* Breadcrumb */}
        <nav className="flex gap-2 text-xs text-ink-400 mb-8">
          <Link to="/" className="hover:text-ink-900 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ink-900 transition-colors">Shop</Link>
          {product.category_name && <>
            <span>/</span>
            <Link to={`/shop/${product.category_slug}`} className="hover:text-ink-900 transition-colors capitalize">{product.category_name}</Link>
          </>}
          <span>/</span>
          <span className="text-ink-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ── Images ── */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex flex-col gap-2 w-16 flex-shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-ink-900' : 'border-transparent'}`}
                  >
                    {img.url
                      ? <img src={img.url} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-ink-100" />}
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 aspect-[4/5] bg-ink-100 overflow-hidden">
              {images[activeImg]?.url
                ? <img src={images[activeImg].url} alt={product.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-ink-200">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
              }
            </div>
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest uppercase text-ink-400 mb-2">{product.category_name}</p>
                <h1 className="font-display text-4xl lg:text-5xl text-ink-900 leading-tight">{product.name}</h1>
              </div>
              {!inStock && <Badge variant="cream">Sold Out</Badge>}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3 mt-4">
                <StarRating rating={product.rating} size="md" />
                <span className="text-sm text-ink-500">{product.rating.toFixed(1)} ({product.review_count} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-6">
              <span className="font-display text-4xl text-ink-900">${product.price?.toFixed(2)}</span>
              {product.compare_price > product.price && (
                <span className="text-lg text-ink-400 line-through">${product.compare_price.toFixed(2)}</span>
              )}
              {product.compare_price > product.price && (
                <Badge variant="ember">
                  {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
                </Badge>
              )}
            </div>

            <div className="divider" />

            {/* Description */}
            <p className="text-ink-600 leading-relaxed text-sm">{product.description}</p>

            <div className="divider" />

            {/* Quantity + Add */}
            <div className="flex items-center gap-4 mt-2">
              {/* Qty */}
              <div className="flex items-center border border-ink-200">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 text-xl text-ink-600 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                >−</button>
                <span className="w-12 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(q + 1, product.stock || 99))}
                  className="w-10 h-12 text-xl text-ink-600 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                >+</button>
              </div>

              <Button
                onClick={handleAdd}
                disabled={!inStock}
                loading={adding}
                variant={adding ? 'outline' : 'brutal'}
                className="flex-1"
              >
                {adding ? '✓ Added to Cart' : inStock ? 'Add to Cart' : 'Sold Out'}
              </Button>
            </div>

            {/* Stock status */}
            {inStock && product.stock <= 10 && (
              <p className="text-xs text-ember mt-3 font-medium">⚠ Only {product.stock} left in stock</p>
            )}

            {/* Meta */}
            <div className="mt-8 space-y-2 text-xs text-ink-400">
              {product.sku && <p>SKU: <span className="font-mono text-ink-600">{product.sku}</span></p>}
              <p>Free shipping on orders over $150</p>
              <p>Easy 30-day returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}