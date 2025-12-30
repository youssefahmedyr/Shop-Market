'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch, FiX } from 'react-icons/fi'
import { getAllProducts } from '@/app/_api/products'
import { Product } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

interface SearchBarProps {
  isMobile?: boolean
}

export default function SearchBar({ isMobile = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const { data } = await getAllProducts()
        const filtered = data.filter(
          (product) =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description?.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered.slice(0, 5))
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`)
      setIsOpen(false)
    }
  }

  const handleProductClick = (productId: string) => {
    setIsOpen(false)
    setQuery('')
    router.push(`/products/${productId}`)
  }

  return (
    <div ref={searchRef} className={`relative w-full ${isMobile ? '' : 'max-w-md'}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products..."
            className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setResults([])
                setIsOpen(false)
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {isOpen && (query.length >= 2 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-slate-500">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500"></div>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2 border-b border-slate-100">
                <p className="text-xs text-slate-500 font-medium">Products</p>
              </div>
              {results.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  onClick={() => handleProductClick(product._id)}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-900 truncate">
                      {product.title}
                    </h4>
                    <p className="text-sm text-rose-500 font-semibold">
                      ${product.price}
                    </p>
                  </div>
                </Link>
              ))}
              <div className="p-2 border-t border-slate-100">
                <button
                  onClick={handleSearch}
                  className="w-full text-center text-sm text-rose-500 hover:text-rose-600 font-medium"
                >
                  View all results for "{query}"
                </button>
              </div>
            </>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-slate-500">
              <p className="text-sm">No products found</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
