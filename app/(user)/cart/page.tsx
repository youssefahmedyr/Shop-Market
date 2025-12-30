'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import {
  getCart,
  updateCartItemCount,
  removeCartItem,
  clearCart,
  CartItem
} from '../../_api/cart'
import { FiCreditCard, FiTrash2, FiShoppingBag, FiPlus, FiMinus, FiChevronRight, FiFilter, FiLoader } from 'react-icons/fi'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true) // للتحميل الأول فقط
  const [selectedCategory, setSelectedCategory] = useState('All')

  // --- دالة التحميل (بدون تفعيل Skeleton إلا في المرة الأولى) ---
  const loadCart = async (showSkeleton = false) => {
    try {
      if (showSkeleton) setIsLoading(true);
      const res = await getCart();
      setItems(res.data?.products || []);
      setTotalPrice(res.data?.totalCartPrice || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load cart.');
    } finally {
      setIsLoading(false);
      setUpdatingId(null);
    }
  }

  useEffect(() => { loadCart(true) }, [])

  // --- استخراج التصنيفات ---
  const categories = useMemo(() => {
    const cats = items.map(item => item.product.category?.name).filter(Boolean)
    return ['All', ...Array.from(new Set(cats))]
  }, [items])

  // --- تصفية المنتجات ---
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items
    return items.filter(item => item.product.category?.name === selectedCategory)
  }, [items, selectedCategory])

  // --- تحديث الكمية (سرعة فائقة - Optimistic) ---
  const handleChangeCount = async (item: CartItem, delta: number) => {
    const newCount = item.count + delta;
    if (newCount < 1 || updatingId) return;

    // 1. تحديث الحالة محلياً فوراً (Optimistic Update)
    const originalItems = [...items];
    const originalTotal = totalPrice;

    setItems(prev => prev.map(i => 
      i.product._id === item.product._id ? { ...i, count: newCount } : i
    ));
    setTotalPrice(prev => prev + (delta * item.price));
    setUpdatingId(item.product._id);

    try {
      // 2. إرسال الطلب للسيرفر في الخلفية
      await updateCartItemCount(item.product._id, newCount);
      // لا نحتاج لعمل loadCart() كاملة لأننا حدثنا البيانات محلياً، 
      // ولكن سنقوم بها للتأكد من مزامنة أي خصومات من السيرفر بدون skeleton
      await loadCart(false); 
    } catch (err: any) {
      // 3. في حال الفشل، نعود للحالة الأصلية (Rollback)
      setItems(originalItems);
      setTotalPrice(originalTotal);
      setError('Could not update quantity.');
    } finally {
      setUpdatingId(null);
    }
  }

  // --- حذف منتج (سرعة فائقة) ---
  const handleRemove = async (itemId: string) => {
    const originalItems = [...items];
    setItems(prev => prev.filter(i => i.product._id !== itemId));
    setUpdatingId(itemId);

    try {
      await removeCartItem(itemId);
      await loadCart(false);
    } catch (err: any) {
      setItems(originalItems);
      setError('Remove failed.');
    } finally {
      setUpdatingId(null);
    }
  }

  const handleClear = async () => {
    if (!confirm('Are you sure?')) return;
    setUpdatingId('all');
    try {
      await clearCart();
      setItems([]);
      setTotalPrice(0);
    } catch (err: any) {
      setError('Clear failed.');
      loadCart(false);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#FBFBFD] py-20 px-4 sm:px-8 text-[#1D1D1F]">
      <div className="max-w-[1200px] mx-auto">
        
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <FiShoppingBag /> Your Bag
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#1D1D1F]">
              Review your bag.
            </h1>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={handleClear}
              disabled={updatingId === 'all'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:bg-rose-500 hover:text-white disabled:opacity-30 active:scale-95 group mb-2"
            >
              {updatingId === 'all' ? <FiLoader className="animate-spin" /> : <FiTrash2 />} 
              Clear Entire Bag
            </button>
          )}
        </header>

        {/* Categories Filter */}
        {!isLoading && items.length > 0 && (
          <div className="mb-12 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pr-4 border-r border-slate-200 text-slate-400">
                <FiFilter className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border ${
                    selectedCategory === cat
                      ? 'bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-lg scale-105'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'All' ? 'All Items' : cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-48 bg-white border border-slate-100 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-32 text-center space-y-8 animate-in fade-in zoom-in-95">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
               <FiShoppingBag className="w-10 h-10" />
             </div>
             <h2 className="text-3xl font-black tracking-tight">Your bag is empty.</h2>
             <Link href="/products" className="inline-block rounded-full bg-[#1D1D1F] px-12 py-5 text-sm font-black text-white hover:bg-black shadow-xl active:scale-95">
               Start Shopping
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8 space-y-6">
              {filteredItems.length === 0 ? (
                <div className="p-20 text-center bg-white border border-dashed border-slate-200 rounded-[2.5rem]">
                    <p className="text-slate-400 font-bold">No items found in this category.</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.product._id} className="group relative flex flex-col sm:flex-row gap-8 p-6 bg-white border border-slate-100 rounded-[2.5rem] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                    
                    {/* Image */}
                    <div className="relative w-full sm:w-40 aspect-square rounded-[1.8rem] bg-[#FBFBFD] overflow-hidden flex items-center justify-center p-4">
                      <img
                        src={item.product.imageCover}
                        alt={item.product.title}
                        className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <Link href={`/products/${item.product._id}`} className="text-xl font-black tracking-tight hover:text-rose-500 transition-colors">
                            {item.product.title}
                          </Link>
                          <p className="text-xl font-black tracking-tighter">{(item.price * item.count).toLocaleString()} <span className="text-[10px] font-medium">EGP</span></p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.product.brand?.name}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.product.category?.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-8">
                        {/* Stepper */}
                        <div className="flex items-center bg-[#F5F5F7] rounded-full p-1 border border-slate-100">
                          <button
                            onClick={() => handleChangeCount(item, -1)}
                            disabled={updatingId === item.product._id || item.count <= 1}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm hover:bg-slate-50 disabled:opacity-30 active:scale-90"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center font-black text-sm">
                            {updatingId === item.product._id ? '...' : item.count}
                          </span>
                          <button
                            onClick={() => handleChangeCount(item, 1)}
                            disabled={updatingId === item.product._id}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm hover:bg-slate-50 disabled:opacity-30 active:scale-90"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-75"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary Sidebar */}
            <aside className="hidden lg:block lg:col-span-4">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.06)] sticky top-24">
                <h3 className="text-2xl font-black mb-8 tracking-tight">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                    <span>Subtotal</span>
                    <span className="text-[#1D1D1F] text-sm">{totalPrice.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex justify-between text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                    <span>Shipping</span>
                    <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-[9px]">FREE</span>
                  </div>
                  <div className="pt-6 mt-6 border-t border-slate-50 flex justify-between items-end">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-4xl font-black tracking-tighter text-rose-500">
                        {totalPrice.toLocaleString()} <span className="text-sm">EGP</span>
                    </span>
                  </div>
                </div>

                <div className="mt-10 space-y-3">
                  <Link href="/order" className="w-full h-14 rounded-2xl bg-[#1D1D1F] text-white font-black flex items-center justify-center gap-3 hover:bg-black shadow-lg active:scale-95 transition-all">
                    <FiCreditCard /> Pay Online
                  </Link>
                  <Link href="/order-cash" className="w-full h-14 rounded-2xl bg-white border-2 border-slate-100 text-black font-black flex items-center justify-center gap-3 hover:border-black active:scale-95 transition-all">
                    Cash on Delivery
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}