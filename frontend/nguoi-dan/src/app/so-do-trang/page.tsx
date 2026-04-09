import Link from "next/link";

export default function SoDoTrang() {
  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12">
        <h1 className="gov-section-title text-3xl font-black text-slate-900 dark:text-white mb-8 border-b pb-6 dark:border-slate-800">Sơ đồ trang web (Sitemap)</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-blue-600 dark:text-blue-400 font-medium">
          <ul className="space-y-3">
            <li className="font-bold text-slate-900 dark:text-white">Thông tin chung</li>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/gioi-thieu">Giới thiệu</Link></li>
            <li><Link href="/tin-tuc">Tin tức & Sự kiện</Link></li>
            <li><Link href="/quy-hoach">Quy hoạch kiến trúc</Link></li>
            <li><Link href="/van-ban-phap-luat">Văn bản pháp luật</Link></li>
            <li><Link href="/khao-sat">Khảo sát ý kiến</Link></li>
          </ul>
          <ul className="space-y-3">
            <li className="font-bold text-slate-900 dark:text-white">Người dân (Dịch vụ)</li>
            <li><Link href="/dich-vu-cong">Dịch vụ công trực tuyến</Link></li>
            <li><Link href="/tra-cuu">Tra cứu hồ sơ</Link></li>
            <li><Link href="/dang-nhap">Đăng nhập tài khoản</Link></li>
            <li><Link href="/dang-ky">Đăng ký mới</Link></li>
            <li><Link href="/ca-nhan/ho-so">Hồ sơ cá nhân của tôi</Link></li>
          </ul>
          <ul className="space-y-3">
            <li className="font-bold text-slate-900 dark:text-white">Pháp lý & Hệ thống</li>
            <li><Link href="/mot-cua">Đăng nhập Một cửa điện tử</Link></li>
            <li><Link href="/dieu-khoan">Điều khoản sử dụng</Link></li>
            <li><Link href="/chinh-sach">Chính sách bảo mật</Link></li>
          </ul>
        </div>
      </div>
    </main>
  );
}
