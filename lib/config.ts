// Environment configuration
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce.routemisr.com',
  nextAuthUrl: process.env.NEXTAUTH_URL || getBaseUrl(),
  proxyUrl: '/api/proxy'
}

// Function to dynamically get the base URL
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin
  } else {
    // Server-side: try to determine from environment or fallback
    return process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce.routemisr.com'
  }
}

// API endpoints configuration
export const apiEndpoints = {
  base: config.apiUrl,
  // Direct auth endpoints (bypass proxy)
  auth: {
    signin: `${config.apiUrl}/api/v1/auth/signin`,
    signup: `${config.apiUrl}/api/v1/auth/signup`,
    verifyToken: `${config.apiUrl}/api/v1/auth/verifyToken`
  },
  // Proxy endpoints (go through our secure proxy)
  proxy: {
    base: config.proxyUrl,
    products: `${config.proxyUrl}/products`,
    categories: `${config.proxyUrl}/categories`,
    brands: `${config.proxyUrl}/brands`,
    subcategories: `${config.proxyUrl}/subcategories`,
    cart: `${config.proxyUrl}/cart`,
    wishlist: `${config.proxyUrl}/wishlist`,
    orders: `${config.proxyUrl}/orders`,
    addresses: `${config.proxyUrl}/addresses`
  },
  // Orders endpoints
  orders: {
    create: `${config.proxyUrl}/orders`,
    checkout: `${config.proxyUrl}/orders/checkout-session`,
    getById: (id: string) => `${config.proxyUrl}/orders/${id}`
  }
}

// Request type mapping
export const requestTypes = {
  auth: ['signin', 'signup', 'verifyToken'],
  public: ['products', 'categories', 'brands', 'subcategories'],
  protected: ['cart', 'wishlist', 'orders', 'addresses']
}
