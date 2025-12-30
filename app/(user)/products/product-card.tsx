'use client'

import { memo } from 'react'
import { FiHeart, FiShoppingCart, FiCheck, FiTrash2, FiStar } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Image from 'next/image'

type ProductCardProps = {
    product: any
    inCart: boolean
    inWishlist: boolean
    isCartLoading: boolean
    isWishlistLoading: boolean
    onCartAction: (id: string, inCart: boolean) => void
    onWishlistAction: (id: string, inWishlist: boolean) => void
}

function ProductCard({
    product,
    inCart,
    inWishlist,
    isCartLoading,
    isWishlistLoading,
    onCartAction,
    onWishlistAction
}: ProductCardProps) {
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="group bg-white rounded-[2.5rem] p-5 transition-all duration-500 hover:shadow-2xl relative flex flex-col h-full border border-gray-50"
        >
            {/* Image Container */}
            <div className="relative aspect-[1/1.1] mb-6 overflow-hidden rounded-[2rem] bg-[#f9f9fb]">
                <img
                    src={product.imageCover || '/placeholder.png'}
                    alt={product.title || "Product"}
                    className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                />

                {/* Wishlist Button (Heart) */}
                <button
                    onClick={() => onWishlistAction(product._id, inWishlist)}
                    disabled={isWishlistLoading}
                    className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm backdrop-blur-md active:scale-75 disabled:opacity-50 z-10 
                    ${inWishlist 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-white/90 text-black hover:bg-black hover:text-white'
                    }`}
                >
                    <FiHeart className={`${inWishlist ? 'fill-current' : ''} text-lg`} />
                </button>

                {/* Rating Badge */}
                {product.ratingsAverage && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                        <FiStar className="text-amber-400 fill-amber-400" size={12} />
                        <span className="text-[10px] font-black">{product.ratingsAverage}</span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col flex-grow px-2">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                        {product.category?.name || 'Premium'}
                    </span>
                </div>

                <h3 className="text-lg font-black text-[#1d1d1f] mb-4 line-clamp-1 leading-tight group-hover:text-rose-500 transition-colors">
                    {product.title}
                </h3>

                <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight -mb-1">Price</span>
                        <span className="text-2xl font-black tracking-tighter text-black">
                            ${product.price}
                        </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={() => onCartAction(product._id, inCart)}
                        disabled={isCartLoading}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg active:scale-90 disabled:opacity-50 
                        ${inCart 
                            ? 'bg-emerald-500 text-white hover:bg-rose-500' 
                            : 'bg-black text-white hover:bg-rose-500 shadow-black/10'
                        }`}
                    >
                        {isCartLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : inCart ? (
                            <div className="relative group/icon">
                                <FiCheck className="text-2xl transition-all group-hover/icon:hidden" />
                                <FiTrash2 className="text-2xl hidden group-hover/icon:block" />
                            </div>
                        ) : (
                            <FiShoppingCart className="text-2xl" />
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default memo(ProductCard)