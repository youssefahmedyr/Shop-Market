'use client'

import {useCallback} from 'react'
import {useGlobalState} from '../_contexts/global-state-context'
import {Product} from '@/types'
import {CartItem} from '../_api/cart'

// Legacy hook that uses the new global state
export default function useCart() {
  const {state, actions} = useGlobalState()

  const addItem = useCallback(
    async (product: Product) => {
      await actions.addToCart(product._id)
    },
    [actions]
  )

  const removeItem = useCallback(
    async (id: string) => {
      await actions.removeFromCart(id)
    },
    [actions]
  )

  const updateItem = useCallback(
    async (id: string, count: number) => {
      await actions.updateCartItem(id, count)
    },
    [actions]
  )

  const loadCart = useCallback(async () => {
    await actions.refreshCart()
  }, [actions])

  return {
    items: state.cart.items as CartItem[],
    loading: state.cart.loading,
    error: state.cart.error,
    addItem,
    removeItem,
    updateItem,
    loadCart
  }
}
