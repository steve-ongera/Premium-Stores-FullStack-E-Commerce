import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function Register() {
  const { register: registerUser, loading, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated])

  const onSubmit = ({ confirmPassword, ...data }) => registerUser(data)

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream py-12 page-enter">
      <div className="w-full max-w-md px-4">
        <div className="bg-white border border-ink-100 p-10" style={{ boxShadow: '6px 6px 0 #0D0D0D' }}>
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-ember mb-2">Join LUMA</p>
            <h1 className="font-display text-4xl text-ink-900">Create Account</h1>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Your Name"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
            />
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
              placeholder="Min. 8 characters"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === watch('password') || 'Passwords do not match',
              })}
            />

            <p className="text-xs text-ink-400 leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="underline hover:text-ember">Terms of Service</a> and{' '}
              <a href="#" className="underline hover:text-ember">Privacy Policy</a>.
            </p>

            <Button type="submit" variant="brutal" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-500">
            Already have an account?{' '}
            <Link to="/login" className="text-ink-900 font-medium hover:text-ember transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}