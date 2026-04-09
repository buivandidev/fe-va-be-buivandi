'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          matKhau: password,
        }),
      })

      const payload = await response.json()

      if (!response.ok || payload?.success !== true) {
        throw new Error(payload?.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.')
      }

      // Store token in localStorage for API requests
      if (payload.token) {
        localStorage.setItem('auth_token', payload.token)
      }

      router.replace('/admin/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-ink mb-2">Đăng nhập</h1>
          <p className="text-center text-ink-muted mb-8">Quản lý hệ thống Phường Xã</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold shadow-sm border border-blue-700"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-ink-muted text-sm mt-6">
            Quay về <Link href="/" className="text-brand hover:text-brand-dark">trang chủ</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
