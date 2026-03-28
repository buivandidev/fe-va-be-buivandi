import { cache } from 'react'
import { env } from '@/lib/config/environment'
import { getAuthToken } from './cookies'

interface User {
  id: string
  hoTen: string
  email: string
  anhDaiDien?: string
  danhSachVaiTro: string[]
}

interface Session {
  user: User
  token: string
}

/**
 * Server-side session getter with caching
 * Uses React cache to prevent multiple API calls in the same render
 */
export const getSession = cache(async (): Promise<Session | null> => {
  try {
    const token = await getAuthToken()

    if (!token) {
      return null
    }

    // Verify token with backend /api/auth/me
    const response = await fetch(`${env.apiBaseUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    // Handle both naming conventions (camelCase and PascalCase)
    const userData = data.duLieu ?? data.DuLieu

    return {
      user: {
        id: userData.id ?? userData.Id,
        hoTen: userData.hoTen ?? userData.HoTen,
        email: userData.email ?? userData.Email,
        anhDaiDien: userData.anhDaiDien ?? userData.AnhDaiDien,
        danhSachVaiTro: userData.danhSachVaiTro ?? userData.DanhSachVaiTro ?? [],
      },
      token,
    }
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
})

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<Session> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized: User is not authenticated')
  }

  return session
}

/**
 * Require specific role - throws if user doesn't have role
 */
export async function requireRole(allowedRoles: string[]): Promise<Session> {
  const session = await requireAuth()

  const userRoles = session.user.danhSachVaiTro ?? []
  const hasRole = allowedRoles.some((role) => userRoles.includes(role))

  if (!hasRole) {
    throw new Error(
      `Forbidden: User does not have required role(s): ${allowedRoles.join(', ')}`
    )
  }

  return session
}
