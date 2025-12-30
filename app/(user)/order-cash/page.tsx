'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getCart, CartItem } from '../../_api/cart'
import { createOrder } from '../../_api/orders'
import {
  FiArrowLeft,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiLoader,
  FiChevronRight,
  FiTruck
} from 'react-icons/fi'
import { Address, getAddresses } from '@/app/_api/addresses'

interface OrderFormData {
  firstName: string
  lastName: string
  address: string
  notes: string
}

export default function OrderCashPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addresses, setAddresses] = useState<{ data: Address[] }>()

  useEffect(() => {
    getAddresses()
      .then((res) => setAddresses({ data: res.data }))
      .catch((err) => console.error(err))
    loadCart()
  }, [])

  const [formData, setFormData] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    address: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Partial<OrderFormData>>({})

  const loadCart = async () => {
    try {
      setError(null)
      setIsLoading(true)
      const res = await getCart()
      setItems(res.data?.products || [])
      setTotalPrice(res.data?.totalCartPrice || 0)

      if (!res.data?.products || res.data.products.length === 0) {
        router.push('/cart')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to load cart. Please try again.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      setError(null)

      const selectedAddr = addresses?.data.find(
        (addr) => `${addr.details}, ${addr.city}` === formData.address
      )

      const orderData = {
        shippingAddress: {
          details: formData.address,
          phone: selectedAddr?.phone || '',
          city: selectedAddr?.city || ''
        }
      }

      const cartResponse = await getCart()
      const cartId = cartResponse.data?._id
      if (!cartId) throw new Error('No cart ID found')

      await createOrder(cartId, orderData.shippingAddress)
      router.push('/order-success')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to create order. Please try again.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FBFBFD] py-12 px-4 sm:px-6 lg:px-8 text-[#1D1D1F]">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-black transition-colors mb-8 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Bag
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-100">
              <FiTruck className="w-5 h-5" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Cash on Delivery.</h1>
          </div>
          <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
            Please fill in your final delivery details. Payment will be collected upon arrival.
          </p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold animate-in zoom-in-95">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Form Content */}
          <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Section: User */}
            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <FiUser className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Recipient Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-6 py-4 bg-[#F5F5F7] border-none rounded-[1.2rem] focus:ring-2 focus:ring-rose-500 transition-all font-medium ${errors.firstName ? 'ring-2 ring-rose-500' : ''}`}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-6 py-4 bg-[#F5F5F7] border-none rounded-[1.2rem] focus:ring-2 focus:ring-rose-500 transition-all font-medium ${errors.lastName ? 'ring-2 ring-rose-500' : ''}`}
                    placeholder="Doe"
                  />
                </div>
              </div>
            </section>

            {/* Section: Shipping */}
            <section className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Delivery Details</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Select Delivery Address</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <select
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full appearance-none px-6 py-4 bg-[#F5F5F7] border-none rounded-[1.2rem] focus:ring-2 focus:ring-rose-500 transition-all font-bold text-sm ${errors.address ? 'ring-2 ring-rose-500' : ''}`}
                      >
                        <option value="">Choose an address...</option>
                        {addresses?.data.map((addressData) => (
                          <option
                            key={addressData._id}
                            value={`${addressData.details}, ${addressData.city}`}
                          >
                            {addressData.name} — {addressData.details}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <FiChevronRight className="rotate-90" />
                      </div>
                    </div>
                    <Link
                      href="/profile/addresses"
                      className="w-14 h-14 bg-[#1D1D1F] text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
                    >
                      <FiMapPin className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Delivery Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-6 py-4 bg-[#F5F5F7] border-none rounded-[1.2rem] focus:ring-2 focus:ring-rose-500 transition-all font-medium resize-none"
                    placeholder="e.g. Near the grand mosque, second floor..."
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Summary */}
          <aside className="lg:col-span-5 sticky top-24 animate-in fade-in slide-in-from-right-6 duration-1000">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.06)]">
              <h3 className="text-2xl font-black mb-8 tracking-tight">Summary</h3>
              
              <div className="space-y-4 mb-8 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] p-2 flex-shrink-0">
                      <img src={item.product.imageCover} alt="" className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black truncate">{item.product.title}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.count} Units</p>
                    </div>
                    <p className="text-sm font-black tracking-tight">{(item.price * item.count).toLocaleString()} <span className="text-[10px]">EGP</span></p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-slate-50 pt-8 mb-8">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-black text-sm">{totalPrice.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <span>Delivery</span>
                  <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full">FREE</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-slate-50">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-4xl font-black tracking-tighter text-rose-500 leading-none">
                    {totalPrice.toLocaleString()} <span className="text-sm">EGP</span>
                  </span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-8">
                <div className="flex gap-3">
                  <FiCreditCard className="text-amber-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-amber-800 mb-1">Cash on Delivery</p>
                    <p className="text-[11px] font-medium text-amber-700 leading-relaxed">
                      Please ensure you have the exact amount ready upon delivery for a faster experience.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 rounded-2xl bg-[#1D1D1F] text-white font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin w-5 h-5" /> Processing...
                  </>
                ) : (
                  <>
                    Complete Order <FiChevronRight />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-300 mt-6 leading-relaxed">
                By placing this order, you agree to our <Link href="/terms" className="underline hover:text-slate-500 transition-colors">Terms of Service</Link>
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  )
}