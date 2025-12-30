export interface Product {
  name: ReactNode
  name: string
  id: string
  _id: string
  title: string
  description: string
  quantity: number
  sold: number
  price: number
  priceAfterDiscount?: number
  colors: string[]
  imageCover: string
  images: string[]
  category: {
    _id: string
    name: string
    slug: string
    image?: string
  }
  brand?: {
    _id: string
    name: string
    slug: string
    image?: string
  }
  subcategory?: Array<{
    _id: string
    name: string
    slug: string
    category: string
  }>
  ratingsAverage: number
  ratingsQuantity: number
  createdAt: string
  updatedAt: string
  slug: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface Brand {
  _id: string
  name: string
  slug: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  _id: string
  product: Product
  price: number
  quantity: number
}

export interface Cart {
  _id: string
  cartItems: CartItem[]
  totalCartPrice: number
  totalPriceAfterDiscount?: number
  user: string
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  profileImg?: string
  role: 'user' | 'admin'
  active: boolean
  wishlist: string[]
  addresses: Address[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  _id: string
  alias: string
  details: string
  phone: string
  city: string
  postalCode?: string
  isDefault: boolean
}

export interface ApiResponse<T> {
  status: string
  results?: number
  pagination?: {
    currentPage: number
    limit: number
    numberOfPages: number
  }
  data: T
}

export interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message: string
}
