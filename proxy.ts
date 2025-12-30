import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {getToken} from 'next-auth/jwt'

export async function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl

  const protectedRoutes = [
    '/profile',
    '/wishlist',
    '/cart',
    '/order-card',
    '/order-success',
    '/api/orders',
    '/api/wishlist',
    '/api/cart',
    '/api/addresses'
  ]

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  const authRoutes = ['/auth/login', '/auth/signup']

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  try {
    const token = await getToken({req: request})

    if (isProtectedRoute && !token) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (isAuthRoute && token) {
      return NextResponse.redirect(new URL('/profile', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Proxy error:', error)

    if (isProtectedRoute) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)'
  ]
}
