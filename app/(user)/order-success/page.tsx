'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiCheck, FiPackage, FiHome, FiShoppingBag, FiArrowRight } from 'react-icons/fi'

export default function OrderSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const clearCart = async () => {
      try {
        // Logic to clear cart if needed
      } catch (error) {
        console.error('Error clearing cart:', error)
      }
    }
    clearCart()
  }, [router])

  return (
    <main className="min-h-screen bg-[#FBFBFD] py-16 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Main Success Card */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 md:p-16 text-center shadow-[0_40px_100px_rgba(0,0,0,0.04)] relative overflow-hidden">
          
          {/* Animated Success Icon */}
          <div className="relative mb-10">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-700 delay-300 fill-mode-both">
              <FiCheck className="w-12 h-12 text-green-500 stroke-[3]" />
            </div>
            {/* Subtle pulse effect */}
            <div className="absolute inset-0 w-24 h-24 bg-green-100 rounded-full mx-auto animate-ping opacity-20" />
          </div>

          {/* Heading Section */}
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#1D1D1F]">
              It&apos;s Official.
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-md mx-auto leading-relaxed">
              Your order has been placed. We&apos;ll handle the rest and see you at your doorstep soon.
            </p>
          </div>

          {/* Order Brief Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#F5F5F7] rounded-[1.5rem] p-6 text-left transition-hover hover:bg-[#F0F0F2]">
              <div className="flex items-center gap-3 mb-4">
                <FiPackage className="w-5 h-5 text-rose-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Order Info</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500">Method</span>
                  <span className="text-sm font-black text-[#1D1D1F]">Cash</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500">Delivery</span>
                  <span className="text-sm font-black text-green-600">Free</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F5F7] rounded-[1.5rem] p-6 text-left transition-hover hover:bg-[#F0F0F2]">
              <div className="flex items-center gap-3 mb-4">
                <FiHome className="w-5 h-5 text-blue-500" />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Timeline</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-[#1D1D1F]">2-4 Business Days</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Estimated Arrival</p>
              </div>
            </div>
          </div>

          {/* Steps Timeline (Subtle) */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 mb-12 text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-800 mb-4">Next Steps</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[10px] font-black text-amber-800 flex-shrink-0">1</div>
                <p className="text-sm font-medium text-amber-900/80">Check your phone for a confirmation message.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-[10px] font-black text-amber-800 flex-shrink-0">2</div>
                <p className="text-sm font-medium text-amber-900/80">Prepare the exact amount for a smooth delivery.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F5F5F7] px-8 py-5 text-sm font-black text-[#1D1D1F] hover:bg-[#E8E8ED] transition-all active:scale-95"
            >
              <FiShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
            <Link
              href="/profile/orders"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1D1D1F] px-8 py-5 text-sm font-black text-white hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              View My Orders
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Footer Contact */}
          <div className="mt-12 pt-8 border-t border-slate-50">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-300">
              Need assistance? Email{' '}
              <a href="mailto:support@needful.com" className="text-rose-500 hover:text-rose-600 transition-colors underline">
                support@needful.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}