'use client'

import React from 'react'
import {useGlobalState} from '../_contexts/global-state-context'
import {FiWifi, FiWifiOff, FiRefreshCw, FiCheck} from 'react-icons/fi'

export function SyncStatus() {
  const {state} = useGlobalState()

  const getStatusColor = () => {
    if (state.cart.loading || state.user.loading) {
      return 'text-yellow-500'
    }
    if (state.cart.error || state.user.error) {
      return 'text-red-500'
    }
    return 'text-green-500'
  }

  const getStatusIcon = () => {
    if (state.cart.loading || state.user.loading) {
      return <FiRefreshCw className="animate-spin" />
    }
    if (state.cart.error || state.user.error) {
      return <FiWifiOff />
    }
    return <FiCheck />
  }

  const getStatusText = () => {
    if (state.cart.loading || state.user.loading) {
      return 'Syncing...'
    }
    if (state.cart.error || state.user.error) {
      return 'Sync Error'
    }
    return 'Synced'
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 text-xs shadow-lg z-40">
      <div className={getStatusColor()}>{getStatusIcon()}</div>
      <span className="text-slate-600 font-medium">{getStatusText()}</span>
      <div className="text-slate-400">
        Cart: {Array.isArray(state.cart.items) ? state.cart.items.length : 0}{' '}
        items
      </div>
    </div>
  )
}
