import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/admin.api'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/index'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = () => {
    setLoading(true)
    getCategories()
      .then((data) => setCategories(data.categories || data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); reset({}); setModalOpen(true) }
  const openEdit = (c) => { setEditing(c); reset({ name: c.name, slug: c.slug }); setModalOpen(true) }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      if (editing) { await updateCategory(editing.id, data); toast.success('Category updated') }
      else { await createCategory(data); toast.success('Category created') }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    try { await deleteCategory(id); toast.success('Deleted'); load() }
    catch { toast.error('Failed to delete — may have products attached') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-ink-900">Categories</h2>
          <p className="text-ink-400 text-sm">{categories.length} categories</p>
        </div>
        <Button variant="brutal" onClick={openCreate}>+ Add Category</Button>
      </div>

      <div className="bg-white border border-ink-100 card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner /></div>
        ) : (
          <div className="divide-y divide-ink-50">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-ink-50 transition-colors">
                <div className="flex items-center gap-4">
                  {c.image_url && (
                    <div className="w-10 h-10 bg-ink-100 overflow-hidden flex-shrink-0">
                      <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-ink-900">{c.name}</p>
                    <p className="text-xs text-ink-400 font-mono">/{c.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-ink-400">{c.product_count || 0} products</span>
                  <button onClick={() => openEdit(c)} className="text-xs text-ink-500 hover:text-ink-900 underline">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-xs text-red-400 hover:text-red-600 underline">Delete</button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="px-6 py-12 text-center text-ink-400 text-sm">No categories yet</div>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'} size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" error={errors.name?.message}
                 {...register('name', { required: 'Required' })} />
          <Input label="Slug" placeholder="e.g. mens-clothing" error={errors.slug?.message}
                 {...register('slug', { required: 'Required' })} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="brutal" loading={saving} className="flex-1">
              {editing ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}