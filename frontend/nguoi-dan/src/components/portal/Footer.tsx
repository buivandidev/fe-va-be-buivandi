import Link from "next/link";
import { fetchApi, unwrapApiEnvelope } from "@/lib/api";

async function getSettings() {
  try {
    const res = await fetchApi("/api/settings", { next: { revalidate: 60 } });
    if (!res.ok) return {};
    const configData = await res.json();
    const env = unwrapApiEnvelope<any[]>(configData);
    if (!env.success || !env.data) return {};
    
    // Map Array of objects {Khoa, GiaTri} to Record<string, string>
    return env.data.reduce((acc, curr) => {
      if (curr.khoa && curr.giaTri != null) {
        acc[curr.khoa] = curr.giaTri;
      }
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {};
  }
}

export default async function Footer() {
  const settings = await getSettings();

  const address = settings['Address'] || "01 Trần Hưng Đạo, Thành phố Trung tâm, Tỉnh Địa Phương";
  const phone = settings['Phone'] || "(024) 3823 4567 - 0988 123 456";
  const email = settings['Email'] || "contact@diaphuong.gov.vn";
  const siteName = settings['SiteName'] || "Cổng Thông Tin Điện Tử\nĐịa Phương";
  const siteDesc = settings['SiteDescription'] || "Trang thông tin chính thống cung cấp dịch vụ và tin tức từ chính quyền địa phương đến người dân và doanh nghiệp.";

  return (
    <footer className="bg-[#0B101E] text-white py-12 md:py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12 border-b border-slate-700/50 pb-12">
          {/* Column 1: Branding */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined gov-icon text-4xl">travel_explore</span>
              <h2 className="text-xl font-bold uppercase tracking-wider leading-tight whitespace-pre-line">
                {siteName}
              </h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {siteDesc}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/tin-tuc"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label="Tin tức địa phương"
              >
                  <span className="material-symbols-outlined gov-icon text-xl">public</span>
              </Link>
              <Link
                href="/thu-vien"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label="Thư viện hình ảnh và video"
              >
                  <span className="material-symbols-outlined gov-icon text-xl">share</span>
              </Link>
              <Link
                href="/lien-he"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label="Liên hệ cơ quan"
              >
                  <span className="material-symbols-outlined gov-icon text-xl">mail</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Liên kết nhanh */}
          <div>
              <h3 className="gov-section-title text-sm font-bold uppercase tracking-widest mb-6 text-slate-100">Liên kết nhanh</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/gioi-thieu"
                  className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                   <span className="material-symbols-outlined gov-icon text-base text-slate-500 transition-colors group-hover:text-primary">account_balance</span>
                  Giới thiệu bộ máy chính quyền
                </Link>
              </li>
              <li>
                <Link
                  href="/quy-hoach"
                  className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                   <span className="material-symbols-outlined gov-icon text-base text-slate-500 transition-colors group-hover:text-primary">map</span>
                  Quy hoạch phát triển địa phương
                </Link>
              </li>
              <li>
                <Link
                  href="/van-ban-phap-luat"
                  className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                   <span className="material-symbols-outlined gov-icon text-base text-slate-500 transition-colors group-hover:text-primary">gavel</span>
                  Tra cứu văn bản pháp luật
                </Link>
              </li>
              <li>
                <Link
                  href="/mot-cua"
                  className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                   <span className="material-symbols-outlined gov-icon text-base text-slate-500 transition-colors group-hover:text-primary">storefront</span>
                  Hệ thống một cửa điện tử
                </Link>
              </li>
              <li>
                <Link
                  href="/khao-sat"
                  className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                   <span className="material-symbols-outlined gov-icon text-base text-slate-500 transition-colors group-hover:text-primary">rate_review</span>
                  Khảo sát mức độ hài lòng
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Dịch vụ công */}
          <div>
              <h3 className="gov-section-title text-sm font-bold uppercase tracking-widest mb-6 text-slate-100">Dịch vụ công</h3>
            <ul className="space-y-4">
              <li><Link href="/dich-vu-cong" className="text-slate-300 text-sm hover:text-white transition-colors">Thủ tục hành chính</Link></li>
              <li><Link href="/tra-cuu" className="text-slate-300 text-sm hover:text-white transition-colors">Tra cứu hồ sơ</Link></li>
              <li><Link href="/nop-ho-so" className="text-slate-300 text-sm hover:text-white transition-colors">Nộp hồ sơ trực tuyến</Link></li>
              <li><Link href="/ca-nhan/thanh-toan" className="text-slate-300 text-sm hover:text-white transition-colors">Thanh toán trực tuyến</Link></li>
              <li><Link href="/lien-he/hoi-dap" className="text-slate-300 text-sm hover:text-white transition-colors">Hỏi đáp pháp luật</Link></li>
            </ul>
          </div>

          {/* Column 4: Thông tin liên hệ */}
          <div>
              <h3 className="gov-section-title text-sm font-bold uppercase tracking-widest mb-6 text-slate-100">Thông tin liên hệ</h3>
            <ul className="space-y-5">
              <li className="flex gap-4">
                <span className="material-symbols-outlined gov-icon text-primary text-xl flex-shrink-0">location_on</span>
                <span className="text-slate-300 text-sm leading-relaxed">{address}</span>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined gov-icon text-primary text-xl flex-shrink-0">call</span>
                <span className="text-slate-300 text-sm">{phone}</span>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined gov-icon text-primary text-xl flex-shrink-0">mail</span>
                <span className="text-slate-300 text-sm">{email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2026 Cổng Thông tin điện tử địa phương. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <Link href="/dieu-khoan" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
            <Link href="/chinh-sach" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <Link href="/so-do-trang" className="hover:text-white transition-colors">Sơ đồ trang</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
