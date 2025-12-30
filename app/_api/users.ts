import Api from './api'
import {getUserProfile as getAuthCurrentUser} from './auth'
import {
  User,
  UpdateProfileData,
  ChangePasswordData,
  ResetPasswordData
} from '@/app/interfaces'
import {toast} from 'react-hot-toast'

const api = Api()

export const getAllUsers = () => {
  return api
    .get('/users')
    .then((res) => res.data)
    .catch((err) => {})
}

export const resetPassword = async (data: ResetPasswordData) => {
  try {
    const response = await api.put('/users/changeMyPassword', data)
    toast.success('Password reset successfully')
    return response.data
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to reset password')
    throw error
  }
}

export const updateUserProfile = async (data: UpdateProfileData) => {
  try {
    const response = await api.put('/users/updateMe', data)
    toast.success('Profile updated successfully')
    return response.data
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to update profile')
    throw error
  }
}

export const getCurrentUser = getAuthCurrentUser

export const updateProfile = async (userData: UpdateProfileData) => {
  const api = Api()
  const {data} = await api.put<User>('/users/profile', userData)
  return data
}

export const changePassword = async (passwordData: ChangePasswordData) => {
  const api = Api()
  const {data} = await api.put<{message: string}>(
    '/users/change-password',
    passwordData
  )
  return data
}

export const deleteAccount = async () => {
  const api = Api()
  const {data} = await api.delete<{message: string}>('/users/account')
  return data
}
