'use client'

import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { motion } from 'framer-motion'


interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export default function LoadingSpinner({
  size = 'md',
  text = 'LOADING...',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-6 ${className}`}>

      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 bg-black rounded-2xl animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FiShoppingCart className="text-white animate-bounce" size={size === 'sm' ? 16 : 24} />
        </div>
        <div className={`absolute inset-0 border-2 border-black rounded-2xl animate-ping opacity-20`}></div>
      </div>

      <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-[0.3em]">
        {text}
      </p>
    </div>
  )
}


interface LoadingCardProps {
  type?: 'product' | 'category' | 'brand' | 'cart'
  count?: number
  className?: string
}

export function LoadingCard({
  type = 'product',
  count = 1,
  className = ''
}: LoadingCardProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return (
          <div className="animate-pulse flex flex-col">
            <div className="aspect-square bg-gray-100 rounded-[2rem] mb-4"></div>
            <div className="space-y-3 px-2">
              <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
              <div className="h-3 bg-gray-50 rounded-full w-1/2"></div>
            </div>
          </div>
        )
      case 'category':
        return (
          <div className="animate-pulse">
            <div className="h-64 w-full bg-gray-100 rounded-[2.5rem] mb-4"></div>
            <div className="h-4 bg-gray-100 rounded-full w-1/2 mx-auto"></div>
          </div>
        )
      case 'brand':
        return (
          <div className="animate-pulse p-4 bg-gray-50 rounded-[2rem]">
            <div className="h-20 w-20 bg-white rounded-2xl mx-auto mb-4 shadow-sm"></div>
            <div className="h-3 bg-gray-200 rounded-full w-2/3 mx-auto"></div>
          </div>
        )
      case 'cart':
        return (
          <div className="flex gap-4 bg-gray-50 rounded-[2rem] p-5 items-center animate-pulse">
            <div className="h-20 w-20 rounded-2xl bg-white shrink-0 shadow-sm"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded-full w-1/2"></div>
            </div>
            <div className="w-16 h-8 bg-white rounded-full"></div>
          </div>
        )
      default:
        return (
          <div className="animate-pulse bg-gray-50 rounded-[2rem] h-32 w-full"></div>
        )
    }
  }

  if (count === 1) {
    return <div className={className}>{renderSkeleton()}</div>
  }

  return (
    <div className={`${className} grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}

// --- Full Page Loading Component ---
export function FullPageLoading({ text = 'PREPARING YOUR SHOPPING' }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-[10000] bg-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <LoadingSpinner size="lg" text={text} />
      </motion.div>
    </div>
  )
}