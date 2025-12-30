import {Product} from './product'
import {User} from './user'

export interface CartItem {
  _id: string
  product: Product
  count: number
  price: number
}

export interface Cart {
  _id: string
  cartItems: CartItem[]
  totalCartPrice: number
  totalCartPriceAfterDiscount?: number
  user: string | User
  createdAt: string
  updatedAt: string
}

export interface CartResponse {
  status: string
  data: Cart
}

export interface AddToCartResponse {
  status: string
  data: Cart
}

export interface UpdateCartRequest {
  count: number
}

export interface UpdateCartResponse {
  status: string
  data: Cart
}
