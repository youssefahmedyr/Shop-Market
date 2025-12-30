// app/_components/ui/toast.tsx
'use client'

import * as React from 'react'
import {X} from 'lucide-react'
import {cva, type VariantProps} from 'class-variance-authority'
import {cn} from '@/lib/utils'

const toastVariants = cva(
  'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-10 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'bg-white text-slate-900 border-slate-200',
        destructive: 'bg-red-50 text-red-900 border-red-200',
        success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        warning: 'bg-amber-50 text-amber-900 border-amber-200',
        info: 'bg-blue-50 text-blue-900 border-blue-200'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  onDismiss?: () => void
  className?: string
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({className, variant, title, description, onDismiss, ...props}, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({variant}), className)}
        role="alert"
        {...props}
      >
        <div className="flex-1">
          {title && <p className="font-medium text-sm">{title}</p>}
          {description && (
            <p className="text-sm opacity-90 mt-1">{description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-md p-1 text-slate-500 opacity-0 transition-opacity hover:text-slate-900 focus:opacity-100 focus:outline-none group-hover:opacity-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }
)

Toast.displayName = 'Toast'

export {Toast, toastVariants}

type ToastActionElement = React.ReactElement<typeof Toast>

export type {ToastActionElement}
