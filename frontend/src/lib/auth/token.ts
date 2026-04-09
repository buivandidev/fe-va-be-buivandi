/**
 * Token storage utility - Unified token management
 * Use this instead of directly accessing localStorage
 */

const TOKEN_KEY = 'auth_token'

export const tokenStorage = {
  /**
   * Get token from localStorage
   */
  get: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  },

  /**
   * Set token in localStorage
   */
  set: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
  },

  /**
   * Remove token from localStorage
   */
  remove: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
  },

  /**
   * Check if token exists
   */
  exists: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(TOKEN_KEY)
  },

  /**
   * Clear all auth data
   */
  clear: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('user')
  },
}
