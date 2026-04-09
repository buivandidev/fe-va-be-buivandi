'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api/client'

export default function TestApiPage() {
  const [result, setResult] = useState<string>('')
  const [token, setToken] = useState<string>('')

  const testLogin = async () => {
    try {
      setResult('Testing login...')
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@phuongxa.vn',
          matKhau: 'Admin@123456!Secure',
        }),
      })
      
      const data = await response.json()
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
        setToken(data.token.substring(0, 50) + '...')
        setResult('✓ Login successful! Token saved to localStorage')
      } else {
        setResult('✗ Login failed: No token received')
      }
    } catch (error: any) {
      setResult(`✗ Login error: ${error.message}`)
    }
  }

  const testUsersApi = async () => {
    try {
      setResult('Testing users API...')
      const response = await apiClient.get('/api/admin/users?trang=1&kichThuocTrang=5')
      setResult(`✓ Users API successful! Got ${response.data?.duLieu?.tongSo || 0} users`)
    } catch (error: any) {
      setResult(`✗ Users API error: ${error.message}`)
      console.error('Full error:', error)
    }
  }

  const testDashboardApi = async () => {
    try {
      setResult('Testing dashboard API...')
      const response = await apiClient.get('/api/admin/dashboard/stats')
      const stats = response.data?.duLieu
      setResult(`✓ Dashboard API successful! Users: ${stats?.tongNguoiDung}, Articles: ${stats?.tongBaiViet}`)
    } catch (error: any) {
      setResult(`✗ Dashboard API error: ${error.message}`)
      console.error('Full error:', error)
    }
  }

  const checkToken = () => {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      setToken(storedToken.substring(0, 50) + '...')
      setResult('✓ Token found in localStorage')
    } else {
      setResult('✗ No token in localStorage')
    }
  }

  const clearToken = () => {
    localStorage.removeItem('auth_token')
    setToken('')
    setResult('✓ Token cleared from localStorage')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication</h2>
          <div className="space-y-3">
            <button
              onClick={testLogin}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              1. Test Login
            </button>
            <button
              onClick={checkToken}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              2. Check Token
            </button>
            <button
              onClick={clearToken}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear Token
            </button>
          </div>
          
          {token && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
              <strong>Token:</strong> {token}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Endpoints</h2>
          <div className="space-y-3">
            <button
              onClick={testUsersApi}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              3. Test Users API
            </button>
            <button
              onClick={testDashboardApi}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              4. Test Dashboard API
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Result</h2>
          <div className="p-4 bg-gray-50 rounded font-mono text-sm whitespace-pre-wrap">
            {result || 'Click a button to test...'}
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/admin/dashboard" className="text-blue-600 hover:underline">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
