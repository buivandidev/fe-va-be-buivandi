function formatUrl(value?: string): string | undefined {
  if (value) return value.trim().replace(/\/+$/, '')
  return undefined
}

const isDev = process.env.NODE_ENV !== 'production'

const publicApiBaseUrl = formatUrl(process.env.NEXT_PUBLIC_API_BASE_URL) || (isDev ? 'http://localhost:5187' : '')
if (!publicApiBaseUrl && !isDev) {
  throw new Error(`Thiếu biến môi trường bắt buộc: NEXT_PUBLIC_API_BASE_URL`)
}

const isServer = typeof window === 'undefined'

const apiBaseUrl = formatUrl(process.env.API_BASE_URL) || (isDev ? 'http://localhost:5187' : '')
if (isServer && !apiBaseUrl && !isDev) {
  throw new Error(`Thiếu biến môi trường bắt buộc: API_BASE_URL`)
}

export const env = {
  // Client-side (browser) - uses NEXT_PUBLIC_ prefix
  publicApiBaseUrl: publicApiBaseUrl,

  // Server-side only
  apiBaseUrl: apiBaseUrl,

  // App metadata
  appName: 'Cổng Thông Tin Phường Xã',

  // Node environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

