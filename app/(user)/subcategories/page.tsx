'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSubCategories, SubCategory } from '../../_api/subcategories'
import { FiGrid, FiArrowRight, FiLayers, FiSearch } from 'react-icons/fi'

export default function SubCategories() {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchSubCategories = async () => {
      try {
        setLoading(true)
        const data = await getSubCategories()
        if (!mounted) return
        setSubcategories(data.data || [])
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading subcategories. Please try again later.'
        )
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchSubCategories()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#FDFDFD] py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-sm tracking-widest uppercase mb-1">
                <FiGrid className="text-lg" />
                <span>Our Collections</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Sub<span className="text-rose-500">Categories</span>
              </h1>
              <p className="text-slate-500 max-w-lg font-medium">
                Browse through our meticulously curated subcategories to find exactly what you're looking for.
              </p>
            </div>
            
            {/* Counter Badge */}
            {!loading && subcategories.length > 0 && (
              <div className="bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm hidden md:flex items-center gap-3">
                 <span className="text-2xl font-black text-slate-900">{subcategories.length}</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter leading-tight">Total<br/>Sections</span>
              </div>
            )}
          </div>
          
          {/* Decorative element */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        </header>

        {/* Error Handling */}
        {error && (
          <div className="max-w-md mx-auto bg-white border-2 border-rose-100 rounded-[2rem] p-8 text-center shadow-xl shadow-rose-50 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiSearch size={30} />
            </div>
            <p className="text-slate-800 font-bold mb-2">Oops! Something went wrong</p>
            <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        )}

        {/* Categories Grid */}
        {!error && !loading && (
          <section className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {subcategories.map((sub) => (
              <Link
                key={sub._id}
                href={`/subcategories/${sub._id}`}
                className="group relative block"
              >
                <article className="h-full bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden">
                  {/* Background Icon Watermark */}
                  <FiLayers className="absolute -right-4 -bottom-4 text-slate-50 size-24 group-hover:text-rose-50 transition-colors -z-0" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 mb-4 shadow-inner">
                      <FiLayers size={20} />
                    </div>
                    
                    <h2 className="text-lg font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors truncate mb-1" title={sub.name}>
                      {sub.name}
                    </h2>
                    <p className="text-[11px] font-bold text-rose-400 uppercase tracking-widest opacity-80 group-hover:opacity-100">
                      /{sub.slug}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 group-hover:text-slate-900 transition-colors tracking-widest">
                    <span>Explore</span>
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              </Link>
            ))}

            {/* Empty State */}
            {subcategories.length === 0 && (
              <div className="col-span-full py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] text-center">
                <div className="text-slate-300 font-black uppercase tracking-[0.2em] text-sm">
                  Catalog is currently empty
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}