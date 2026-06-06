import { useCart } from '@/hooks/useCart'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="flex gap-4 p-4 hover:bg-white transition-colors">
      {/* Image */}
      <div className="w-20 h-24 flex-shrink-0 bg-ink-100 overflow-hidden">
        {item.image
          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-ink-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
        }
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-medium text-ink-900 truncate">{item.name}</h4>
          {item.variant && <p className="text-xs text-ink-400 mt-0.5">{item.variant}</p>}
          <p className="text-sm font-semibold text-ink-900 mt-1">${item.price.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center border border-ink-200">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition-colors text-lg leading-none"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium text-ink-900">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition-colors text-lg leading-none"
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(item.id)}
            className="text-xs text-ink-400 hover:text-ember transition-colors underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}