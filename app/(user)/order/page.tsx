'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getCart, CartItem } from '../../_api/cart'
import { createCheckoutSession, createOrder } from '../../_api/orders'
import {
  FiArrowLeft,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiLoader
} from 'react-icons/fi'
import { config } from '@/lib/config'
import { getAddresses, Address } from '@/app/_api/addresses'

interface OrderFormData {
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  notes: string
}

export default function OrderCardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addresses, setAddresses] = useState<Address[] | null>(null)
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [cartId, setCartId] = useState<string>('')

  const [formData, setFormData] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Partial<OrderFormData>>({})

  useEffect(() => {
    const initPage = async () => {
      try {
        setIsLoading(true)
        // 1. Load Addresses
        const addrRes = await getAddresses()
        setAddresses(addrRes.data)

        // 2. Load Cart
        const cartRes = await getCart()
        if (!cartRes.data?.products || cartRes.data.products.length === 0) {
          router.push('/cart')
          return
        }
        setItems(cartRes.data.products)
        setTotalPrice(cartRes.data.totalCartPrice)
        setCartId(cartRes.data._id)
      } catch (err) {
        setError('Failed to initialize checkout. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    initPage()
  }, [router])

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    
    if (useNewAddress) {
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.address.trim()) newErrors.address = 'Address is required'
    } else if (!selectedAddressId) {
      newErrors.address = 'Please select a shipping address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      setError(null)

      let shippingDetails
      if (useNewAddress) {
        shippingDetails = {
          details: formData.address,
          phone: formData.phone,
          city: formData.city
        }
      } else {
        const addr = addresses?.find(a => a._id === selectedAddressId)
        shippingDetails = {
          details: addr?.details || '',
          phone: addr?.phone || '',
          city: addr?.city || ''
        }
      }


      const returnUrl = `${window.location.origin}/order-success`
      const checkoutSession = await createCheckoutSession(cartId, returnUrl, { shippingAddress: shippingDetails })

      if (checkoutSession?.session?.url) {
        window.location.href = checkoutSession.session.url
      } else {
        // لو مفيش URL للجلسة، ممكن يكون سيستم الكاش شغال
        router.push('/order-success')
      }

    } catch (err: any) {
      setError(err?.response?.data?.message || 'Transaction failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <FiLoader className="animate-spin text-rose-500 w-10 h-10" />
        <p className="font-bold text-slate-400">Preparing your checkout...</p>
      </div>
    </div>
  )

  return (
    <main className="py-10 px-4 bg-[#FBFBFD] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <Link href="/cart" className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors mb-6 text-sm font-bold">
            <FiArrowLeft /> BACK TO CART
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Checkout</h1>
        </header>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Info */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                  <FiUser />
                </div>
                <h2 className="text-xl font-bold">Recipient Details</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all"
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-rose-500 text-xs font-bold">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 transition-all"
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-rose-500 text-xs font-bold">{errors.lastName}</p>}
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                  <FiMapPin />
                </div>
                <h2 className="text-xl font-bold">Shipping Address</h2>
              </div>

              <div className="space-y-6">
                {!useNewAddress && addresses && addresses.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-400 ml-1">Saved Addresses</label>
                    <select
                      value={selectedAddressId}
                      onChange={(e) => {
                        setSelectedAddressId(e.target.value)
                        setErrors(prev => ({ ...prev, address: '' }))
                      }}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">Select an address</option>
                      {addresses.map(addr => (
                        <option key={addr._id} value={addr._id}>{addr.name} - {addr.city}</option>
                      ))}
                    </select>
                  </div>
                )}

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={useNewAddress}
                    onChange={(e) => setUseNewAddress(e.target.checked)}
                    className="w-5 h-5 rounded text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-sm font-bold text-slate-700">Ship to a different address</span>
                </label>

                {useNewAddress && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 ml-1">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500"
                          placeholder="Cairo"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-400 ml-1">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500"
                          placeholder="010..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400 ml-1">Street Address</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500 resize-none"
                        placeholder="Building number, Street name..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-10">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <FiCreditCard className="text-rose-500" /> Summary
              </h2>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item._id} className="flex gap-4 items-center">
                    <img src={item.product.imageCover} className="w-14 h-14 rounded-xl object-cover bg-slate-100" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.title}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.count} units</p>
                    </div>
                    <p className="text-xs font-black text-slate-900">{item.price * item.count} EGP</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-400">Shipping</span>
                  <span className="font-black text-green-500">FREE</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-400 text-sm">Total Amount</span>
                  <span className="text-2xl font-black text-rose-500">{totalPrice} EGP</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-10 bg-[#1D1D1F] text-white py-5 rounded-[1.5rem] font-black text-sm hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-slate-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" /> SECURING PAYMENT...
                  </span>
                ) : (
                  'PAY & COMPLETE ORDER'
                )}
              </button>
              
              {error && <p className="mt-4 text-rose-500 text-[10px] font-bold text-center uppercase tracking-tighter">{error}</p>}
            </div>
          </aside>
        </form>
      </div>
    </main>
  )
}