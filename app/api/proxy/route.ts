import {NextRequest, NextResponse} from 'next/server'
import {apiEndpoints} from '@/lib/config'

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const customId = searchParams.get('_custom')

  if (!endpoint) {
    return NextResponse.json({error: 'Missing endpoint'}, {status: 400})
  }

  try {
    const response = await fetch(`${apiEndpoints.base}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: request.headers.get('token') || ''
      }
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({error: 'Proxy error'}, {status: 500})
  }
}

export async function POST(request: NextRequest) {
  const {searchParams} = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const body = await request.json()

  if (!endpoint) {
    return NextResponse.json({error: 'Missing endpoint'}, {status: 400})
  }

  try {
    const response = await fetch(`${apiEndpoints.base}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: request.headers.get('token') || ''
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({error: 'Proxy error'}, {status: 500})
  }
}

export async function PUT(request: NextRequest) {
  const {searchParams} = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const body = await request.json()

  if (!endpoint) {
    return NextResponse.json({error: 'Missing endpoint'}, {status: 400})
  }

  try {
    const response = await fetch(`${apiEndpoints.base}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: request.headers.get('token') || ''
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({error: 'Proxy error'}, {status: 500})
  }
}

export async function DELETE(request: NextRequest) {
  const {searchParams} = new URL(request.url)
  const endpoint = searchParams.get('endpoint')

  if (!endpoint) {
    return NextResponse.json({error: 'Missing endpoint'}, {status: 400})
  }

  try {
    const response = await fetch(`${apiEndpoints.base}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: request.headers.get('token') || ''
      }
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({error: 'Proxy error'}, {status: 500})
  }
}
