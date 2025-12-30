'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getProductById } from '../../../_api/products'
import { Product } from '@/types'
import {
  useRealtimeWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
  useRealtimeCart,
  useAddToCart,
  useRemoveFromCart
} from '../../../_hooks/use-api-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination, Autoplay } from 'swiper/modules'
import { Heart, ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Check, Trash2 } from 'lucide-react'
import LoadingSpinner from '../../../_components/LoadingSpinner'
import { motion } from 'framer-motion'

export default function ProductDetails() {
  const params = useParams()
  const router = useRouter()
  const id = (params as { id?: string })?.id

  const [product, setProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const { wishlistItems } = useRealtimeWishlist()
  const { cartItems } = useRealtimeCart()
  const addToWishlistMutation = useAddToWishlist()
  const removeFromWishlistMutation = useRemoveFromWishlist()
  const addToCartMutation = useAddToCart()
  const removeFromCartMutation = useRemoveFromCart()

  const isInWishlist = wishlistItems && Array.isArray(wishlistItems)
    ? wishlistItems.some((item: any) => (item.product?._id === id || item._id === id || item.id === id))
    : false

  const cartItem = cartItems?.find((item) => item.product._id === id)
  const isInCart = !!cartItem

  useEffect(() => {
    if (!id) return
    let mounted = true
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const data = await getProductById(id)
        if (mounted) setProduct(data)
      } catch (err) {
        if (mounted) setError('Error loading product details.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchProduct()
    return () => { mounted = false }
  }, [id])

  const handleWishlistAction = async () => {
    if (!id) return
    setUpdatingId(id)
    try {
      if (isInWishlist && wishlistItems && Array.isArray(wishlistItems)) {
        const wishlistItem = wishlistItems.find((item: any) => (item.product?._id === id || item._id === id || item.id === id))
        if (wishlistItem?._id) await removeFromWishlistMutation.mutateAsync(wishlistItem._id)
      } else {
        await addToWishlistMutation.mutateAsync(id)
      }
    } finally { setUpdatingId(null) }
  }

  const handleCartAction = async () => {
    if (!id) return
    setProcessing(true)
    try {
      if (isInCart) {
        await removeFromCartMutation.mutateAsync(id)
      } else {
        await addToCartMutation.mutateAsync(id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <LoadingSpinner size="lg" text="Loading Excellence..." />
    </div>
  )

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-20">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors group">
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <span className="font-medium text-slate-900 truncate max-w-[200px]">{product?.title}</span>
          <div className="w-10" />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        {error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">{error}</div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-7">
              <div className="lg:sticky lg:top-24">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] overflow-hidden bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
                  <Swiper modules={[Pagination, Autoplay]} pagination={{ clickable: true, dynamicBullets: true }} autoplay={{ delay: 4000 }} className="aspect-square">
                    {[product.imageCover, ...(product.images || [])].map((img, idx) => (
                      <SwiperSlide key={idx}>
                        <img src={img} alt={product.title} className="w-full h-full object-cover" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </motion.div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-8">
              <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-widest">
                    {product.category?.name}
                  </span>
                  {product.brand && <img src={product.brand.image} alt={product.brand.name} className="h-10 w-auto grayscale" />}
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2">{product.title}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-sm">{product.ratingsAverage?.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-slate-500 font-medium">{product.sold}+ sold</span>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-rose-600">
                      {product.priceAfterDiscount || product.price} <small className="text-lg font-normal">EGP</small>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <button
                      onClick={handleWishlistAction}
                      disabled={updatingId === id}
                      className={`p-4 rounded-2xl border transition-all ${isInWishlist ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-400'}`}
                    >
                      <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                    </button>
                    
                    <motion.button
                      whileTap={{ 
                        scale: 0.95, 
                        boxShadow: isInCart 
                          ? "0px 0px 25px 8px rgba(244, 63, 94, 0.3)" // Rose glow when removing
                          : "0px 0px 25px 8px rgba(16, 185, 129, 0.5)", // Green glow when adding
                        backgroundColor: isInCart ? "#fb7185" : "#10b981"
                      }}
                      onClick={handleCartAction}
                      disabled={processing}
                      className={`flex-1 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 py-4 shadow-lg 
                        ${isInCart 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200' 
                          : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                        } disabled:opacity-80`}
                    >
                      {processing ? (
                        <span className="animate-pulse">Processing...</span>
                      ) : (
                        <>
                          {isInCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                          {isInCart ? 'Added to Cart' : 'Add to Cart'}
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.section>

              <div className="grid grid-cols-3 gap-4">
                {[{ icon: ShieldCheck, text: 'Original' }, { icon: Truck, text: 'Fast' }, { icon: RotateCcw, text: 'Returns' }].map((item, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 text-center">
                    <item.icon className="w-5 h-5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Description</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{product.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">Product not found.</div>
        )}
      </div>
    </main>
  )
}