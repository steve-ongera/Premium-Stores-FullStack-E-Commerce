// ─── Spinner ──────────────────────────────────────────────────────
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  return (
    <svg className={`animate-spin ${sizes[size]} ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

// ─── Badge ────────────────────────────────────────────────────────
export function Badge({ children, variant = 'ink', className = '' }) {
  const variants = {
    ink: 'badge-ink',
    ember: 'badge-ember',
    cream: 'badge-cream',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
  }
  return <span className={`badge ${variants[variant]} ${className}`}>{children}</span>
}

// ─── StarRating ───────────────────────────────────────────────────
export function StarRating({ rating = 0, max = 5, size = 'sm', interactive = false, onChange }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const half = !filled && i < rating

        return (
          <button
            key={i}
            type="button"
            onClick={() => interactive && onChange?.(i + 1)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            disabled={!interactive}
          >
            <svg className={`${sizes[size]}`} viewBox="0 0 24 24" fill={filled ? '#E8490F' : 'none'}
                 stroke={filled || half ? '#E8490F' : '#C8C8C8'} strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────
export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null

  const getPages = () => {
    const result = []
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) result.push(i)
    } else {
      result.push(1)
      if (page > 3) result.push('...')
      const start = Math.max(2, page - 1)
      const end = Math.min(pages - 1, page + 1)
      for (let i = start; i <= end; i++) result.push(i)
      if (page < pages - 2) result.push('...')
      result.push(pages)
    }
    return result
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center border border-ink-200 text-ink-600 hover:border-ink-900 hover:text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-ink-400 text-sm">…</span>
          : <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 flex items-center justify-center text-sm font-medium border transition-colors
                ${p === page
                  ? 'bg-ink-900 text-white border-ink-900'
                  : 'border-ink-200 text-ink-600 hover:border-ink-900 hover:text-ink-900'}`}
            >
              {p}
            </button>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="w-9 h-9 flex items-center justify-center border border-ink-200 text-ink-600 hover:border-ink-900 hover:text-ink-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}