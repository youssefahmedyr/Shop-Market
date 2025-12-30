'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getCategoryById, Category } from '../../../_api/categories'
import {
  getSubCategoryByCategoryId,
  SubCategory
} from '../../../_api/subcategories'
import LoadingSpinner from '../../../_components/LoadingSpinner'
import { FiChevronLeft, FiLayers, FiExternalLink } from 'react-icons/fi'

export default function CategoryDetails() {
  const params = useParams()
  const id = params?.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // --- المنطق والربط كما هو تماماً ---
  useEffect(() => {
    if (!id) return
    let mounted = true

    const fetchData = async () => {
      setLoading(true)
      try {
        const [categoryData, subCategoriesData] = await Promise.all([
          getCategoryById(id),
          getSubCategoryByCategoryId(id)
        ])

        if (!mounted) return
        setCategory(categoryData)
        setSubCategories(subCategoriesData.data || [])
      } catch (err) {
        if (!mounted) return
        setError(
          'An error occurred while loading category details. Please try again later.'
        )
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [id])
  // --- نهاية المنطق ---

  return (
    <main className="min-h-screen bg-[#FBFBFD] pb-20 pt-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
          <Link
            href="/categories"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-black transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm group-hover:border-slate-400 transition-all">
              <FiChevronLeft className="text-lg" />
            </span>
            <span>Back to all categories</span>
          </Link>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-slate-400 font-medium animate-pulse text-sm">Organizing details...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-6 text-center text-sm shadow-sm animate-in zoom-in-95">
            <p className="font-bold mb-1">Something went wrong</p>
            {error}
          </div>
        )}

        {!loading && !error && category && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Category Hero Section */}
            <section className="relative bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden mb-12 group">
              <div className="flex flex-col md:flex-row">
                {category.image && (
                  <div className="md:w-1/3 h-64 md:h-auto overflow-hidden bg-slate-50 border-r border-slate-100">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      <FiLayers /> Category
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-none">
                      {category.name}
                    </h1>
                    {category.slug && (
                      <p className="text-lg font-medium text-slate-400 italic">
                        #{category.slug}
                      </p>
                    )}
                  </div>

                  <p className="text-slate-500 leading-relaxed max-w-xl text-lg">
                    Discover our curated collection and explore specialized products 
                    specifically designed for <span className="text-slate-900 font-semibold">{category.name}</span>.
                  </p>
                </div>
              </div>
            </section>

            {/* SubCategories Grid */}
            <section className="space-y-6">
              <div className="flex items-end justify-between px-2">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    Sub-Collections
                  </h2>
                  <p className="text-sm text-slate-500">Refine your search within this category</p>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  {subCategories.length} Units
                </span>
              </div>

              {subCategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subCategories.map((subCategory, index) => (
                    <Link
                      key={subCategory._id}
                      href={`/subcategories/${subCategory._id}`}
                      className="group relative bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {subCategory.name}
                          </h3>
                          <p className="text-sm font-medium text-slate-400 tracking-wide uppercase text-[10px]">
                            {subCategory.slug}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-emerald-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Explore Collection</span>
                          <FiExternalLink />
                        </div>
                      </div>
                      
                      {/* Decorative Background Element */}
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-emerald-50 transition-colors duration-300" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No sub-collections available yet.</p>
                </div>
              )}
            </section>
          </div>
        )}

        {!loading && !error && !category && (
          <div className="text-center py-32 space-y-6 animate-in fade-in zoom-in-95">
             <div className="text-6xl text-slate-200 flex justify-center"><FiLayers /></div>
             <p className="text-slate-500 text-lg font-medium">Category not found.</p>
             <Link href="/categories" className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold text-sm">
                Return Home
             </Link>
          </div>
        )}
      </div>
    </main>
  )
}