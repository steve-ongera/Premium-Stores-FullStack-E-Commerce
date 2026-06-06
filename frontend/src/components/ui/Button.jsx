import { forwardRef } from 'react'

const variants = {
  primary: 'btn-primary rounded-sm',
  ember: 'btn-ember rounded-sm',
  outline: 'btn-outline rounded-sm',
  ghost: 'btn-ghost rounded-sm',
  brutal: 'btn-brutal rounded-none',
}

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  icon: 'btn-icon',
}

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`btn ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'btn-disabled' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
export default Button