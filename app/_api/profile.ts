import Api from './api'
import {
  getUserProfile as getAuthCurrentUser,
  verifyToken as authVerifyToken
} from './auth'
import {UserProfile, VerifyTokenResponse} from '@/app/interfaces'

export const verifyToken = authVerifyToken
export const getCurrentUser = getAuthCurrentUser
