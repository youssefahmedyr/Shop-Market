export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface ResetPasswordData {
  currentPassword: string
  password: string
  rePassword: string
}

export interface VerifyTokenResponse {
  user: UserProfile
  message: string
}
