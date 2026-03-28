import { requireAuth } from '@/lib/auth/session'

export default async function DashboardPage() {
  const session = await requireAuth()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ink mb-2">
          Chào mừng, {session.user.hoTen}!
        </h1>
        <p className="text-ink-muted">
          Đây là bảng điều khiển quản lý hệ thống Phường Xã
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Bài viết', value: '0' },
          { label: 'Dịch vụ', value: '0' },
          { label: 'Đơn ứng', value: '0' },
          { label: 'Người dùng', value: '0' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-line rounded-lg p-6">
            <p className="text-ink-muted text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-brand">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-line rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Tip: Phase 1 Setup Hoàn Tất!</h2>
        <p className="text-ink-muted">
          Bây giờ bạn có thể:
        </p>
        <ul className="mt-4 space-y-2 text-ink-muted">
          <li>✅ Cấu hình Next.js project</li>
          <li>✅ Tạo folder structure đầy đủ</li>
          <li>✅ Setup Tailwind CSS với custom styles</li>
          <li>✅ Migrate core utilities (formatters, constants, environment)</li>
          <li>✅ Setup authentication infrastructure (middleware, session, cookies)</li>
          <li>⏳ Install dependencies (sắp sửa)</li>
          <li>⏳ Verify setup (dev server)</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">Bước tiếp theo:</h3>
        <p className="text-blue-800 text-sm">
          Chạy: <code className="bg-white px-2 py-1 rounded">npm install</code> để cài đặt dependencies
        </p>
        <p className="text-blue-800 text-sm mt-2">
          Sau đó: <code className="bg-white px-2 py-1 rounded">npm run dev</code> để khởi động dev server
        </p>
      </div>
    </div>
  )
}
