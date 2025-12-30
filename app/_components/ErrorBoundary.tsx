'use client'

import React, {Component, ErrorInfo, ReactNode} from 'react'
import {FiAlertTriangle, FiRefreshCw, FiInfo, FiX} from 'react-icons/fi'
import {motion} from 'framer-motion'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<{error: Error | null; resetError: () => void}>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
  className?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {hasError: true, error}
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({errorInfo})
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    })
  }

  toggleDetails = () => {
    this.setState((prev) => ({
      showDetails: !prev.showDetails
    }))
  }

  render() {
    const {hasError, error, errorInfo, showDetails} = this.state
    const {
      children,
      fallback: FallbackComponent,
      showDetails: showDetailsProp = true
    } = this.props

    if (hasError) {
      if (FallbackComponent) {
        return <FallbackComponent error={error} resetError={this.resetError} />
      }

      return (
        <div
          className={`min-h-screen flex items-center justify-center bg-slate-50 p-4 ${
            this.props.className || ''
          }`}
        >
          <motion.div
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-rose-500 p-4 text-white flex items-center">
              <FiAlertTriangle className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">An Error Occurred</h2>
            </div>

            <div className="p-6">
              <div className="flex items-start">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <FiAlertTriangle className="w-6 h-6 text-rose-500" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-900">
                    Something went wrong
                  </h3>
                  <p className="mt-1 text-slate-600">
                    We're sorry, but we encountered an error. Please try again.
                  </p>
                </div>
              </div>

              {showDetailsProp && error && (
                <div className="mt-6">
                  <button
                    onClick={this.toggleDetails}
                    className="flex items-center text-sm font-medium text-rose-600 hover:text-rose-700"
                  >
                    {showDetails ? (
                      <>
                        <FiX className="ml-1 w-4 h-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <FiInfo className="ml-1 w-4 h-4" />
                        Show Error Details
                      </>
                    )}
                  </button>

                  {showDetails && (
                    <motion.div
                      initial={{height: 0, opacity: 0}}
                      animate={{height: 'auto', opacity: 1}}
                      className="mt-2 overflow-hidden"
                    >
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                        <h4 className="font-medium text-slate-900 mb-2">
                          Error Details:
                        </h4>
                        <pre className="text-xs p-3 bg-slate-100 rounded overflow-auto max-h-48">
                          {error.toString()}
                          {errorInfo?.componentStack}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                {showDetailsProp && (
                  <button
                    onClick={this.toggleDetails}
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                )}
                <button
                  onClick={this.resetError}
                  className="px-6 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors flex items-center justify-center"
                >
                  <FiRefreshCw className="mr-2 w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary
