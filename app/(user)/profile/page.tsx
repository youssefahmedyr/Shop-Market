'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiLogOut,
  FiShoppingCart,
  FiHeart,
  FiPackage,
  FiMapPin,
  FiChevronRight,
  FiSettings
} from 'react-icons/fi'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })


  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/login')
      return
    }
    if (session.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || ''
      })
    }
  }, [session, status, router])


  const handleEdit = () => setIsEditing(true)
  
  const handleCancel = () => {
    setIsEditing(false)
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: (session.user as any).phone || ''
      })
    }
  }

  const handleSave = async () => {
    try {
      // Logic for API call would go here
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      router.push('/auth/login')
    } catch (error) {
      router.push('/auth/login')
    }
  }

  // --- UI: States ---
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-white overflow-hidden mb-8">
          <div className="h-32 bg-slate-900 w-full relative">
             {/* Abstract Pattern Decoration */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,_white_1px,_transparent_0)] bg-[length:24px_24px]"></div>
          </div>
          
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row items-end gap-6 -mt-12 mb-6">
              <div className="w-32 h-32 bg-white rounded-[2.5rem] p-2 shadow-xl relative group">
                <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                  <FiUser size={48} />
                </div>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem] cursor-pointer">
                    <FiEdit2 className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 mb-2 text-center md:text-left">
                <h1 className="text-3xl font-black text-slate-900">{session?.user?.name}</h1>
                <p className="text-slate-500 font-medium">{session?.user?.email}</p>
              </div>

              <div className="flex items-center gap-3 mb-2">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    <FiEdit2 size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                    >
                      <FiSave size={18} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900">
                  <FiSettings size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900">Personal Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      disabled={!isEditing}
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 transition-all disabled:opacity-70"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      disabled={!isEditing}
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 transition-all disabled:opacity-70"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      disabled={!isEditing}
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 transition-all disabled:opacity-70"
                      placeholder="Add your mobile"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Member Since</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <div className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl font-bold text-slate-500 cursor-not-allowed">
                      {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Links */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6">Quick Access</h2>
              
              <div className="space-y-3">
                <QuickLink href="/profile/orders" icon={<FiPackage />} label="My Orders" sub="Track your purchases" />
                <QuickLink href="/profile/addresses" icon={<FiMapPin />} label="Shipping Addresses" sub="Manage where we ship" />
                <QuickLink href="/wishlist" icon={<FiHeart />} label="Wishlist" sub="Things you love" />
                <QuickLink href="/cart" icon={<FiShoppingCart />} label="My Cart" sub="Review items" />
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 bg-rose-50 text-rose-600 px-4 py-4 rounded-2xl font-black hover:bg-rose-100 transition-all active:scale-95"
                >
                  <FiLogOut size={20} />
                  Logout Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Reusable Quick Link Component
function QuickLink({ href, icon, label, sub }: { href: string, icon: any, label: string, sub: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 rounded-[1.5rem] border border-slate-50 hover:bg-slate-50 hover:border-slate-100 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all">
          {icon}
        </div>
        <div>
          <p className="text-[13px] font-black text-slate-900 leading-none mb-1">{label}</p>
          <p className="text-[11px] font-medium text-slate-400 leading-none">{sub}</p>
        </div>
      </div>
      <FiChevronRight className="text-slate-300 group-hover:text-slate-900 transition-colors" />
    </Link>
  )
}