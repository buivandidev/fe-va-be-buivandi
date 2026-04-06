import Image from "next/image";

const mapImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBbHD5gnk9DUwgIYItWznNwA9GJ_H9dG8hEPZtpqK7TWy2cjaVENDm_kmqf1Bqg1b9Hf80O_KW7m0WJpNOWIvjqCcqUgbyJTgMG2pwGrD-_B3SgUZ1HQgtgyuwl9lZzlHjkzGA6ekU4umwRvqqZ9VXJ_3R94hvXCsU2y--z9Jr35jmCwVzq4kd8AiKhefEmf1w-4lZQhFERwNyMNX_6r7iSonwmW5YreMt45xIK5hCzrQV0kJTZogPmIBsvc3wREqurLX5ggFziZJc";

export function PortalFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-100 pb-10 pt-20 dark:border-slate-800 dark:bg-background-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary p-2 text-white">
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <h2 className="text-lg font-black text-primary uppercase">Cổng Thông Tin</h2>
            </div>

            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Cơ quan chủ quản: Ủy ban nhân dân Thành phố. <br />Địa chỉ: 01 Trần Phú, Phường 1, TP. HCM
            </p>

            <div className="flex gap-4">
              <a
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 transition-all hover:bg-primary hover:text-white dark:bg-slate-800"
                href="#"
              >
                <span className="material-symbols-outlined">social_leaderboard</span>
              </a>
              <a
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 transition-all hover:bg-primary hover:text-white dark:bg-slate-800"
                href="#"
              >
                <span className="material-symbols-outlined">smart_display</span>
              </a>
              <a
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 transition-all hover:bg-primary hover:text-white dark:bg-slate-800"
                href="#"
              >
                <span className="material-symbols-outlined">rss_feed</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-6 font-bold text-slate-900 dark:text-white">Dịch vụ trực tuyến</h3>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a className="hover:text-primary" href="#">
                  Đăng ký kinh doanh
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Khai báo lưu trú
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Thanh toán thuế đất
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Cấp đổi giấy phép lái xe
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-bold text-slate-900 dark:text-white">Thông tin hữu ích</h3>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a className="hover:text-primary" href="#">
                  Bản đồ quy hoạch
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Giá nông sản hôm nay
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Lịch tiếp công dân
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Danh bạ đường dây nóng
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-bold text-slate-900 dark:text-white">Bản đồ vị trí</h3>
            <div className="relative h-32 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
              <Image
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                src={mapImage}
                alt="Map location"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 320px"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-primary">location_on</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-500">
              <div className="mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">phone</span> (028) 38.123.456
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">mail</span> contact@localgov.gov.vn
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-xs font-semibold tracking-widest text-slate-400 uppercase dark:border-slate-800 md:flex-row">
          <p>© 2024 Cổng thông tin điện tử địa phương. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-primary" href="#">
              Điều khoản
            </a>
            <a className="hover:text-primary" href="#">
              Bảo mật
            </a>
            <a className="hover:text-primary" href="#">
              Sơ đồ site
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
