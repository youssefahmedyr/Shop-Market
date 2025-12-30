import Api from './api'
import {apiEndpoints} from '@/lib/config'

export type SignupPayload = {
  name: string
  email: string
  password: string
  rePassword: string
  phone: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type AuthResponse = {
  message: string
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export async function signup(
  payload: SignupPayload,
  customBaseUrl?: string
): Promise<AuthResponse> {
  const baseUrl =
    customBaseUrl || apiEndpoints.auth.signup.replace('/auth/signup', '')
  const api = Api(baseUrl)

  const res = await api.post<AuthResponse>('/auth/signup', payload)
  return res.data
}

export async function login(
  payload: LoginPayload,
  customBaseUrl?: string
): Promise<AuthResponse> {
  const baseUrl =
    customBaseUrl || apiEndpoints.auth.signin.replace('/auth/signin', '')
  const api = Api(baseUrl)
  const res = await api.post<AuthResponse>('/auth/signin', payload)
  return res.data
}

export async function loginWithProxy(
  payload: LoginPayload,
  customBaseUrl?: string
): Promise<AuthResponse> {
  // This function is deprecated but kept for compatibility
  const api = Api(customBaseUrl)
  const res = await api.post<AuthResponse>('/auth/signin', payload)
  return res.data
}
