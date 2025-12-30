'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSubCategoryById, SubCategory } from '../../../_api/subcategories'
import { getProductsByCategory } from '../../../_api/products'
import { Product } from '@/types'
import { ProductCard } from '../../../_components/product-card'
import Logger from '@/app/_components/ui/logger'
import LoadingSpinner from '../../../_components/LoadingSpinner'
import { FiChevronLeft, FiGrid, FiInfo, FiLayers } from 'react-icons/fi'

export default function SubCategoryDetails() {
  const params = useParams()
  const router = useRouter()
  const id = (params as { id?: string })?.id

  const [subCategory, setSubCategory] = useState<SubCategory | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // --- المنطق (Logic) كما هو بدون أي تغيير ---
  useEffect(() => {
    if (!id) return

    let mounted = true

    const fetchData = async () => {
      setLoading(true)
      try {
        const [subData] = await Promise.all([getSubCategoryById(id)])
        if (subData) {
          const productsData = await getProductsByCategory(subData.category)
          if (!mounted) return
          setSubCategory(subData)
          setProducts(productsData.data || [])
        }
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading subcategory details. Please try again later.'
        )
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [id])

  return (
    <main className="min-h-screen bg-[#FDFDFD] py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-500 transition-colors"
            >
              <div className="h-8 w-8 rounded-xl border border-slate-200 flex items-center justify-center group-hover:border-rose-200 group-hover:bg-rose-50 transition-all">
                <FiChevronLeft className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span>Back to subcategories</span>
            </button>

            {!loading && subCategory && (
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                  <FiLayers size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {subCategory.name}
                  </h1>
                  <p className="text-sm font-medium text-rose-500/80 mt-0.5">
                    Category Exploration / {subCategory.slug}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Badge (Optional Visual Touch) */}
          {!loading && products.length > 0 && (
            <div className="bg-white border border-slate-100 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Items</p>
                <p className="text-lg font-black text-slate-900 leading-none">{products.length} Products</p>
              </div>
              <div className="h-10 w-1 bg-slate-100 rounded-full" />
              <FiGrid className="text-rose-500" size={24} />
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-rose-50 border-t-rose-500 animate-spin"></div>
            </div>
            <p className="text-slate-400 font-bold text-sm tracking-wide uppercase">Fetching details...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto">
            <Logger
              logs={[{ id: 'error', type: 'error', message: error }]}
              className="rounded-3xl shadow-xl shadow-red-100 border-none"
            />
          </div>
        )}

        {/* Products Grid Section */}
        {!loading && !error && (
          <div className="space-y-8">
            {products.length > 0 ? (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="hover:-translate-y-2 transition-transform duration-300">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            ) : !loading && subCategory && (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <FiInfo size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  We couldn't find any products in this subcategory at the moment.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Not Found State */}
        {!loading && !error && !subCategory && (
          <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest">Subcategory Details Missing</p>
          </div>
        )}
      </div>
    </main>
  )
}