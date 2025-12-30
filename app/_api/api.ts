import axios from 'axios'
import {config, apiEndpoints, requestTypes} from '@/lib/config'
import {getToken} from 'next-auth/jwt'
import {toast} from 'react-hot-toast'

let activeRequests = 0
const loadingListeners = new Set<(count: number) => void>()

function notifyLoading() {
  for (const listener of loadingListeners) {
    listener(activeRequests)
  }
}

export function subscribeToLoading(listener: (count: number) => void) {
  loadingListeners.add(listener)
  listener(activeRequests)
}

export function unsubscribeFromLoading(listener: (count: number) => void) {
  loadingListeners.delete(listener)
}

export default function Api(baseURL?: string) {
  const finalBaseUrl = baseURL || apiEndpoints.proxy.base

  const api = axios.create({
    baseURL: finalBaseUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  api.interceptors.request.use(async (config) => {
    activeRequests += 1
    notifyLoading()

    let token = ''

    try {
      if (typeof window !== 'undefined') {
        token = (window as any).__apiToken || ''
      }
    } catch (error) {
      // Error handled silently in response interceptor
    }

    if (token) {
      config.headers.token = token
    }

    return config
  })

  api.interceptors.response.use(
    (response) => {
      activeRequests -= 1
      notifyLoading()
      return response
    },
    (error) => {
      activeRequests -= 1
      notifyLoading()

      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const message = error.response.data?.message || 'An error occurred'

        switch (status) {
          case 401:
            toast.error('Unauthorized: Please login again')
            break
          case 403:
            toast.error('Forbidden: You do not have permission')
            break
          case 404:
            toast.error('Not found: The requested resource was not found')
            break
          case 422:
            toast.error(`Validation error: ${message}`)
            break
          case 500:
            toast.error('Server error: Please try again later')
            break
          default:
            toast.error(`Error: ${message}`)
        }
      } else if (error.request) {
        // Network error
        toast.error('Network error: Please check your connection')
      } else {
        // Other error
        toast.error('An unexpected error occurred')
      }

      return Promise.reject(error)
    }
  )

  return api
}

export function getApiUrl(endpoint: string): string {
  if (requestTypes.auth.includes(endpoint)) {
    return apiEndpoints.auth[endpoint as keyof typeof apiEndpoints.auth]
  }
  return (
    apiEndpoints.proxy[endpoint as keyof typeof apiEndpoints.proxy] ||
    apiEndpoints.proxy.base
  )
}
