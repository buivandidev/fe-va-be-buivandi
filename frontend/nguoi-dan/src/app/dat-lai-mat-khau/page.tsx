import Link from "next/link";

export default function DatLaiMatKhau() {
  return (
    <div className="flex-1 h-full flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Reset Password Card */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <span className="material-symbols-outlined gov-icon text-3xl">lock_reset</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Đặt lại mật khẩu mới</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                  Vui lòng thiết lập mật khẩu mới để bảo mật tài khoản của bạn.
                </p>
              </div>
              <form className="space-y-6">
                {/* New Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="new-password">Mật khẩu mới</label>
                  <div className="relative">
                    <input className="w-full h-12 pl-4 pr-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-slate-400 outline-none" id="new-password" placeholder="Nhập mật khẩu mới" type="password" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" type="button">
                      <span className="material-symbols-outlined gov-icon">visibility</span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <input className="w-full h-12 pl-4 pr-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-slate-400 outline-none" id="confirm-password" placeholder="Nhập lại mật khẩu mới" type="password" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" type="button">
                      <span className="material-symbols-outlined gov-icon">visibility</span>
                    </button>
                  </div>
                </div>

                {/* Requirements List */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Yêu cầu mật khẩu:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined gov-icon text-sm text-emerald-500">check_circle</span>
                      Tối thiểu 8 ký tự
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                      Bao gồm ít nhất một chữ hoa
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                      Bao gồm ít nhất một chữ số
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="material-symbols-outlined text-sm text-slate-300">radio_button_unchecked</span>
                      Bao gồm ít nhất một ký tự đặc biệt (@, #, $,...)
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <Link href="/doi-mat-khau-thanh-cong" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                  Cập nhật mật khẩu
                  <span className="material-symbols-outlined gov-icon text-lg">arrow_forward</span>
                </Link>
              </form>
            </div>
            <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
              <Link href="/dang-nhap" className="text-sm font-medium text-primary hover:underline">Quay lại đăng nhập</Link>
            </div>
          </div>
          
          {/* Support Text */}
          <p className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            Bạn gặp khó khăn? <Link href="/lien-he" className="text-primary font-medium hover:underline">Liên hệ hỗ trợ 1900 xxxx</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
