'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useApiToken } from '@/app/_hooks/useApiToken'
import { ProfileProvider } from '@/app/_components/profile-provider'
import Navigation from '@/app/_components/Navigation'
import Footer from '@/app/_components/Footer'
import useCart from '@/app/hooks/use-cart'
import { FiShoppingCart, FiSearch, FiX, FiTrendingUp, FiArrowRight } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

function ModernSearchOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000000] bg-white/95 backdrop-blur-2xl flex flex-col p-6 md:p-20"
        >
          <button onClick={onClose} className="absolute top-10 right-10 w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-rose-500 transition-all active:scale-90 shadow-2xl">
            <FiX size={28} />
          </button>

          <div className="max-w-4xl mx-auto w-full pt-20">
            <div className="relative group">
              <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-black size-8 md:size-12" />
              <input 
                autoFocus type="text" placeholder="SEARCH MARKET..."
                className="w-full bg-transparent border-b-[4px] border-black pb-6 pl-14 md:pl-20 text-3xl md:text-6xl font-black uppercase tracking-tighter placeholder:text-gray-200 focus:outline-none focus:border-rose-500 transition-colors italic"
                value={query} onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 italic"><FiTrendingUp className="text-rose-500" /> Trending Now</h4>
                <div className="flex flex-wrap gap-3">
                  {['Summer 25', 'Leather Bag', 'Hoodies', 'Watches'].map((tag) => (
                    <button key={tag} className="px-6 py-3 rounded-xl bg-gray-50 border border-gray-100 text-[11px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all italic">{tag}</button>
                  ))}
                </div>
              </div>
              <div className="hidden md:block">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 italic">Categories</h4>
                <ul className="space-y-4">
                  {['New Arrivals', 'Best Sellers'].map((link) => (
                    <li key={link}>
                      <Link href="/products" onClick={onClose} className="text-2xl font-black text-black hover:text-rose-500 flex items-center gap-3 group uppercase italic">
                        {link} <FiArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function UserLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { loadCart } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => { if (status === 'authenticated') loadCart() }, [status])
  useApiToken()
  const isAuthPage = pathname.startsWith('/auth')

  useEffect(() => {
    if (status === 'loading') return
    const isAuthenticated = status === 'authenticated'
    if (!isAuthenticated && !isAuthPage) { router.replace('/auth/login'); return }
    if (isAuthenticated && isAuthPage) router.replace('/')
  }, [pathname, status])

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16 bg-black rounded-2xl flex items-center justify-center animate-pulse">
            <FiShoppingCart className="text-white animate-bounce" size={24} />
          </div>
          <span className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase italic">Initializing Experience</span>
        </div>
      </div>
    )
  }

  return (
    <ProfileProvider>
      <div className="min-h-screen bg-[#FBFBFB] flex flex-col font-sans selection:bg-black selection:text-white">
        
        {/* Navigation & Search Trigger */}
        {!isAuthPage && (
          <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
              <Navigation />
              
              <div className="flex items-center gap-4">
                {/* Search Trigger Button */}
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all duration-300"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Search Overlay Component */}
        <ModernSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        <main className="flex-1 flex flex-col relative">
          {!isAuthPage && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-[120px]" />
              <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-rose-50/30 rounded-full blur-[120px]" />
            </div>
          )}

          <div className="flex-1 w-full max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {!isAuthPage && (
          <footer className="mt-20">
            <div className="bg-black text-white rounded-t-[3rem] overflow-hidden">
               <Footer />
               <div className="h-[env(safe-area-inset-bottom)] bg-black" />
            </div>
          </footer>
        )}
      </div>
    </ProfileProvider>
  )
}