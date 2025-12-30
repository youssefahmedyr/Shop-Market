import {NextRequest, NextResponse} from 'next/server'
import {getToken} from 'next-auth/jwt'
import {config} from '@/lib/config'

// Base API URL
const API_BASE_URL = '/api/v1'

// Dynamic endpoint mapping - allow all endpoints
function getEndpointPath(endpoint: string): string {
  // Convert endpoint array to path
  const endpointPath = Array.isArray(endpoint) ? endpoint.join('/') : endpoint

  // If endpoint starts with auth/, products/, etc., use it directly
  if (endpointPath.includes('/')) {
    return `/${endpointPath}`
  }

  // Otherwise, treat as a simple endpoint name
  return `/${endpointPath}`
}

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, {count: number; resetTime: number}>()

// Rate limiting function
function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {count: 1, resetTime: now + windowMs})
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

// Security headers
function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  return response
}

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET')
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST')
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT')
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE')
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    const pathname = request.nextUrl.pathname
    const endpoint = pathname.replace('/api/proxy/', '')

    // Allow all endpoints - no validation needed
    if (!endpoint) {
      const response = NextResponse.json(
        {error: 'No endpoint specified'},
        {status: 400}
      )
      return addSecurityHeaders(response)
    }

    // Get client IP for rate limiting
    const clientIP =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Apply rate limiting
    if (!checkRateLimit(clientIP)) {
      const response = NextResponse.json(
        {error: 'Too many requests'},
        {status: 429}
      )
      return addSecurityHeaders(response)
    }

    // Get auth token (optional for all endpoints)
    const token = await getToken({req: request})

    // Build target URL using dynamic endpoint mapping
    const targetEndpoint = getEndpointPath(endpoint)
    const searchParams = request.nextUrl.searchParams.toString()
    const targetUrl = `${config.apiUrl}${API_BASE_URL}${targetEndpoint}${
      searchParams ? `?${searchParams}` : ''
    }`

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Next.js-Proxy/1.0'
    }

    // Add auth token if available
    if (token?.accessToken) {
      headers['token'] = token.accessToken
    } else {
      // Check for token in request headers
      const requestToken =
        request.headers.get('authorization') || request.headers.get('token')
      if (requestToken) {
        headers['token'] = requestToken.replace('Bearer ', '')
      }
    }

    // Copy safe headers from original request
    const safeHeaders = ['accept', 'accept-language', 'cache-control']
    safeHeaders.forEach((header) => {
      const value = request.headers.get(header)
      if (value) headers[header] = value
    })

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers
    }

    // Add body for POST/PUT requests
    if (method === 'POST' || method === 'PUT') {
      try {
        const body = await request.text()
        if (body) {
          requestOptions.body = body
        }
      } catch (error) {
        console.error('Error reading request body:', error)
      }
    }

    // Make the actual API request
    const response = await fetch(targetUrl, requestOptions)

    // Handle response
    if (!response.ok) {
      const errorText = await response.text()

      const errorResponse = NextResponse.json(
        {error: JSON.parse(errorText)},
        {status: response.status}
      )
      return addSecurityHeaders(errorResponse)
    }

    // Get response data
    const contentType = response.headers.get('content-type')
    let responseData

    if (contentType?.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }

    // Create proxy response
    const proxyResponse = NextResponse.json(responseData, {
      status: response.status
    })

    // Copy safe response headers
    const safeResponseHeaders = ['content-type', 'cache-control', 'etag']
    safeResponseHeaders.forEach((header) => {
      const value = response.headers.get(header)
      if (value) proxyResponse.headers.set(header, value)
    })

    return addSecurityHeaders(proxyResponse)
  } catch (error) {
    console.error('Proxy error:', error)
    const response = NextResponse.json(
      {error: 'Internal server error'},
      {status: 500}
    )
    return addSecurityHeaders(response)
  }
}
