import { cookies } from 'next/headers'

export const AUTH_COOKIE_NAME = 'auth_token'
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)
  return token?.value ?? null
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}
