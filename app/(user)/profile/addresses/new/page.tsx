'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addAddress, Address } from '@/app/_api/addresses'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import {
  FiArrowLeft,
  FiHome,
  FiMapPin,
  FiPhone,
  FiSave,
  FiX,
  FiPlusCircle
} from 'react-icons/fi'

export default function AddAddressPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<
    Omit<Address, '_id' | 'user' | 'createdAt' | 'updatedAt'>
  >({
    name: 'Home',
    details: '',
    phone: '',
    city: ''
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await addAddress(formData)
      toast.success('Address added successfully')
      router.push('/profile/addresses')
    } catch (error) {

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
        
        {/* Header Section: Modern Look */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link
              href="/profile/addresses"
              className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-slate-900 hover:shadow-md transition-all duration-300 group"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add New Address</h1>
              <p className="text-slate-500 font-medium">Create a new shipping destination</p>
            </div>
          </div>
          <div className="hidden sm:block">
             <FiPlusCircle className="text-rose-500/20 w-16 h-16" />
          </div>
        </div>

        {/* Form Card: Premium Rounded Design */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            <form onSubmit={handleSubmit} className="space-y-7">
              
              {/* Address Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                  <FiHome className="text-rose-500" />
                  Address Label
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                  placeholder="e.g., My Apartment, Main Office"
                  required
                />
              </div>

              {/* City */}
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
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                  placeholder="e.g., Cairo, Dubai, Riyadh"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                  <FiPhone className="text-rose-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-medium placeholder:text-slate-300"
                  placeholder="e.g., +20123456789"
                  required
                />
              </div>

              {/* Address Details */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                  <FiMapPin className="text-rose-500" />
                  Full Address Details
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 transition-all text-slate-900 font-medium resize-none placeholder:text-slate-300"
                  placeholder="Street name, Building number, Floor..."
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/profile/addresses')}
                  className="flex-1 order-2 sm:order-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 active:scale-95 transition-all duration-200"
                >
                  <FiX className="text-lg" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] order-1 sm:order-2 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving Address...
                    </>
                  ) : (
                    <>
                      <FiSave className="text-lg" />
                      Save Address
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Safe Badge */}
        <div className="mt-8 flex justify-center items-center gap-2 text-slate-400 font-medium text-sm">
          <FiSave className="opacity-50" />
          <span>Your data is stored securely in your profile</span>
        </div>
      </div>
    </div>
  )
}