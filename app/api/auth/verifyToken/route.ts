import {NextRequest, NextResponse} from 'next/server'
import {getServerSession} from 'next-auth'
import {handler} from '../[...nextauth]/route'
import type {Session} from 'next-auth'

// Extend the Session type to include our custom user properties
interface CustomSession extends Session {
  user?: {
    id: string
    name: string
    email: string
    phone?: string
    role?: string
  }
  accessToken?: string
}

export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(handler)) as CustomSession | null

    if (!session || !session.user) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const user = session.user

    // Return user data in the expected format
    return NextResponse.json({
      message: 'Token verified successfully',
      user: {
        id: user.id || user.email,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        phone: user.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}
