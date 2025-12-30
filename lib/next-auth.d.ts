import 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    user?: {
      id: string
      name: string
      email: string
      phone?: string
      role?: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    phone?: string
    role?: string
    accessToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    user?: {
      id: string
      name: string
      email: string
      phone?: string
      role?: string
    }
  }
}
