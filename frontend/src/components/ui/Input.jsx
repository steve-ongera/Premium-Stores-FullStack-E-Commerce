import { forwardRef } from 'react'

const Input = forwardRef(({
  label,
  error,
  hint,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-medium tracking-widest uppercase text-ink-600">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input