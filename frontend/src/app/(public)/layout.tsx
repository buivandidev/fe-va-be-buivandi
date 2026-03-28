export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-line shadow-sm">
        <div className="container-page py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-brand">
            Phường Xã
          </div>
          <nav className="flex gap-6">
            <a href="/" className="text-ink hover:text-brand transition">
              Trang chủ
            </a>
            <a href="/tin-tuc" className="text-ink hover:text-brand transition">
              Tin tức
            </a>
            <a href="/dich-vu" className="text-ink hover:text-brand transition">
              Dịch vụ
            </a>
            <a href="/admin/login" className="text-ink hover:text-brand transition">
              Đăng nhập
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container-page py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-ink text-white py-12 mt-12">
        <div className="container-page">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Về chúng tôi</h3>
              <p className="text-white/70 text-sm">
                Cổng thông tin cung cấp dịch vụ công trực tuyến
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Dịch vụ</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="/dich-vu" className="hover:text-white">Danh sách dịch vụ</a></li>
                <li><a href="/dich-vu/nop-ho-so" className="hover:text-white">Nộp hồ sơ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Tin tức</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="/tin-tuc" className="hover:text-white">Tin tức mới</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Liên hệ</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="/lien-he" className="hover:text-white">Gửi tin nhắn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2026 Cổng Thông Tin Phường Xã. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
