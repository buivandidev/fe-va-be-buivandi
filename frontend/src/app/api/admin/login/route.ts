import { NextResponse } from 'next/server'
import { env } from '@/lib/config/environment'
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '@/lib/auth/cookies'

type AuthPayload = {
  duLieu?: Record<string, unknown>
  DuLieu?: Record<string, unknown>
  token?: string
  Token?: string
  thanhCong?: boolean
  ThanhCong?: boolean
  thongDiep?: string
  ThongDiep?: string
}

function pickString(source: Record<string, unknown>, key: string): string | undefined {
  const value = source[key]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(`${env.apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const payload = (await response.json().catch(() => null)) as AuthPayload | null

    const isSuccess = payload?.thanhCong ?? payload?.ThanhCong ?? response.ok
    if (!response.ok || !isSuccess) {
      const message = payload?.thongDiep ?? payload?.ThongDiep ?? 'Đăng nhập thất bại.'
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: response.status || 401 }
      )
    }

    const authData: Record<string, unknown> = payload?.duLieu ?? payload?.DuLieu ?? {}
    const token =
      pickString(authData, 'maTruyCap') ??
      pickString(authData, 'MaTruyCap') ??
      payload?.token ??
      payload?.Token

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không nhận được access token từ backend.',
        },
        { status: 502 }
      )
    }

    const user =
      (authData['nguoiDung'] as Record<string, unknown> | undefined) ??
      (authData['NguoiDung'] as Record<string, unknown> | undefined) ??
      null

    const res = NextResponse.json({
      success: true,
      user,
      token, // Return token to client so it can store in localStorage
    })

    res.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)
    return res
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Không thể kết nối máy chủ xác thực.',
      },
      { status: 500 }
    )
  }
}
