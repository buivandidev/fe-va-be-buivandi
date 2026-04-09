import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { env } from '@/lib/config/environment'
import { AUTH_COOKIE_NAME } from '@/lib/auth/cookies'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (token) {
    try {
      await fetch(`${env.apiBaseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: '{}',
        cache: 'no-store',
      })
    } catch {
      // Ignore backend logout errors, always clear local cookie.
    }
  }

  const res = NextResponse.redirect(new URL('/admin/login', request.url), 303)
  res.cookies.delete(AUTH_COOKIE_NAME)
  return res
}
