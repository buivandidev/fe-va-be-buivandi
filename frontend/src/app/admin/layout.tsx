import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated (middleware handles redirect, but double-check here)
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-ink text-white border-r border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Quản Lý</h2>
        </div>
        <nav className="p-6 space-y-2">
          <a
            href="/admin/dashboard"
            className="block px-4 py-2 rounded hover:bg-white/10 transition"
          >
            Bảng điều khiển
          </a>
          <a
            href="/admin/articles"
            className="block px-4 py-2 rounded hover:bg-white/10 transition"
          >
            Bài viết
          </a>
          <a
            href="/admin/services"
            className="block px-4 py-2 rounded hover:bg-white/10 transition"
          >
            Dịch vụ
          </a>
          <a
            href="/admin/applications"
            className="block px-4 py-2 rounded hover:bg-white/10 transition"
          >
            Đơn ứng
          </a>
          <a
            href="/admin/comments"
            className="block px-4 py-2 rounded hover:bg-white/10 transition"
          >
            Bình luận
          </a>
          <a
            href="/admin/users"
            className="block px-4 py-2 rounded hover:bg-white/10 transition"
          >
            Người dùng
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-line px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ink">Quản Lý Hệ Thống</h1>
          <div className="flex items-center gap-4">
            <span className="text-ink-muted">{session.user.hoTen}</span>
            <form action="/admin/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 text-sm border border-line rounded hover:bg-line transition"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-bg overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
