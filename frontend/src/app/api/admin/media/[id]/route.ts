import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/config/environment'
import { cookies } from 'next/headers'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_session')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Chưa đăng nhập' },
        { status: 401 }
      )
    }

    const response = await fetch(`${env.apiBaseUrl}/api/admin/media/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Delete media error:', error)
    return NextResponse.json(
      { success: false, message: 'Lỗi xóa file' },
      { status: 500 }
    )
  }
}
