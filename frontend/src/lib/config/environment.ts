const DEFAULT_API_BASE_URL = 'http://localhost:5187'

export const env = {
  // Client-side (browser) - uses NEXT_PUBLIC_ prefix
  publicApiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,

  // Server-side only
  apiBaseUrl: process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL,

  // App metadata
  appName: 'Cổng Thông Tin Phường Xã',

  // Node environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}
