// Type guards and validation utilities for API responses

export interface ApiProduct {
  _id: string
  title: string
  description?: string
  price: number
  imageCover?: string
  images?: string[]
  category?: string
  brand?: string
  ratingsAverage?: number
  ratingsQuantity?: number
  sold?: number
  quantity?: number
  priceAfterDiscount?: number
  colors?: string[]
  availableColors?: Array<{color: string; image?: string}>
  createdAt?: string
  updatedAt?: string
}

export interface ApiWishlistItem {
  _id: string
  product: ApiProduct
  user: string
  createdAt: string
}

export function isValidApiProduct(obj: any): obj is ApiProduct {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj._id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.price === 'number'
  )
}

export function isValidApiWishlistItem(obj: any): obj is ApiWishlistItem {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj._id === 'string' &&
    isValidApiProduct(obj.product) &&
    typeof obj.user === 'string' &&
    typeof obj.createdAt === 'string'
  )
}

export function validateWishlistItems(items: any[]): ApiWishlistItem[] {
  if (!Array.isArray(items)) return []
  return items.filter(isValidApiWishlistItem)
}

export function validateApiResponse<T>(
  data: any,
  validator: (obj: any) => obj is T
): T[] {
  if (!Array.isArray(data)) return []
  return data.filter(validator)
}
