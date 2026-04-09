import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/config/environment'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_session')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Chưa đăng nhập' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const url = `${env.apiBaseUrl}/api/admin/media?${searchParams.toString()}`

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Media API error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi kết nối server' },
      { status: 500 }
    )
  }
}
