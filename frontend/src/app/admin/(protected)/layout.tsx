export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import LogoutButton from '@/components/admin/LogoutButton'
import { DebugAuth } from '@/components/DebugAuth'

const ALLOWED_ADMIN_ROLES = ['Admin', 'BienTap']

const adminNav = [
  { href: '/admin/dashboard', label: 'Bảng điều khiển' },
  { href: '/admin/homepage', label: 'Quản lý Trang chủ' },
  { href: '/admin/articles', label: 'Tin tức' },
  { href: '/admin/services', label: 'Dịch vụ' },
  { href: '/admin/applications', label: 'Đơn ứng tuyển' },
  { href: '/admin/comments', label: 'Bình luận' },
  { href: '/admin/contacts', label: 'Liên hệ' },
  { href: '/admin/users', label: 'Người dùng' },
  { href: '/admin/categories', label: 'Danh mục' },
  { href: '/admin/library', label: 'Thư viện' },
  { href: '/admin/settings', label: 'Cài đặt' },
  { href: '/admin/audit-logs', label: 'Nhật ký' },
]

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  const userRoles = session.user.danhSachVaiTro ?? []
  const hasAdminAccess = ALLOWED_ADMIN_ROLES.some((role) => userRoles.includes(role))

  if (!hasAdminAccess) {
    redirect('/admin/forbidden')
  }

  return (
    <div className="admin-shell min-h-screen bg-[radial-gradient(circle_at_top_left,#e0f2fe_0%,#f8fafc_35%,#f8fafc_100%)]">
      <div className="flex min-h-screen">
        <aside className="w-72 border-r border-slate-200 bg-slate-950 text-slate-100">
          <div className="border-b border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Quản trị hệ thống</p>
            <h2 className="mt-2 text-xl font-extrabold">Cổng Phường Xã</h2>
          </div>
          <nav className="space-y-2 p-4">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-8 py-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Trang quản trị</h1>
                <p className="text-sm text-slate-500">Điều hành nội dung và dịch vụ công trực tuyến</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {session.user.hoTen}
                </span>
                <LogoutButton />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              {children}
            </div>
          </main>
        </div>
      </div>
      <DebugAuth />
    </div>
  )
}
