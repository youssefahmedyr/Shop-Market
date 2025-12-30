'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiShoppingCart,
  FiUser,
  FiHeart,
  FiMenu,
  FiX,
  FiSearch,
  FiLogOut,
  FiPackage,
  FiGrid,
  FiBriefcase,
  FiArrowRight,
  FiChevronDown
} from 'react-icons/fi'
import SearchBar from './SearchBar'
import { useRealtimeCart, useRealtimeWishlist } from '@/app/_hooks/use-api-query'

export default function Navigation() {
  const pathname = usePathname()
  
  // Hooks
  const { cartCount } = useRealtimeCart()
  const { wishlistCount } = useRealtimeWishlist()

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  /* Scroll Effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close Profile Dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /* Lock body scroll */
  useEffect(() => {
    if (mobileMenu || searchOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'auto'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'auto'
    }
  }, [mobileMenu, searchOpen])

  /* Close menus on route change */
  useEffect(() => {
    setMobileMenu(false)
    setSearchOpen(false)
    setProfileOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    const { signOut } = await import('next-auth/react')
    await signOut({ callbackUrl: '/auth/login' })
  }

  const navLinks = [
    { href: '/products', label: 'Products', icon: FiPackage },
    { href: '/brands', label: 'Brands', icon: FiBriefcase },
    { href: '/categories', label: 'Categories', icon: FiGrid }
  ]

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed top-0 inset-x-0 z-[50] transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
            : 'py-5 bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 relative z-[60]">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <FiShoppingCart className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-xl leading-none">SHOPMART</p>
              <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                Premium
              </span>
            </div>
          </Link>

          {/* Search Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-6 lg:mx-10">
            <SearchBar isMobile={false} />
          </div>

          {/* ================= DESKTOP NAV LINKS (NEW) ================= */}
          {/* hidden on mobile/tablet, visible on lg screens */}
          <div className="hidden lg:flex items-center gap-2 mr-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                {link.label}
              </Link>
            ))}
          </div>
          {/* ========================================================== */}

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 relative z-[60]">
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <FiSearch size={20} />
            </button>

            <Link
              href="/wishlist"
              className="hidden sm:flex relative p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <FiHeart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown Desktop */}
            <div className="hidden lg:relative lg:block" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
              >
                <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center">
                  <FiUser className="text-white text-xs" />
                </div>
                <FiChevronDown className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2"
                  >
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      <FiUser className="text-gray-400" /> My Profile
                    </Link>
                    <Link href="/profile/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      <FiPackage className="text-gray-400" /> My Orders
                    </Link>
                    <div className="h-px bg-gray-100 my-1 mx-4" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setMobileMenu(true)}
              className="lg:hidden p-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= SEARCH OVERLAY (FULL SCREEN) ================= */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-0 z-[9999] bg-white flex flex-col h-[100dvh] w-full"
          >
            <div className="p-5 flex justify-between items-center border-b border-gray-100 bg-white shrink-0">
              <span className="font-black text-xl uppercase tracking-tight">Search</span>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-5">
              <div className="mb-6">
                <SearchBar isMobile={true} />
              </div>

              {!scrolled && (
                <div className="mt-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">
                    Trending Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Sneakers', 'Hoodies', 'Summer 2024', 'Accessories'].map(tag => (
                      <button
                        key={tag}
                        className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-bold transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MOBILE MENU (UNCHANGED) ================= */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenu(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9990] lg:hidden"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-[100dvh] z-[9999] bg-white w-[85%] max-w-sm flex flex-col shadow-2xl lg:hidden"
            >
              <div className="p-6 flex justify-between items-center border-b shrink-0">
                <span className="font-black text-xl uppercase tracking-tight">Menu</span>
                <button
                  onClick={() => setMobileMenu(false)}
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <FiX size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
                <div className="space-y-3">
                    {navLinks.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenu(false)}
                        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-3xl transition-all group"
                    >
                        <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                            <item.icon size={18} />
                        </div>
                        <span className="font-bold text-gray-800">{item.label}</span>
                        </div>
                        <FiArrowRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                   <p className="text-[10px] font-black text-gray-400 uppercase mb-4 ml-2 tracking-widest">Account</p>
                   <Link href="/profile" onClick={() => setMobileMenu(false)} className="flex items-center gap-4 p-4 font-bold text-gray-700 hover:bg-gray-50 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><FiUser /></div>
                      Profile Settings
                   </Link>
                   <Link href="/wishlist" onClick={() => setMobileMenu(false)} className="flex items-center gap-4 p-4 font-bold text-gray-700 hover:bg-gray-50 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><FiHeart /></div>
                      My Wishlist
                   </Link>
                   <Link href="/orders" onClick={() => setMobileMenu(false)} className="flex items-center gap-4 p-4 font-bold text-gray-700 hover:bg-gray-50 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><FiPackage /></div>
                      My Orders
                   </Link>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-white shrink-0 pb-safe">
                <button
                  onClick={handleLogout}
                  className="w-full p-4 bg-rose-50 text-rose-600 rounded-3xl font-black flex justify-center items-center gap-2 hover:bg-rose-100 transition-colors"
                >
                  <FiLogOut /> Logout Account
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}