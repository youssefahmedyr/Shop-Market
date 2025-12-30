import {CartItem} from './cart'
import {Product} from './product'
import {User} from './user'

export interface ShippingAddress {
  details: string
  phone: string
  city: string
  postalCode?: string
}

export interface OrderItem {
  _id: string
  product: Product
  quantity: number
  price: number
}

export interface Order {
  _id: string
  id?: number
  totalOrderPrice: number
  isPaid: boolean
  isDelivered: boolean
  shippingAddress: {
    phone: string
    city: string
    details?: string
  }
  paymentMethodType: 'cash' | 'card'
  createdAt: string
  updatedAt: string
  cartItems: CartItem[]
  user?: {
    name: string
    email: string
    phone: string
  }
  taxPrice?: number
  shippingPrice?: number
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}

export interface OrderResponse {
  status: number
  data: Order[]
}

export interface SingleOrderResponse {
  status: string
  data: Order
}

export interface CheckoutSessionData {
  session: {
    url: string
    sessionId: string
  }
}
