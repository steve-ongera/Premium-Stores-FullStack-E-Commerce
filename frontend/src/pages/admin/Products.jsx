import { useEffect, useState } from 'react'
import api from '@/api/axiosInstance'
import { createProduct, updateProduct, deleteProduct } from '@/api/product.api'
import { Badge, Spinner } from '@/components/ui/index'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.get('/products', { params: { limit: 100 } })
      setProducts(data.products || [])
    } catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    reset({})
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    reset({ name: p.name, price: p.price, stock: p.stock, description: p.description })
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, v) })
      if (editing) {
        await updateProduct(editing.id, fd)
        toast.success('Product updated')
      } else {
        await createProduct(fd)
        toast.success('Product created')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      load()
    } catch { toast.error('Delete failed') }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-ink-900">Products</h2>
          <p className="text-ink-400 text-sm">{products.length} total</p>
        </div>
        <Button variant="brutal" onClick={openCreate}>+ Add Product</Button>
      </div>

      {/* Search */}
      <div className="max-w-xs">
        <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-white border border-ink-100 card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50">
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs tracking-widest uppercase text-ink-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-ink-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-ink-100 flex-shrink-0 overflow-hidden">
                          {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-ink-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-ink-400 font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-500 capitalize">{p.category_name || '—'}</td>
                    <td className="px-5 py-3 font-semibold text-ink-900">${parseFloat(p.price).toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`font-medium ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-600' : 'text-ink-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={p.stock > 0 ? 'success' : 'error'}>{p.stock > 0 ? 'In Stock' : 'Sold Out'}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="text-xs text-ink-500 hover:text-ink-900 underline transition-colors">Edit</button>
                        <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:text-red-600 underline transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-ink-400 text-sm">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Product Name" error={errors.name?.message}
                 {...register('name', { required: 'Required' })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price ($)" type="number" step="0.01" error={errors.price?.message}
                   {...register('price', { required: 'Required', min: { value: 0, message: 'Must be positive' } })} />
            <Input label="Stock" type="number" error={errors.stock?.message}
                   {...register('stock', { required: 'Required', min: { value: 0, message: 'Must be ≥ 0' } })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-widest uppercase text-ink-600">Description</label>
            <textarea
              rows={3}
              className="input resize-none"
              placeholder="Product description…"
              {...register('description')}
            />
          </div>
          <Input label="Compare Price ($)" type="number" step="0.01" hint="Original price for showing discounts"
                 {...register('compare_price')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="brutal" loading={saving} className="flex-1">
              {editing ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}