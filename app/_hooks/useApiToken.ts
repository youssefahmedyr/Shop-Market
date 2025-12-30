'use client'

import {useSession} from 'next-auth/react'
import {useEffect} from 'react'
import {getToken} from 'next-auth/jwt'

export function useApiToken() {
  const {data: session} = useSession()

  useEffect(() => {
    // Update API interceptor with session token using getToken
    const updateApiToken = async () => {
      try {
        // Use session data directly since getToken is server-side only
        if (session?.accessToken) {
          // Store token in a global variable for API calls
          ;(window as any).__apiToken = session.accessToken
        } else {
          delete (window as any).__apiToken
        }
      } catch (error) {
        console.error('Error updating API token:', error)
        delete (window as any).__apiToken
      }
    }

    updateApiToken()
  }, [session])

  return session?.accessToken
}
