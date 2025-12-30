'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import getCategories from '../../_api/categories'
import { FiChevronRight, FiGrid } from 'react-icons/fi'

type Category = {
  _id: string
  name: string
  image?: string
  slug?: string
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        if (!mounted) return
        setCategories(data.data || [])
      } catch (err) {
        if (!mounted) return
        setError('An error occurred while loading categories. Please try again later.')
      } finally {
        if (!mounted) return
        setIsLoading(false)
      }
    }
    fetchCategories()
    return () => { mounted = false }
  }, [])


  return (
    <main className="min-h-screen bg-[#FBFBFD] py-20 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section - Apple Style */}
        <header className="mb-16 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <FiGrid /> Collections
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#1D1D1F]">
            Browse by category.
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Find exactly what you need with our curated selections of premium products.
          </p>
        </header>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-3xl p-6 text-center text-sm font-semibold mb-10 shadow-sm animate-in zoom-in-95">
            {error}
          </div>
        )}

        {isLoading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] w-full bg-slate-200 rounded-[2.5rem]"></div>
                <div className="h-6 bg-slate-200 rounded-full w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category._id}`}
                  className="group relative flex flex-col items-center text-center"
                >
                  <article className="w-full">
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:-translate-y-2">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-full w-full bg-slate-50 flex items-center justify-center text-slate-200">
                           <FiGrid className="text-4xl" />
                        </div>
                      )}
                      
                      {/* Overlay for better text contrast if needed */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Content */}
                    <div className="mt-6 space-y-1">
                      <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight group-hover:text-rose-600 transition-colors duration-300">
                        {category.name}
                      </h2>
                      {category.slug && (
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {category.slug}
                        </p>
                      )}
                      
                      <div className="pt-2 flex items-center justify-center gap-1 text-sm font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        View Details <FiChevronRight />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}

              {categories.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-400 font-medium text-lg italic">
                    Our collections are being updated. Check back soon.
                  </p>
                </div>
              )}
            </section>
          )
        )}
      </div>
    </main>
  )
}