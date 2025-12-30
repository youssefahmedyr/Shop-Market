// app/_components/product-card.tsx
'use client'

import {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {Product} from '@/types'
import {cn} from '@/lib/utils'
import {Button} from './ui/button'
import {ShoppingCart, Trash2, Heart} from 'lucide-react'
import {useGlobalState} from '../_contexts/global-state-context'
import {
  useAddToCart,
  useRemoveFromCart,
  useRealtimeCart,
  useAddToWishlist,
  useRemoveFromWishlist,
  useRealtimeWishlist
} from '../_hooks/use-api-query'
import {updateCartItemCount} from '../_api/cart'

interface ProductCardProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  product: Product
  className?: string
}

export function ProductCard({product, className, ...props}: ProductCardProps) {
  // Safety check for undefined product
  if (!product || !product._id) {
    return null
  }

  const {cartItems} = useRealtimeCart()
  const addToCartMutation = useAddToCart()
  const removeFromCartMutation = useRemoveFromCart()
  const {state} = useGlobalState()

  // Wishlist hooks
  const {wishlistItems} = useRealtimeWishlist()
  const addToWishlistMutation = useAddToWishlist()
  const removeFromWishlistMutation = useRemoveFromWishlist()

  const cartItem = cartItems.find((item) => item.product._id === product._id)
  const isCartIn = !!cartItem

  // Check if product is in wishlist by looking at the wishlist items
  const isInWishlist =
    wishlistItems && Array.isArray(wishlistItems)
      ? wishlistItems.some((item: any) => {
          if (!item) return false
          // Handle both nested product structure and direct product structure
          return (
            (item.product && item.product._id === product._id) ||
            item._id === product._id ||
            item.id === product._id
          )
        })
      : false
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleAddToCart = async (productId: string) => {
    setUpdatingId(productId)
    await addToCartMutation.mutateAsync(productId)
    setUpdatingId(null)
  }

  const handleWishlistAction = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setUpdatingId(product._id)

    try {
      if (isInWishlist && wishlistItems && Array.isArray(wishlistItems)) {
        // Find the wishlist item and remove it
        const wishlistItem = wishlistItems.find((item: any) => {
          if (!item) return false
          return (
            (item.product && item.product._id === product._id) ||
            item._id === product._id ||
            item.id === product._id
          )
        })
        if (wishlistItem && wishlistItem._id) {
          await removeFromWishlistMutation.mutateAsync(wishlistItem._id)
        }
      } else {
        await addToWishlistMutation.mutateAsync(product._id)
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCartAction = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCartIn && cartItem) {
      setUpdatingId(product._id)
      await removeFromCartMutation.mutateAsync(product._id)
      setUpdatingId(null)
    } else {
      await handleAddToCart(product._id)
    }
  }

  const handleChangeCount = async (delta: number) => {
    if (!cartItem) return
    const newCount = cartItem.count + delta
    if (newCount < 1) return

    setUpdatingId(product._id)

    updateCartItemCount(product._id, newCount)
    setUpdatingId(null)
  }

  return (
    <div
      className={cn(
        'group relative flex flex-col min-h-[400px] max-h-[600px] overflow-hidden rounded-2xl bg-linear-to-br from-white to-slate-50 border border-slate-200 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2',
        className
      )}
    >
      <div
        key={product._id}
        className="group mobile-product-card h-[400px] flex flex-col p-4"
      >
        <Link
          href={`/products/${product._id}`}
          className="flex flex-1 flex-col"
        >
          <div className="aspect-square overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl mb-4 relative shrink-0">
            <Image
              src={product.imageCover}
              alt={product.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Discount Badge */}
            {product.priceAfterDiscount &&
              product.priceAfterDiscount < product.price && (
                <div className="absolute top-3 right-3 bg-linear-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {Math.round(
                    (1 - product.priceAfterDiscount / product.price) * 100
                  )}
                  % OFF
                </div>
              )}

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleWishlistAction}
              disabled={updatingId === product._id}
              className={`absolute top-3 left-3 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isInWishlist
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'bg-white/90 text-slate-600 shadow-md hover:bg-white hover:text-rose-500'
              } disabled:opacity-50 disabled:cursor-not-allowed mobile-touch`}
            >
              <Heart
                className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`}
              />
            </button>
          </div>

          <div className="px-1 flex-1 flex flex-col">
            <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 mobile-text h-6 leading-6">
              {product.title}
            </h3>

            {/* Rating */}
            {product.ratingsAverage && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center text-amber-400">
                  <span>★</span>
                  <span className="text-slate-600 text-sm ml-1">
                    {product.ratingsAverage.toFixed(1)}
                  </span>
                </div>
                {product.ratingsQuantity && (
                  <span className="text-slate-400 text-xs">
                    ({product.ratingsQuantity})
                  </span>
                )}
              </div>
            )}

            <div className="flex items-baseline gap-2 mb-3">
              {product.priceAfterDiscount ? (
                <>
                  <span className="text-lg font-bold bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                    ${product.priceAfterDiscount}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                  ${product.price}
                </span>
              )}
            </div>

            {product.quantity <= 0 && (
              <div className="text-xs text-rose-500 font-medium mb-3">
                Out of Stock
              </div>
            )}

            <div className="mt-auto">
              {isCartIn && cartItem ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleChangeCount(-1)
                    }}
                    disabled={
                      updatingId === product._id ||
                      cartItem.count <= 1 ||
                      state.cart.loading
                    }
                    className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-xs hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center text-sm">
                    {cartItem.count}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleChangeCount(1)
                    }}
                    disabled={updatingId === product._id || state.cart.loading}
                    className="h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-xs hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      if (cartItem) {
                        handleCartAction(e)
                      }
                    }}
                    disabled={updatingId === product._id || state.cart.loading}
                    className="text-xs text-rose-500 hover:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAddToCart(product._id)
                  }}
                  disabled={
                    product.quantity <= 0 ||
                    updatingId === product._id ||
                    state.cart.loading
                  }
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transform hover:scale-105 transition-transform ${
                    product.quantity <= 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-linear-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600'
                  }`}
                >
                  {product.quantity <= 0
                    ? 'Out of Stock'
                    : updatingId === product._id || state.cart.loading
                    ? 'Adding...'
                    : 'Add to Cart'}
                </button>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
