import {Product} from './product'

export interface ApiResponse<T = any> {
  status: string
  data: T
  message?: string
}

export interface PaginatedResponse<T = any> {
  status: string
  results: number
  data: T[]
}

export interface ErrorResponse {
  status: string
  message: string
  error?: string
}

export interface WishlistItem {
  _id: string
  product: Product
  user: string
  createdAt: string
}

export interface Address {
  _id: string
  user: string
  alias: string
  details: string
  phone: string
  city: string
  postalCode?: string
  isDefault?: boolean
  createdAt: string
  updatedAt: string
}

export interface FilterOptions {
  category: string[]
  subcategory: string[]
  brand: string[]
  minPrice?: string
  maxPrice?: string
  inStock: boolean
  sortBy: string
  search: string
}
