import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import api from '@/api/axiosInstance'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'react-hot-toast'

export default function Profile() {
  const { user } = useAuth()
  const [tab, setTab] = useState('info')
  const [saving, setSaving] = useState(false)

  const infoForm = useForm({ defaultValues: { name: user?.name || '', email: user?.email || '' } })
  const pwForm = useForm()

  const saveInfo = async (data) => {
    setSaving(true)
    try {
      await api.put('/users/me', data)
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setSaving(true)
    try {
      await api.put('/users/me/password', { currentPassword: data.currentPassword, newPassword: data.newPassword })
      toast.success('Password changed')
      pwForm.reset()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { key: 'info', label: 'Personal Info' },
    { key: 'password', label: 'Password' },
  ]

  return (
    <div className="page-enter">
      <div className="container-app py-10 max-w-2xl">
        <h1 className="font-display text-5xl text-ink-900 mb-10">My Profile</h1>

        {/* Avatar + name */}
        <div className="flex items-center gap-5 mb-10 p-6 bg-white border border-ink-100 card">
          <div className="w-16 h-16 bg-ember flex items-center justify-center text-white font-display text-2xl font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-ink-900 text-lg">{user?.name}</p>
            <p className="text-ink-400 text-sm">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="text-xs text-ember font-medium tracking-wide">Admin</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ink-100 mb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors
                ${tab === t.key
                  ? 'border-ink-900 text-ink-900'
                  : 'border-transparent text-ink-400 hover:text-ink-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Info tab */}
        {tab === 'info' && (
          <form onSubmit={infoForm.handleSubmit(saveInfo)} className="space-y-5">
            <Input
              label="Full Name"
              error={infoForm.formState.errors.name?.message}
              {...infoForm.register('name', { required: 'Required' })}
            />
            <Input
              label="Email"
              type="email"
              error={infoForm.formState.errors.email?.message}
              {...infoForm.register('email', { required: 'Required' })}
            />
            <Button type="submit" variant="brutal" loading={saving}>
              Save Changes
            </Button>
          </form>
        )}

        {/* Password tab */}
        {tab === 'password' && (
          <form onSubmit={pwForm.handleSubmit(changePassword)} className="space-y-5">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              error={pwForm.formState.errors.currentPassword?.message}
              {...pwForm.register('currentPassword', { required: 'Required' })}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
              error={pwForm.formState.errors.newPassword?.message}
              {...pwForm.register('newPassword', {
                required: 'Required',
                minLength: { value: 8, message: 'Min 8 characters' },
              })}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              error={pwForm.formState.errors.confirmPassword?.message}
              {...pwForm.register('confirmPassword', { required: 'Required' })}
            />
            <Button type="submit" variant="brutal" loading={saving}>
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}