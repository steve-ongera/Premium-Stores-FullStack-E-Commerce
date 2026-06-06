import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { forgotPassword } from '@/api/auth.api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async ({ email }) => {
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (e) {
      /* handled via toast in real app */
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream page-enter">
      <div className="w-full max-w-md px-4">
        <div className="bg-white border border-ink-100 p-10" style={{ boxShadow: '6px 6px 0 #0D0D0D' }}>
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-display text-2xl text-ink-900 mb-2">Check your inbox</h2>
              <p className="text-sm text-ink-500">A reset link has been sent. It expires in 1 hour.</p>
              <Link to="/login" className="mt-6 inline-block text-sm text-ember hover:underline">← Back to sign in</Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-display text-4xl text-ink-900">Forgot Password</h1>
                <p className="text-sm text-ink-400 mt-2">We'll send a reset link to your email.</p>
              </div>
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
                <Button type="submit" variant="brutal" className="w-full" loading={loading}>
                  Send Reset Link
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-ink-500">
                <Link to="/login" className="text-ink-900 hover:text-ember transition-colors">← Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}