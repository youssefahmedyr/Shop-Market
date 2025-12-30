'use client'

import {ReactNode, createContext, useContext} from 'react'
import {useUserProfile} from '../_hooks/useUserProfile'

interface ProfileContextType {
  user: any
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  isAuthLoading: boolean
  refetch: () => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

interface ProfileProviderProps {
  children: ReactNode
}

export function ProfileProvider({children}: ProfileProviderProps) {
  const userProfile = useUserProfile()

  return (
    <ProfileContext.Provider value={userProfile}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
