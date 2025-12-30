import {User} from './user'

export interface AuthResponse {
  status: string
  data: {
    user: User
    token: string
  }
  message?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  name: string
  email: string
  password: string
  phone?: string
}

export interface ForgetPasswordPayload {
  message: string
  statusMsg: string
}

export interface Session {
  user: {
    id: string
    name?: string
    email: string
    role?: string
  }
  expires: string
}
