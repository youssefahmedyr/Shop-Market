'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getAddresses, updateAddress, Address } from '@/app/_api/addresses'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import {
  FiArrowLeft,
  FiHome,
  FiMapPin,
  FiPhone,
  FiSave,
  FiX,
  FiCheckCircle
} from 'react-icons/fi'

export default function EditAddressPage() {
  const router = useRouter()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<
    Omit<Address, 'user' | 'createdAt' | 'updatedAt'>
  >({
    _id: '',
    name: '',
    details: '',
    phone: '',
    city: ''
  })


  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const { data } = await getAddresses()
        const address = data.find((addr) => addr._id === id)
        if (address) {
          setFormData(address)
        } else {
          toast.error('Address not found')
          router.push('/profile/addresses')
        }
      } catch (error) {
        router.push('/profile/addresses')
      }
    }

    if (id) {
      fetchAddress()
    }
  }, [id, router])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData._id) return

    setIsLoading(true)
    try {
      await updateAddress(formData._id, {
        name: formData.name,
        details: formData.details,
        phone: formData.phone,
        city: formData.city
      })
      toast.success('Address updated successfully')
      router.push('/profile/addresses')
    } catch (error) {
      toast.error('Error updating address')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header Section: Modern Design */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/profile/addresses"
              className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-slate-900 hover:shadow-md transition-all duration-300"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Address</h1>
              <p className="text-slate-500 font-medium">Keep your delivery info up to date</p>
            </div>
          </div>
          <div className="hidden sm:block">
             <FiMapPin className="text-slate-200 w-12 h-12" />
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-7">
              
              {/* Address Name Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                  <FiHome className="text-rose-500" />
                  Label Your Address
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  placeholder="e.g., My Dream Home, Work Office"
                  required
                />
              </div>

              {/* City Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                  <FiMapPin className="text-rose-500" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  placeholder="Which city do you live in?"
                  required
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                  <FiPhone className="text-rose-500" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                  placeholder="Your active phone number"
                  required
                />
              </div>

              {/* Details Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                  <FiCheckCircle className="text-rose-500" />
                  Detailed Address
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 placeholder:text-slate-400 font-medium resize-none"
                  placeholder="Building name, Floor, Apartment number..."
                  required
                />
              </div>

              {/* Actions: Modern Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/profile/addresses')}
                  className="flex-1 order-2 sm:order-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-4 px-6 rounded-2xl font-bold hover:bg-slate-200 active:scale-95 transition-all duration-200"
                >
                  <FiX />
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] order-1 sm:order-2 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave className="text-xl" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          All your information is encrypted and secure.
        </p>
      </div>
    </div>
  )
}