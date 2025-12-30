'use client'

import { useEffect, useState } from 'react'
import { getWishlist, removeFromWishlist } from '@/app/_api/wishlist'
// افترضت اسم الدالة addToCart، قم بتغييره حسب ملف الـ API عندك
import { addToCart } from '@/app/_api/cart' 
import { toast } from 'react-hot-toast'
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    // 1. جلب البيانات عند فتح الصفحة
    const fetchWishlist = async () => {
        try {
            const response = await getWishlist()
            setWishlistItems(response.data || [])
        } catch (error) {
            toast.error('Error loading wishlist')
        } finally {
            setIsLoading(false)
        }
    }

    // 2. دالة النقل للسلة (إضافة ثم حذف من المفضلة)
    const handleMoveToCart = async (productId: string) => {
        setActionLoading(productId)
        try {
            // أولاً: الإضافة للسلة
            await addToCart(productId)
            
            // ثانياً: الحذف من المفضلة (تلقائياً)
            await removeFromWishlist(productId)
            
            // ثالثاً: تحديث الواجهة وحذف العنصر من القائمة
            setWishlistItems((prev) => prev.filter((item) => item._id !== productId))
            
            toast.success('Moved to shopping bag!')
        } catch (error) {
            toast.error('Failed to move item to cart')
            console.error(error)
        } finally {
            setActionLoading(null)
        }
    }

    // 3. دالة الحذف فقط (بدون إضافة للسلة)
    const handleRemove = async (productId: string) => {
        setActionLoading(productId)
        try {
            await removeFromWishlist(productId)
            setWishlistItems((prev) => prev.filter((item) => item._id !== productId))
            toast.success('Removed from favorites')
        } catch (error) {
            toast.error('Error removing item')
        } finally {
            setActionLoading(null)
        }
    }

    useEffect(() => { fetchWishlist() }, [])

    // ملاحظة: قمت بإزالة شاشة اللودينج الكبيرة لأننا سنعتمد على loading.tsx في مجلد الـ app
    if (isLoading) return null 

    return (
        <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20 px-4 md:px-10">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <div className="space-y-2">
                        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors flex items-center gap-2">
                            <FiArrowLeft /> Back to Home
                        </Link>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-black">
                            Wishlist <span className="text-gray-300">({wishlistItems.length})</span>
                        </h1>
                    </div>

                    <div className="h-20 w-20 bg-black rounded-[2rem] hidden md:flex items-center justify-center text-white shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <FiHeart className="fill-rose-500 text-rose-500" size={30} />
                    </div>
                </header>

                {/* List Content */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {wishlistItems.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-24 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm"
                            >
                                <p className="text-gray-400 font-bold italic mb-8 text-lg">Your vault is currently empty.</p>
                                <Link href="/products" className="bg-black text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-black/10">
                                    Discover Products
                                </Link>
                            </motion.div>
                        ) : (
                            wishlistItems.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="group bg-white rounded-[2.5rem] p-4 md:p-6 border border-gray-100 hover:border-black/5 hover:shadow-2xl hover:shadow-gray-200/40 transition-all duration-500"
                                >
                                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">

                                        {/* Product Image */}
                                        <div className="w-full md:w-32 h-40 md:h-32 bg-[#f9f9fb] rounded-[1.8rem] overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.imageCover}
                                                alt={item.title}
                                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-grow text-center md:text-left space-y-1">
                                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic">
                                                {item.category?.name || 'Premium'}
                                            </p>
                                            <h3 className="text-xl font-black text-black leading-tight line-clamp-1 uppercase">
                                                {item.title}
                                            </h3>
                                            <p className="text-2xl font-black tracking-tighter text-black italic">
                                                ${item.price}
                                            </p>
                                        </div>

                                        {/* Interaction Buttons */}
                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={() => handleMoveToCart(item._id)}
                                                disabled={actionLoading === item._id}
                                                className="flex-grow md:flex-initial bg-black text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                                            >
                                                {actionLoading === item._id ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <><FiShoppingCart size={18} /> Add to Cart</>
                                                )}
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleRemove(item._id)}
                                                disabled={actionLoading === item._id}
                                                className="w-14 h-14 rounded-2xl border-2 border-gray-50 flex items-center justify-center text-gray-300 hover:text-white hover:bg-black hover:border-black transition-all duration-300 active:scale-90 disabled:opacity-50 flex-shrink-0"
                                            >
                                                {actionLoading === item._id ? (
                                                    <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin" />
                                                ) : (
                                                    <FiTrash2 size={20} />
                                                )}
                                            </button>
                                        </div>

                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Logo/Line */}
                <div className="mt-24 flex items-center justify-center gap-6 opacity-20 select-none">
                    <div className="h-px w-24 bg-black" />
                    <span className="text-[10px] font-black uppercase tracking-[0.6em]">Shop Market</span>
                    <div className="h-px w-24 bg-black" />
                </div>
            </div>
        </div>
    )
}