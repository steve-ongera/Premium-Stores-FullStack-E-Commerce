import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function Login() {
  const { login, loading, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated])

  const onSubmit = (data) => login(data)

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream page-enter">
      <div className="w-full max-w-md px-4">
        {/* Card */}
        <div className="bg-white border border-ink-100 p-10" style={{ boxShadow: '6px 6px 0 #0D0D0D' }}>
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-ember mb-2">Welcome back</p>
            <h1 className="font-display text-4xl text-ink-900">Sign In</h1>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-ember" {...register('remember')} />
                <span className="text-xs text-ink-500">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-ink-500 hover:text-ember transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="brutal" className="w-full mt-2" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-ink-900 font-medium hover:text-ember transition-colors">
              Create one →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}