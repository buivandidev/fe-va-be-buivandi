'use client'

import { useEffect, useState } from 'react'
import { tokenStorage } from '@/lib/auth/token'

/**
 * Component debug để kiểm tra authentication
 * Chỉ hiển thị trong development mode
 */
export function DebugAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [decoded, setDecoded] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    const checkToken = () => {
      const t = tokenStorage.get()
      setToken(t)
      
      if (t) {
        try {
          // Decode JWT token (base64)
          const parts = t.split('.')
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]))
            setDecoded(payload)
          }
        } catch (e) {
          console.error('Failed to decode token:', e)
        }
      }
    }

    checkToken()
    
    // Listen for storage changes
    window.addEventListener('storage', checkToken)
    return () => window.removeEventListener('storage', checkToken)
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg max-w-md text-xs z-50">
      <div className="font-bold mb-2">🔐 Auth Debug</div>
      
      <div className="mb-2">
        <div className="font-semibold">Token exists:</div>
        <div className={token ? 'text-green-400' : 'text-red-400'}>
          {token ? '✓ Yes' : '✗ No'}
        </div>
      </div>

      {token && (
        <>
          <div className="mb-2">
            <div className="font-semibold">Token (first 50 chars):</div>
            <div className="break-all text-gray-300">
              {token.substring(0, 50)}...
            </div>
          </div>

          {decoded && (
            <div className="mb-2">
              <div className="font-semibold">Decoded payload:</div>
              <div className="text-gray-300">
                <div>User: {String(decoded.sub || decoded.email || 'N/A')}</div>
                <div>Role: {String(decoded.role || 'N/A')}</div>
                <div>Exp: {decoded.exp ? new Date(Number(decoded.exp) * 1000).toLocaleString() : 'N/A'}</div>
                <div>Expired: {decoded.exp && Number(decoded.exp) * 1000 < Date.now() ? '✗ Yes' : '✓ No'}</div>
              </div>
            </div>
          )}
        </>
      )}

      <button
        onClick={() => {
          const t = tokenStorage.get()
          if (t) {
            console.log('Token:', t)
            console.log('Decoded:', decoded)
          } else {
            console.log('No token found')
          }
        }}
        className="mt-2 px-2 py-1 bg-blue-600 rounded text-white hover:bg-blue-700"
      >
        Log to Console
      </button>
    </div>
  )
}
