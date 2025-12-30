import {ForgetPasswordPayload} from '../interfaces'
import Api from './api'

export interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  addresses?: any[]
  createdAt: string
  updatedAt: string
}

export interface VerifyTokenResponse {
  message: string
  user: User
}

export async function verifyToken(): Promise<VerifyTokenResponse> {
  const api = Api()
  try {
    const response = await api.get('/auth/verifyToken')

    if (!response.data || Object.keys(response.data).length === 0) {
      throw new Error('Invalid token or expired session')
    }

    let userData = response.data
    if (response.data.data && response.data.data.user) {
      userData = response.data.data
    } else if (response.data.user) {
      userData = response.data
    } else if (
      response.data.decoded &&
      (response.data.decoded.id ||
        response.data.decoded.name ||
        response.data.decoded.email)
    ) {
      userData = {message: 'User found', user: response.data.decoded}
    } else if (response.data.id || response.data.name || response.data.email) {
      userData = {message: 'User found', user: response.data}
    } else {
      throw new Error('Unable to parse user data')
    }

    return userData
  } catch (error) {
    throw error
  }
}

export async function getUserProfile(): Promise<User> {
  try {
    const response = await verifyToken()

    if (!response || !response.user) {
      throw new Error('No user data found')
    }

    return response.user
  } catch (error) {
    throw error
  }
}

export async function forgetPassword(
  email: string
): Promise<ForgetPasswordPayload> {
  const api = Api()

  return await api
    .post('/auth/forgotPasswords', {
      email: email
    })
    .then((res) => res.data)
    .catch((err) => err)
}

export async function verifyResetCode(code: string) {
  const api = Api()

  return await api
    .post('/auth/verifyResetCode', {
      resetCode: code
    })
    .then((res) => res.data)
    .catch((err) => err)
}

export async function ResetPassowrd(email: string, newPassword: string) {
  const api = Api()

  return await api
    .put('/auth/resetPassword', {
      email,
      newPassword
    })
    .then((res) => res)
    .catch((err) => err)
}
