'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getBrandById, Brand } from '@/app/_api/brands'
import LoadingSpinner from '@/app/_components/LoadingSpinner'

export default function BrandDetails() {
  const params = useParams()
  const id = params?.id as string

  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    let mounted = true

    const fetchBrand = async () => {
      try {
        setLoading(true)
        const brandData = await getBrandById(id)
        if (!mounted) return
        setBrand(brandData)
      } catch (e) {
        if (!mounted) return
        setError('Failed to load brand details.')
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchBrand()

    return () => {
      mounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Curating brand experience..." />
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

  if (!brand) {
    return <div className="text-center py-20">No brand found</div>
  }

  return (
    <main className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F]">
      <div className="max-w-[1200px] mx-auto px-6 py-12">

        <nav className="mb-12">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-black"
          >
            ← Back to brands
          </Link>
        </nav>

        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-black">{brand.name}</h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Experience the intersection of innovation and craftsmanship through the lens of {brand.name}.
          </p>
        </div>

        <div className="mt-16 flex justify-center">
          <img
            src={brand.image}
            alt={brand.name}
            className="max-h-[400px] object-contain"
          />
        </div>
      </div>
    </main>
  )
}
