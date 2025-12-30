'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getBrands, Brand } from '@/app/_api/brands'
import LoadingSpinner from '@/app/_components/LoadingSpinner'

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchBrands = async () => {
      try {
        setLoading(true)
        const response = await getBrands()
        if (!mounted) return


const brandsData = Array.isArray(response) ? response : (response as any)?.data || []
        setBrands(brandsData)
      } catch (err) {
        if (!mounted) return
        setError('Failed to load brands.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchBrands()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading brands..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F]">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black mb-12">Brands</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/brands/${brand._id}`}
              className="group block rounded-2xl bg-white border border-slate-100 p-6 hover:shadow-lg transition"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="h-32 w-full object-contain mb-4"
              />
              <h3 className="text-center font-bold">
                {brand.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}