import { useEffect, useState } from 'react'
import { getCoupons, createCoupon, deleteCoupon } from '@/api/admin.api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Badge, Spinner } from '@/components/ui/index'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { type: 'percent' },
  })

  const load = () => {
    setLoading(true)
    getCoupons()
      .then((data) => setCoupons(data.coupons || data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await createCoupon(data)
      toast.success('Coupon created')
      setModalOpen(false)
      reset()
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return
    try { await deleteCoupon(id); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  const isExpired = (date) => date && new Date(date) < new Date()
  const discountType = watch('type')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-ink-900">Coupons</h2>
          <p className="text-ink-400 text-sm">{coupons.length} active codes</p>
        </div>
        <Button variant="brutal" onClick={() => { reset(); setModalOpen(true) }}>+ Add Coupon</Button>
      </div>

      <div className="bg-white border border-ink-100 card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50">
                  {['Code', 'Type', 'Value', 'Min Order', 'Expires', 'Status', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs tracking-widest uppercase text-ink-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-ink-50 transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-ink-900 tracking-widest">{c.code}</td>
                    <td className="px-5 py-3 capitalize text-ink-500">{c.discount_type}</td>
                    <td className="px-5 py-3 font-semibold text-ember">
                      {c.discount_type === 'percent' ? `${c.value}%` : `$${c.value}`}
                    </td>
                    <td className="px-5 py-3 text-ink-500">{c.min_order ? `$${c.min_order}` : '—'}</td>
                    <td className="px-5 py-3 text-xs text-ink-500">
                      {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'No expiry'}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={isExpired(c.expires_at) ? 'error' : 'success'}>
                        {isExpired(c.expires_at) ? 'Expired' : 'Active'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => handleDelete(c.id)} className="text-xs text-red-400 hover:text-red-600 underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-ink-400 text-sm">No coupons yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Coupon" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Coupon Code"
            placeholder="e.g. SUMMER20"
            error={errors.code?.message}
            className="uppercase tracking-widest"
            {...register('code', { required: 'Required', minLength: { value: 3, message: 'Min 3 chars' } })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-widest uppercase text-ink-600">Discount Type</label>
            <select className="input py-3 text-sm" {...register('type')}>
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>

          <Input
            label={discountType === 'percent' ? 'Discount (%)' : 'Discount ($)'}
            type="number"
            step={discountType === 'percent' ? '1' : '0.01'}
            error={errors.value?.message}
            {...register('value', {
              required: 'Required',
              min: { value: 0, message: 'Must be positive' },
              max: discountType === 'percent' ? { value: 100, message: 'Max 100%' } : undefined,
            })}
          />

          <Input label="Minimum Order ($)" type="number" step="0.01" placeholder="Optional"
                 {...register('min_order')} />

          <Input label="Expiry Date" type="date" hint="Leave blank for no expiry"
                 {...register('expires_at')} />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="brutal" loading={saving} className="flex-1">Create Coupon</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}