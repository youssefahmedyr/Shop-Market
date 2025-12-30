'use client'

import {useState, useEffect} from 'react'
import {User, getUserProfile} from '../_api/auth'
import {useSession} from 'next-auth/react'

export function useUserProfile() {
  const {data: session, status} = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only fetch user data if user is authenticated
    if (status === 'authenticated' && session?.accessToken) {
      fetchUserProfile()
    } else if (status === 'unauthenticated') {
      // Clear user data when logged out
      setUser(null)
      setError(null)
    }
  }, [status, session])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const userData = await getUserProfile()
      setUser(userData)
    } catch (err: any) {
      console.error('Error fetching user profile:', err)
      setError(err?.response?.data?.message || 'Failed to fetch user profile')
      // Don't clear user on error, keep existing data
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    if (status === 'authenticated') {
      fetchUserProfile()
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated: status === 'authenticated',
    isAuthLoading: status === 'loading',
    refetch
  }
}
