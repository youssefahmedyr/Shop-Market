'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAddresses, Address, deleteAddress } from '@/app/_api/addresses'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiHome,
  FiNavigation
} from 'react-icons/fi'

export default function AddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // --- Logic: Fetch Addresses (محفوظ تماماً) ---
  const fetchAddresses = async () => {
    try {
      const { data } = await getAddresses()
      setAddresses(data)
    } catch (error) {
      toast.error('Error fetching addresses')
    } finally {
      setIsLoading(false)
    }
  }

  // --- Logic: Delete Action (محفوظ تماماً) ---
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(id)
        toast.success('Address deleted successfully')
        fetchAddresses()
      } catch (error) {
        toast.error('Error deleting address')
      }
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  // --- UI: Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-slate-900"></div>
          <FiMapPin className="absolute text-slate-900 animate-pulse" size={20} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header Section: Modern Flex Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <Link
              href="/profile"
              className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-slate-900 hover:shadow-md transition-all duration-300"
            >
              <FiArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Addresses</h1>
              <p className="text-slate-500 font-medium">Manage where you receive your orders</p>
            </div>
          </div>

          <Link
            href="/profile/addresses/new"
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-95 transition-all"
          >
            <FiPlus className="text-xl" />
            Add New Address
          </Link>
        </div>

        {/* Content Section */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-20 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiNavigation className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No addresses saved yet</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto font-medium">
              Your shipping list is empty. Add an address to enjoy a faster checkout experience.
            </p>
            <Link
              href="/profile/addresses/new"
              className="inline-flex items-center gap-2 bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-600 shadow-lg shadow-rose-100 active:scale-95 transition-all"
            >
              <FiPlus />
              Create First Address
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 flex flex-col"
              >
                <div className="p-8 flex-1">
                  {/* Card Top: Identity */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                        <FiHome size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                          {address.name}
                        </h3>
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-md">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Middle: Info */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                        <FiMapPin className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        {address.details}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg shrink-0">
                        <FiPhone className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-slate-600 text-sm font-bold">{address.phone}</p>
                    </div>
                  </div>

                  {/* Card Bottom: City Label */}
                  <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-black uppercase tracking-tighter">City</span>
                    <span className="text-slate-900 font-black text-sm">{address.city}</span>
                  </div>
                </div>

                {/* Card Footer: Action Buttons */}
                <div className="px-8 pb-8 flex gap-3">
                  <Link
                    href={`/profile/addresses/edit/${address._id}`}
                    className="flex-1 bg-slate-50 text-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-slate-100 transition-colors"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </Link>
                  <button
                    onClick={() => address._id && handleDelete(address._id)}
                    className="flex-1 bg-rose-50 text-rose-600 py-3 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-rose-100 transition-colors"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}