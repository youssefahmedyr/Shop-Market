'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getBrands, Brand } from '../../_api/brands'
import { LoadingCard } from '../../_components/LoadingSpinner'
import { FiGrid, FiChevronRight } from 'react-icons/fi'

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchBrands = async () => {
      try {
        const response = await getBrands()
        if (!mounted) return
        const brandsData = Array.isArray(response) ? response : (response as any)?.data || []
        setBrands(brandsData)
      } catch (err) {
        if (!mounted) return
        setError('An error occurred while loading brands. Please try again later.')
      } finally {
        if (!mounted) return
        setIsLoading(false)
      }
    }
    fetchBrands()
    return () => { mounted = false }
  }, [])

  return (
    <main className="min-h-screen bg-[#FBFBFD] py-20 px-4 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        
        <header className="mb-16 space-y-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <FiGrid /> Our Partners
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#1D1D1F]">
            Our Brands.
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Elevating your lifestyle with a curated selection of iconic labels.
          </p>
        </header>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-3xl p-6 text-center text-sm font-semibold mb-10 shadow-sm animate-in zoom-in-95">
            {error}
          </div>
        )}

        {isLoading ? (
          <LoadingCard type="brand" count={12} />
        ) : (
          !error && (
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {brands.map((brand) => (
                <Link
                  key={brand._id}
                  href={`/brands/${brand._id}`}
                  className="group relative flex flex-col items-center text-center"
                >
                  <div className="relative aspect-square w-full rounded-[2.5rem] bg-white border border-slate-100 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] group-hover:-translate-y-2 overflow-hidden flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1),rgba(242,242,247,0.5))] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="relative h-full w-full object-contain transition-all duration-700 ease-out group-hover:scale-110"
                    />
                  </div>

                  <div className="mt-6 space-y-1">
                    <h2 className="text-lg font-bold tracking-tight text-[#1D1D1F] transition-colors duration-300 group-hover:text-rose-500">
                      {brand.name}
                    </h2>
                    <div className="flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      View Collection <FiChevronRight />
                    </div>
                  </div>
                </Link>
              ))}

              {brands.length === 0 && (
                <div className="col-span-full py-32 text-center text-slate-400 font-medium tracking-widest uppercase text-xs">
                  The collection is currently empty.
                </div>
              )}
            </section>
          )
        )}
      </div>
    </main>
  )
}