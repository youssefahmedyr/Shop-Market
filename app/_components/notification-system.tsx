'use client'

import React from 'react'
import {useGlobalState} from '../_contexts/global-state-context'
import {
  FiX,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle
} from 'react-icons/fi'

export function NotificationSystem() {
  const {state, actions} = useGlobalState()

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FiCheck className="text-green-500" />
      case 'error':
        return <FiAlertCircle className="text-red-500" />
      case 'warning':
        return <FiAlertTriangle className="text-yellow-500" />
      case 'info':
        return <FiInfo className="text-blue-500" />
      default:
        return <FiInfo className="text-gray-500" />
    }
  }

  const getStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  if (state.notifications.items.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {state.notifications.items.map((notification) => (
        <div
          key={notification.id}
          className={`
            flex items-start gap-3 p-4 rounded-lg border shadow-lg
            animate-in slide-in-from-right-full
            transition-all duration-300 ease-out
            ${getStyle(notification.type)}
          `}
        >
          <div className="shrink-0 mt-0.5">{getIcon(notification.type)}</div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
            <p className="text-xs opacity-90">{notification.message}</p>
          </div>

          <button
            onClick={() => actions.removeNotification(notification.id)}
            className="shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
