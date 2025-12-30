'use client'

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode
} from 'react'
import {Product} from '@/types'
import {
  addToCart as apiAddToCart,
  getCart,
  removeCartItem,
  updateCartItemCount
} from '../_api/cart'
import {getUserProfile} from '../_api/auth'

// Types
interface CartItem {
  _id: string
  product: Product
  count: number
  price: number
}

interface User {
  id: string
  name: string
  email: string
  role?: string
  phone?: string
  addresses?: any[]
}

interface GlobalState {
  cart: {
    items: CartItem[]
    loading: boolean
    error: string | null
    total: number
  }
  user: {
    profile: User | null
    loading: boolean
    error: string | null
  }
  products: {
    items: Product[]
    loading: boolean
    error: string | null
  }
  notifications: {
    items: Notification[]
    unreadCount: number
  }
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
  autoClose?: boolean
}

type GlobalAction =
  | {type: 'SET_CART_LOADING'; payload: boolean}
  | {type: 'SET_CART_ERROR'; payload: string | null}
  | {type: 'SET_CART_ITEMS'; payload: CartItem[]}
  | {type: 'ADD_TO_CART'; payload: CartItem}
  | {type: 'UPDATE_CART_ITEM'; payload: {id: string; count: number}}
  | {type: 'REMOVE_FROM_CART'; payload: string}
  | {type: 'SET_USER_LOADING'; payload: boolean}
  | {type: 'SET_USER_ERROR'; payload: string | null}
  | {type: 'SET_USER_PROFILE'; payload: User | null}
  | {type: 'SET_PRODUCTS_LOADING'; payload: boolean}
  | {type: 'SET_PRODUCTS_ERROR'; payload: string | null}
  | {type: 'SET_PRODUCTS'; payload: Product[]}
  | {type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'>}
  | {type: 'REMOVE_NOTIFICATION'; payload: string}
  | {type: 'MARK_NOTIFICATIONS_READ'}

const initialState: GlobalState = {
  cart: {
    items: [],
    loading: false,
    error: null,
    total: 0
  },
  user: {
    profile: null,
    loading: false,
    error: null
  },
  products: {
    items: [],
    loading: false,
    error: null
  },
  notifications: {
    items: [],
    unreadCount: 0
  }
}

function globalReducer(state: GlobalState, action: GlobalAction): GlobalState {
  switch (action.type) {
    case 'SET_CART_LOADING':
      return {
        ...state,
        cart: {...state.cart, loading: action.payload}
      }

    case 'SET_CART_ERROR':
      return {
        ...state,
        cart: {...state.cart, error: action.payload}
      }

    case 'SET_CART_ITEMS':
      const cartItems = Array.isArray(action.payload) ? action.payload : []
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.count,
        0
      )
      return {
        ...state,
        cart: {...state.cart, items: cartItems, total, error: null}
      }

    case 'ADD_TO_CART':
      const existingItem = state.cart.items.find(
        (item) => item._id === action.payload._id
      )
      let newItems: CartItem[]

      if (existingItem) {
        newItems = state.cart.items.map((item) =>
          item._id === action.payload._id
            ? {...item, count: item.count + 1}
            : item
        )
      } else {
        newItems = [...state.cart.items, action.payload]
      }

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.count,
        0
      )
      return {
        ...state,
        cart: {...state.cart, items: newItems, total: newTotal}
      }

    case 'UPDATE_CART_ITEM':
      const updatedItems = state.cart.items.map((item) =>
        item._id === action.payload.id
          ? {...item, count: action.payload.count}
          : item
      )
      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.count,
        0
      )
      return {
        ...state,
        cart: {...state.cart, items: updatedItems, total: updatedTotal}
      }

    case 'REMOVE_FROM_CART':
      const filteredItems = state.cart.items.filter(
        (item) => item._id !== action.payload
      )
      const filteredTotal = filteredItems.reduce(
        (sum, item) => sum + item.price * item.count,
        0
      )
      return {
        ...state,
        cart: {...state.cart, items: filteredItems, total: filteredTotal}
      }

    case 'SET_USER_LOADING':
      return {
        ...state,
        user: {...state.user, loading: action.payload}
      }

    case 'SET_USER_ERROR':
      return {
        ...state,
        user: {...state.user, error: action.payload}
      }

    case 'SET_USER_PROFILE':
      return {
        ...state,
        user: {...state.user, profile: action.payload, error: null}
      }

    case 'SET_PRODUCTS_LOADING':
      return {
        ...state,
        products: {...state.products, loading: action.payload}
      }

    case 'SET_PRODUCTS_ERROR':
      return {
        ...state,
        products: {...state.products, error: action.payload}
      }

    case 'SET_PRODUCTS':
      return {
        ...state,
        products: {...state.products, items: action.payload, error: null}
      }

    case 'ADD_NOTIFICATION':
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
        autoClose: action.payload.autoClose !== false
      }
      return {
        ...state,
        notifications: {
          items: [...state.notifications.items, notification],
          unreadCount: state.notifications.unreadCount + 1
        }
      }

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: {
          items: state.notifications.items.filter(
            (n) => n.id !== action.payload
          ),
          unreadCount: Math.max(0, state.notifications.unreadCount - 1)
        }
      }

    case 'MARK_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          unreadCount: 0
        }
      }

    default:
      return state
  }
}

// Context
const GlobalStateContext = createContext<{
  state: GlobalState
  dispatch: React.Dispatch<GlobalAction>
  actions: {
    // Cart actions
    addToCart: (productId: string) => Promise<void>
    removeFromCart: (itemId: string) => Promise<void>
    updateCartItem: (itemId: string, count: number) => Promise<void>
    refreshCart: () => Promise<void>

    // User actions
    refreshUserProfile: () => Promise<void>

    // Products actions
    refreshProducts: () => Promise<void>

    // Notification actions
    addNotification: (
      notification: Omit<Notification, 'id' | 'timestamp'>
    ) => void
    removeNotification: (id: string) => void
    markNotificationsRead: () => void
  }
} | null>(null)

// Provider
export function GlobalStateProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(globalReducer, initialState)

  // Auto-refresh cart periodically - DISABLED to prevent infinite loops
  // useEffect(() => {
  //   if (!state.user.profile) return // Only refresh if user is logged in

  //   const interval = setInterval(() => {
  //     if (!state.cart.loading) {
  //       refreshCart()
  //     }
  //   }, 300000) // Refresh every 5 minutes instead of 30 seconds

  //   return () => clearInterval(interval)
  // }, [state.user.profile]) // Only depend on user profile, not cart loading

  // Auto-refresh user profile periodically - DISABLED to prevent infinite loops
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!state.user.loading && state.user.profile) {
  //       refreshUserProfile()
  //     }
  //   }, 60000) // Refresh every minute

  //   return () => clearInterval(interval)
  // }, [state.user.loading, state.user.profile])

  // Auto-remove notifications
  useEffect(() => {
    state.notifications.items.forEach((notification) => {
      if (notification.autoClose) {
        const timeout = setTimeout(() => {
          dispatch({type: 'REMOVE_NOTIFICATION', payload: notification.id})
        }, 5000) // Auto-close after 5 seconds

        return () => clearTimeout(timeout)
      }
    })
  }, [state.notifications.items])

  // Actions
  const addToCart = async (productId: string) => {
    try {
      dispatch({type: 'SET_CART_LOADING', payload: true})

      // Optimistic update
      const product = state.products.items.find((p) => p._id === productId)
      if (product) {
        const optimisticItem: CartItem = {
          _id: `temp-${Date.now()}`,
          product,
          count: 1,
          price: product.priceAfterDiscount || product.price
        }
        dispatch({type: 'ADD_TO_CART', payload: optimisticItem})
      }

      await apiAddToCart(productId)
      await refreshCart()

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'success',
          title: 'Added to Cart',
          message: 'Product has been added to your cart successfully'
        }
      })
    } catch (error) {
      await refreshCart() // Revert optimistic update
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'error',
          title: 'Failed to Add',
          message: 'Could not add product to cart. Please try again.'
        }
      })
    } finally {
      dispatch({type: 'SET_CART_LOADING', payload: false})
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      dispatch({type: 'SET_CART_LOADING', payload: true})
      await removeCartItem(itemId)
      await refreshCart()

      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'info',
          title: 'Removed from Cart',
          message: 'Product has been removed from your cart'
        }
      })
    } catch (error) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'error',
          title: 'Failed to Remove',
          message: 'Could not remove product from cart. Please try again.'
        }
      })
    } finally {
      dispatch({type: 'SET_CART_LOADING', payload: false})
    }
  }

  const updateCartItem = async (itemId: string, count: number) => {
    try {
      dispatch({type: 'SET_CART_LOADING', payload: true})
      await updateCartItemCount(itemId, count)
      await refreshCart()
    } catch (error) {
      await refreshCart() // Revert
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          type: 'error',
          title: 'Failed to Update',
          message: 'Could not update cart quantity. Please try again.'
        }
      })
    } finally {
      dispatch({type: 'SET_CART_LOADING', payload: false})
    }
  }

  const refreshCart = async () => {
    try {
      dispatch({type: 'SET_CART_LOADING', payload: true})
      const cartData = await getCart()
      const cartItems = Array.isArray(cartData?.data?.products)
        ? cartData.data.products
        : []
      dispatch({type: 'SET_CART_ITEMS', payload: cartItems})
    } catch (error) {
      dispatch({type: 'SET_CART_ERROR', payload: 'Failed to load cart'})
      dispatch({type: 'SET_CART_ITEMS', payload: []}) // Set empty array on error
    } finally {
      dispatch({type: 'SET_CART_LOADING', payload: false})
    }
  }

  const refreshUserProfile = async () => {
    try {
      dispatch({type: 'SET_USER_LOADING', payload: true})
      const userProfile = await getUserProfile()
      dispatch({type: 'SET_USER_PROFILE', payload: userProfile})
    } catch (error) {
      dispatch({type: 'SET_USER_ERROR', payload: 'Failed to load profile'})
    } finally {
      dispatch({type: 'SET_USER_LOADING', payload: false})
    }
  }

  const refreshProducts = async () => {
    // This would be implemented based on your products API
    // For now, it's a placeholder
  }

  const addNotification = (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => {
    dispatch({type: 'ADD_NOTIFICATION', payload: notification})
  }

  const removeNotification = (id: string) => {
    dispatch({type: 'REMOVE_NOTIFICATION', payload: id})
  }

  const markNotificationsRead = () => {
    dispatch({type: 'MARK_NOTIFICATIONS_READ'})
  }

  const actions = {
    addToCart,
    removeFromCart,
    updateCartItem,
    refreshCart,
    refreshUserProfile,
    refreshProducts,
    addNotification,
    removeNotification,
    markNotificationsRead
  }

  const context = {
    state,
    dispatch,
    actions
  }

  return (
    <GlobalStateContext.Provider value={context}>
      {children}
    </GlobalStateContext.Provider>
  )
}

// Hook
export function useGlobalState() {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}
