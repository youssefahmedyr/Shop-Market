import Api from './api'
import {Product} from '@/types'

export type CartItem = {
  _id: string
  count: number
  price: number
  product: Product
}

export type CartResponse = {
  status: string
  numOfCartItems: number
  data: {
    _id: string
    cartOwner: string
    totalCartPrice: number
    products: CartItem[]
  }
}

export async function addToCart(productId: string): Promise<CartResponse> {
  const api = Api()
  const res = await api.post<CartResponse>('/cart', {productId})
  return res.data
}

export async function getCart(): Promise<CartResponse> {
  const api = Api()
  const res = await api.get<CartResponse>('/cart')
  return res.data
}

export async function updateCartItemCount(
  itemId: string,
  count: number
): Promise<CartResponse> {
  const api = Api()
  const res = await api.put<CartResponse>(`/cart/${itemId}`, {count})
  return res.data
}

export async function removeCartItem(itemId: string): Promise<CartResponse> {
  const api = Api()
  const res = await api.delete<CartResponse>(`/cart/${itemId}`)
  return res.data
}

export async function clearCart(): Promise<CartResponse> {
  const api = Api()
  const res = await api.delete<CartResponse>('/cart')
  return res.data
}
