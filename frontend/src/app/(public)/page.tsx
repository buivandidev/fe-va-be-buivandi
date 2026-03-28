import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trang chủ - Cổng Thông Tin Phường Xã',
  description: 'Nền tảng tích hợp dịch vụ công trực tuyến, tin tức dân sinh và thông tin chính quyền',
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="py-16 text-center animate-fade-in">
        <h1 className="text-5xl font-bold text-gradient mb-4">
          Cổng Thông Tin Phường Xã
        </h1>
        <p className="text-xl text-ink-muted mb-8">
          Nền tảng tích hợp dịch vụ công trực tuyến
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/tin-tuc"
            className="px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
          >
            Xem tin tức
          </a>
          <a
            href="/dich-vu"
            className="px-6 py-3 border border-brand text-brand rounded-lg hover:bg-brand-light transition"
          >
            Dịch vụ công
          </a>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Dịch Vụ Chính</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel p-6 animate-slide-up">
              <div className="w-12 h-12 bg-brand-light rounded-lg mb-4"></div>
              <h3 className="font-bold text-lg mb-2">Dịch vụ {i}</h3>
              <p className="text-ink-muted text-sm">
                Mô tả ngắn gọn về dịch vụ công cung cấp cho người dân
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent News */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Tin Mới Nhất</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="panel p-6 panel:hover flex gap-4">
              <div className="w-32 h-24 bg-line rounded-lg flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="font-bold mb-2">Tin tức tiêu đề {i}</h3>
                <p className="text-ink-muted text-sm mb-2">
                  Mô tả ngắn gọn về nội dung tin tức
                </p>
                <a href={`/tin-tuc/tieu-de-${i}`} className="text-brand hover:text-brand-dark text-sm font-medium">
                  Đọc tiếp →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
