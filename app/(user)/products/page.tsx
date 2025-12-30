'use client'

import { useState, useMemo, useCallback } from 'react'
import { FiSearch, FiShoppingBag, FiHeart, FiLoader } from 'react-icons/fi'
import ProductCard from './product-card'
import {
  useProducts,
  useSubcategories,
  useAddToCart,
  useRemoveFromCart,
  useAddToWishlist,
  useRemoveFromWishlist,
  useCart,
  useWishlist
} from '../../_hooks/use-api-query'

type FilterOptions = {
  category: string
  subcategory: string[]
  search: string
}

export default function ProductsPage() {
  // 1. State Management
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    subcategory: [],
    search: ''
  })

  // لتجنب البطء، سنحتفظ بـ Local State للعمليات الجارية مؤقتاً
  const [optimisticCart, setOptimisticCart] = useState<Set<string>>(new Set())
  const [optimisticWish, setOptimisticWish] = useState<Set<string>>(new Set())

  // 2. Data Fetching
  const productsQuery = useProducts()
  const subcategoriesQuery = useSubcategories()
  
  const { data: cartData } = useCart()
  const { data: wishlistData } = useWishlist()

  // Mutations
  const addToCart = useAddToCart()
  const removeFromCart = useRemoveFromCart()
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()

  const products = productsQuery.data || []
  const subcategories = subcategoriesQuery.data || []

  // 3. Logic: Categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p: any) => p.category?.name).filter(Boolean))
    return ['All', ...Array.from(cats)] as string[]
  }, [products])

  // 4. Logic: Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchesCategory = filters.category === 'All' || product.category?.name === filters.category
      const matchesSearch = product.title.toLowerCase().includes(filters.search.toLowerCase())
      const matchesSub = filters.subcategory.length === 0 || filters.subcategory.includes(product.subcategory?._id)
      return matchesCategory && matchesSearch && matchesSub
    })
  }, [products, filters])

  // 5. Sync IDS (Server Data)
  const serverCartIds = useMemo(() => {
    return new Set(cartData?.data?.products?.map((item: any) => item.product?._id))
  }, [cartData])

  const serverWishIds = useMemo(() => {
    return new Set(wishlistData?.map((item: any) => item._id))
  }, [wishlistData])

  // 6. Handlers (Optimistic logic)
  const handleCartAction = useCallback(async (productId: string, inCart: boolean) => {

    setOptimisticCart(prev => {
        const next = new Set(prev)
        inCart ? next.delete(productId) : next.add(productId)
        return next
    })

    try {
      if (inCart) {
        await removeFromCart.mutateAsync(productId)
      } else {
        await addToCart.mutateAsync(productId)
      }
    } catch (error) {
        // إذا فشل الطلب، نعيد الحالة لما كانت عليه (اختياري)
        console.error("Cart action failed", error)
    }
  }, [removeFromCart, addToCart])

  const handleWishlistAction = useCallback(async (productId: string, inWishlist: boolean) => {
    setOptimisticWish(prev => {
        const next = new Set(prev)
        inWishlist ? next.delete(productId) : next.add(productId)
        return next
    })

    try {
      if (inWishlist) {
        await removeFromWishlist.mutateAsync(productId)
      } else {
        await addToWishlist.mutateAsync(productId)
      }
    } catch (error) {
        console.error("Wishlist action failed", error)
    }
  }, [removeFromWishlist, addToWishlist])

  return (
    <main className="min-h-screen bg-white">

      <div className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
            Our Premium <span className="text-rose-500">Collection</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">
            Discover pieces designed to elevate your everyday style.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Search & Tabs */}
        <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-slate-50 mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-7xl mx-auto">
            
            {/* Categories Scrollable */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters(f => ({ ...f, category: cat, subcategory: [] }))}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                    filters.category === cat
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Bar Inline */}
            <div className="relative w-full md:w-72 group">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-sm"
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {productsQuery.isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-50 animate-pulse rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pb-20">
            {filteredProducts.map((product: any) => {

                const isInCart = optimisticCart.has(product._id) || serverCartIds.has(product._id)
                const isInWish = optimisticWish.has(product._id) || serverWishIds.has(product._id)

                return (
                    <ProductCard
                    key={product._id}
                    product={product}
                    inCart={isInCart}
                    inWishlist={isInWish}
                    onCartAction={handleCartAction}
                    onWishlistAction={handleWishlistAction} isCartLoading={false} isWishlistLoading={false}                    />
                )
            })}
          </div>
        )}
      </div>
    </main>
  )
}