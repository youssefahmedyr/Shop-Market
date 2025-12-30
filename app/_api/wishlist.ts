// API functions for wishlist operations
import Api from './api'

import {Product} from './products'

export interface WishlistItem {
  _id: string
  product: Product
  user: string
  createdAt: string
}

// Get user's wishlist
export async function getWishlist(): Promise<{
  data: WishlistItem[]
  count: number
}> {
  const api = Api()
  try {
    const response = await api.get('/wishlist')
    return response.data
  } catch (error) {
    throw error
  }
}

// Add product to wishlist
export async function addToWishlist(productId: string): Promise<WishlistItem> {
  try {
    const response = await Api().post('/wishlist', {productId})
    return response.data.data
  } catch (error) {
    throw error
  }
}

// Remove item from wishlist
export async function removeFromWishlist(itemId: string): Promise<void> {
  try {
    await Api().delete(`/wishlist/${itemId}`)
  } catch (error) {
    throw error
  }
}
