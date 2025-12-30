'use client'

import React from 'react'
import {Alert, AlertDescription} from './alert'
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle
} from 'react-icons/fi'

export interface LogEntry {
  id: string
  type: 'error' | 'success' | 'warning' | 'info'
  message: string
  timestamp?: Date
}

interface LoggerProps {
  logs: LogEntry[]
  onDismiss?: (id: string) => void
  className?: string
}

const Logger: React.FC<LoggerProps> = ({logs, onDismiss, className}) => {
  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'error':
        return <FiAlertCircle className="h-4 w-4" />
      case 'success':
        return <FiCheckCircle className="h-4 w-4" />
      case 'warning':
        return <FiAlertTriangle className="h-4 w-4" />
      case 'info':
        return <FiInfo className="h-4 w-4" />
    }
  }

  const getVariant = (type: LogEntry['type']) => {
    switch (type) {
      case 'error':
        return 'destructive' as const
      case 'success':
        return 'success' as const
      case 'warning':
        return 'warning' as const
      case 'info':
        return 'info' as const
    }
  }

  if (logs.length === 0) return null

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {logs.map((log) => (
        <Alert key={log.id} variant={getVariant(log.type)}>
          <div className="flex items-start gap-2">
            {getIcon(log.type)}
            <AlertDescription className="flex-1">
              {log.message}
            </AlertDescription>
            {onDismiss && (
              <button
                onClick={() => onDismiss(log.id)}
                className="text-current/60 hover:text-current ml-2"
                aria-label="Dismiss"
              >
                ×
              </button>
            )}
          </div>
        </Alert>
      ))}
    </div>
  )
}

export default Logger