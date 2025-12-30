'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import getCategories, { Category } from '../_api/categories'
import { Product } from '@/types'
import { getAllProducts } from '../_api/products'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Autoplay, FreeMode } from 'swiper/modules'
import Link from 'next/link'
import { useAutoRefreshAll } from '../_hooks/use-api-query'
import { FiArrowRight, FiZap, FiBox, FiStar, FiPlus } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function Home() {
  useAutoRefreshAll()

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [categoriesRes, productsRes] = await Promise.all([
          getCategories(),
          getAllProducts()
        ])
        setCategories(categoriesRes.data || [])
        setProducts(productsRes.data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="bg-white min-h-screen font-sans overflow-x-hidden">
      <style jsx global>{`
        ::-webkit-scrollbar { display: none !important; }
        body { -ms-overflow-style: none !important; scrollbar-width: none !important; overflow-x: hidden; }
        .swiper-scrollbar { display: none !important; }
      `}</style>

      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative px-4 sm:px-6 lg:px-10 pt-6 pb-10 mt-20">
        <div className="max-w-7xl mx-auto overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] bg-black text-white relative min-h-[500px] md:min-h-[600px] flex items-center shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-500/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 px-8 py-16 md:px-20 lg:px-24 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 mb-6">
                <FiZap className="animate-pulse" /> Limited Edition Collection
              </span>
              <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-8 italic">
                CRAFTED <br />
                FOR <span className="text-[#86868b]">YOU.</span>
              </h1>
              <p className="text-[#a1a1a6] text-lg md:text-xl font-medium mb-10 max-w-md leading-relaxed">
                Step into the future of lifestyle with our premium selection of essentials.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex px-10 py-4 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all items-center gap-3 group shadow-lg"
                >
                  Explore Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= 2. CATEGORIES SECTION ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase italic mb-2">Categories</h2>
            <div className="h-1 w-12 bg-black rounded-full" />
          </div>
          <Link href="/categories" className="text-xs font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors flex items-center gap-2">
            View All <FiArrowRight />
          </Link>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 overflow-hidden">
          <Swiper
            slidesPerView={'auto'}
            spaceBetween={20}
            freeMode={true}
            modules={[FreeMode, Autoplay]}
            className="!overflow-visible"
            breakpoints={{
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 4.5 },
            }}
          >
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <SwiperSlide key={`cat-skele-${i}`} className="w-[260px] md:w-[320px]">
                    <div className="h-[380px] w-full bg-gray-100 animate-pulse rounded-[2.5rem]" />
                  </SwiperSlide>
                ))
              : categories.map((category) => (
                  <SwiperSlide key={category._id} className="w-[260px] md:w-[320px]">
                    <Link
                      href={`/categories/${category._id}`}
                      className="group relative h-[380px] flex items-end p-8 overflow-hidden rounded-[2.5rem] bg-[#f5f5f7] block transition-all duration-700 hover:shadow-2xl"
                    >
                      {category.image && (
                        <Image
                          src={category.image}
                          alt={category.name || "Category Image"} 
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="relative z-10 w-full">
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Collection</p>
                        <h3 className="text-white text-2xl font-black tracking-tight uppercase italic leading-none">
                          {category.name}
                        </h3>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      </section>

      {/* ================= 3. FEATURED PRODUCTS ================= */}
      <section className="py-24 bg-[#fbfbfb] rounded-[4rem] mx-2 sm:mx-6 mb-16 overflow-hidden border border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-16">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div>
               <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-3">The Essentials</h2>
               <p className="text-gray-400 font-medium text-lg italic">Don&apos;t settle for average. Choose excellence.</p>
             </div>
             <Link href="/products" className="px-8 py-4 bg-black text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] self-start">
               Explore Full Catalog
             </Link>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-10">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[2.5rem] animate-pulse" />)}
            </div>
          ) : (
            <Swiper
              spaceBetween={24}
              freeMode={true}
              modules={[FreeMode]}
              className="!overflow-visible"
              breakpoints={{
                0: { slidesPerView: 1.4, spaceBetween: 16 },
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 4 }
              }}
            >
              {products.slice(0, 12).map((product) => (
                <SwiperSlide key={product._id} className="pb-12">
                  <motion.div 
                    whileHover={{ y: -10 }}
                    className="group bg-white rounded-[2.5rem] p-5 transition-all duration-500 hover:shadow-2xl relative flex flex-col h-full border border-gray-50"
                  >
                    <Link href={`/products/${product._id}`} className="block relative aspect-[1/1.1] mb-6 overflow-hidden rounded-[2rem] bg-[#f9f9fb]">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name || "Product Image"} 
                          fill
                          className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-sm w-10 h-10 rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity">
                         <FiStar size={16} />
                      </div>
                    </Link>
                    
                    <div className="flex flex-col flex-grow px-2">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                          {product.category?.name || 'Exclusive'}
                        </span>
                      </div>
                      <Link href={`/products/${product._id}`} className="text-lg font-black text-[#1d1d1f] mb-4 line-clamp-1 leading-tight hover:text-rose-500 transition-colors">
                        {product.name}
                      </Link>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="text-xl font-black tracking-tighter text-black">
                          ${product.price}
                        </span>
                        <button className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center hover:bg-rose-500 transition-all duration-500 shadow-lg shadow-black/5">
                          <FiPlus size={22} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* ================= 4. SERVICE BADGES ================= */}
      <section className="py-24 max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 text-2xl text-black group-hover:bg-black group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-sm">
              <FiZap />
            </div>
            <h4 className="font-black text-lg mb-3 uppercase tracking-tighter italic">Flash Delivery</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[240px] font-medium">Your package arrives within 24-48 hours, guaranteed and insured.</p>
          </div>
          
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 text-2xl text-black group-hover:bg-black group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-sm">
              <FiStar />
            </div>
            <h4 className="font-black text-lg mb-3 uppercase tracking-tighter italic">Pure Quality</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[240px] font-medium">Every item is hand-picked and verified for 100% authenticity.</p>
          </div>

          <div className="flex flex-col items-center text-center group sm:col-span-2 lg:col-span-1">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 text-2xl text-black group-hover:bg-black group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-sm mx-auto">
              <FiBox />
            </div>
            <h4 className="font-black text-lg mb-3 uppercase tracking-tighter italic">Easy Returns</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[240px] font-medium mx-auto">Not satisfied? Return it within 14 days with no questions asked.</p>
          </div>
        </div>
      </section>
    </div>
  )
}