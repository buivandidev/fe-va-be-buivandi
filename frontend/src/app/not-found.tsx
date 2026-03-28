export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-brand mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-ink mb-2">Không tìm thấy trang</h2>
        <p className="text-ink-muted mb-8">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
        >
          Quay về trang chủ
        </a>
      </div>
    </div>
  )
}
