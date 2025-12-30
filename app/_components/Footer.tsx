'use client'

import Link from 'next/link'
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowUpRight,
  FiYoutube
} from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white pt-20 pb-10 rounded-t-[3rem] md:rounded-t-[5rem] overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-8 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* 1. BRAND IDENTITY */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <span className="text-black font-black text-2xl italic">S</span>
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase italic">
                Shop <span className="text-white/50">Market</span>
              </span>
            </div>
            
            <p className="text-[#86868b] text-sm leading-relaxed max-w-xs font-medium">
              Elevating your lifestyle with a curated collection of premium essentials. Quality you can feel, design you can see.
            </p>

            <div className="flex gap-4">
              {[
                { icon: <FiFacebook />, href: "#" },
                { icon: <FiInstagram />, href: "#" },
                { icon: <FiTwitter />, href: "#" },
                { icon: <FiYoutube />, href: "#" },
              ].map((social, idx) => (
                <Link 
                  key={idx} 
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-black hover:bg-white transition-all duration-300"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* 2. NAVIGATION */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-white/40">Navigation</h3>
            <ul className="space-y-4">
              {['All Products', 'Categories', 'Featured Picks', 'Brands'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="group flex items-center text-sm font-bold text-[#86868b] hover:text-white transition-colors">
                    {item}
                    <FiArrowUpRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. SUPPORT */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-white/40">Support</h3>
            <ul className="space-y-4">
              {['Contact Us', 'Shipping Policy', 'Return Center', 'F.A.Q'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="group flex items-center text-sm font-bold text-[#86868b] hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. CONTACT & HQ */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-white/40">Contact</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 text-white/30"><FiMail /></div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-1">Email us</p>
                  <p className="text-sm font-bold">hello@shopmarket.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 text-white/30"><FiMapPin /></div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-1">Visit us</p>
                  <p className="text-sm font-bold leading-snug">
                    123 Design District<br />Creative City, CC 90210
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#86868b] text-[10px] font-bold uppercase tracking-widest">
            © {currentYear} SHOP MARKET — DESIGNED FOR THE FUTURE.
          </p>
          
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}