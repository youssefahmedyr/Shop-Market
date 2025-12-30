export interface Product {
  _id: string
  title: string
  slug: string
  description?: string
  quantity: number
  sold: number
  price: number
  priceAfterDiscount?: number
  imageCover: string
  images?: string[]
  category: string | Category
  subcategory: string | SubCategory
  brand?: string | Brand
  ratingsAverage?: number
  ratingsQuantity?: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface SubCategory {
  _id: string
  name: string
  slug: string
  category: string
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

export interface AvailableColor {
  color: string
  _id: string
}

export interface GlobalProduct extends Product {
  id: string
  colors: string[]
}
