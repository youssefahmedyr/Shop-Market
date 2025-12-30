'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getBrandById, Brand } from '../../../_api/brands'
import LoadingSpinner from '../../../_components/LoadingSpinner'

export default function BrandDetails() {
  const params = useParams()
  const id = params?.id as string

  const [brand, setBrand] = useState<Brand | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let mounted = true
    const fetchBrand = async () => {
      try {
        setLoading(true)
        const response = await getBrandById(id)
        if (!mounted) return
        const brandData = response.data || response
        setBrand(brandData)
      } catch (err) {
        if (!mounted) return
        setError('Failed to load brand details.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchBrand()
    return () => { mounted = false }
  }, [id])

  return (
    <main className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] selection:bg-rose-100">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        
        {/* Apple-style Navigation */}
        <nav className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <Link
            href="/brands"
            className="group inline-flex items-center gap-3 text-sm font-medium text-slate-500 hover:text-black transition-all"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            <span className="tracking-tight">Brands Collection</span>
          </Link>
        </nav>

        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="lg" text="Curating brand experience..." />
          </div>
        )}

        {error && !loading && (
          <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-500/5">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✕</div>
            <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
            <p className="text-slate-500 mb-6 px-10">{error}</p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-slate-800 transition-all">Try Again</button>
          </div>
        )}

        {!loading && !error && brand && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            
            {/* Brand Hero Section */}
            <div className="flex flex-col items-center text-center space-y-6">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-rose-500">Official Brand Partner</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                {brand.name}
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
                Experience the intersection of innovation and craftsmanship through the lens of {brand.name}.
              </p>
            </div>

            {/* The "Stage" - Apple-like Product Showcase */}
            <section className="relative group">
              {/* Radial background glow */}
              <div className="absolute inset-0 bg-radial-gradient from-white via-transparent to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-[2.5rem] bg-gradient-to-b from-[#f5f5f7] to-white border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden flex items-center justify-center p-12 transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)]">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="h-full w-full object-contain mix-blend-multiply transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                />
                
                {/* Decorative Elements */}
                <div className="absolute bottom-8 right-8 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                </div>
              </div>
            </section>

            {/* Bottom Stats/Info - Laza Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
                {[
                    { label: "Collection", value: "2025 Series" },
                    { label: "Status", value: "Verified Brand" },
                    { label: "Category", value: "Premium" }
                ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-white border border-slate-100 text-center hover:border-slate-300 transition-colors cursor-default">
                        <dt className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-2">{stat.label}</dt>
                        <dd className="text-lg font-bold">{stat.value}</dd>
                    </div>
                ))}
            </div>

          </div>
        )}
      </div>
    </main>
  )
}