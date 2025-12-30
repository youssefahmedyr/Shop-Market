import toast from 'react-hot-toast'
import {
  ShippingAddress,
  SingleOrderResponse,
  OrderResponse
} from '../interfaces'
import Api from './api'

export const createOrder = async (
  cartId: string,
  shippingAddress: ShippingAddress
): Promise<SingleOrderResponse> => {
  const api = Api()
  try {
    const response = await api.post(`/orders/${cartId}`, {
      shippingAddress
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create order')
  }
}

export const getUserOrders = async (): Promise<OrderResponse> => {
  const api = Api()
  const userId = await api
    .get('/auth/verifyToken')
    .then((res) => res.data.decoded.id)
    .catch((err) => toast.error(err))

  console.log(userId)

  try {
    const response = await api.get(`/orders/user/${userId}`)
    return response
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders')
  }
}

export const getOrderById = async (
  orderId: string
): Promise<SingleOrderResponse> => {
  const api = Api()
  try {
    const response = await api.get(`/orders/${orderId}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order')
  }
}

export const updateOrderStatus = async (
  orderId: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<SingleOrderResponse> => {
  const api = Api()
  try {
    const response = await api.patch(`/orders/${orderId}`, {status})
    return response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to update order status'
    )
  }
}

export const createCheckoutSession = async (
  cartId: string,
  returnUrl: string,
  data: {}
): Promise<{session: {url: string}}> => {
  const api = Api()
  try {
    const response = await api.post(
      `/orders/checkout-session/${cartId}`,
      data,
      {
        params: {url: returnUrl}
      }
    )
    return response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to create checkout session'
    )
  }
}
