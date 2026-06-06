// ─── Checkout ─────────────────────────────────────────────────────
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { placeOrder } from '@/store/orderSlice'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { toast } from 'react-hot-toast'

export function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, subtotal, discount, total, clearCart } = useCart()
  const { placing } = useSelector((s) => s.orders)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (formData) => {
    const result = await dispatch(placeOrder({
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      shippingAddress: {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
    }))
    if (!result.error) {
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/order-success/${result.payload.id}`)
    } else {
      toast.error(result.payload || 'Failed to place order')
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="page-enter">
      <div className="container-app py-10">
        <h1 className="font-display text-5xl text-ink-900 mb-10">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Shipping */}
            <div>
              <h2 className="font-display text-2xl text-ink-900 mb-5">Shipping Address</h2>
              <div className="space-y-4">
                <Input label="Full Name" error={errors.name?.message}
                       {...register('name', { required: 'Required' })} />
                <Input label="Address" error={errors.address?.message}
                       {...register('address', { required: 'Required' })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" error={errors.city?.message}
                         {...register('city', { required: 'Required' })} />
                  <Input label="Postal Code" error={errors.postalCode?.message}
                         {...register('postalCode', { required: 'Required' })} />
                </div>
                <Input label="Country" error={errors.country?.message}
                       {...register('country', { required: 'Required' })} />
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="font-display text-2xl text-ink-900 mb-5">Payment Method</h2>
              <div className="space-y-3">
                {['card', 'mpesa'].map((method) => (
                  <label key={method} className="flex items-center gap-3 p-4 border border-ink-200 cursor-pointer hover:border-ink-900 transition-colors">
                    <input type="radio" value={method} defaultChecked={method === 'card'}
                           {...register('paymentMethod')} className="accent-ember" />
                    <span className="text-sm font-medium capitalize text-ink-900">{method === 'card' ? 'Credit / Debit Card' : 'M-Pesa'}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" variant="brutal" className="w-full" loading={placing}>
              Place Order
            </Button>
          </form>

          {/* Summary */}
          <div className="bg-white border border-ink-100 p-6 h-fit"
               style={{ boxShadow: '4px 4px 0 #E8490F' }}>
            <h2 className="font-display text-2xl mb-6">Order Summary</h2>
            <div className="divide-y divide-ink-100">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between py-3 text-sm">
                  <span className="text-ink-700">{item.name} <span className="text-ink-400">× {item.quantity}</span></span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-ink-200 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-ink-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−${discount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-ink-500"><span>Shipping</span><span>{subtotal >= 150 ? 'Free' : 'TBD'}</span></div>
              <div className="flex justify-between font-bold text-ink-900 text-base pt-2 border-t border-ink-100">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout