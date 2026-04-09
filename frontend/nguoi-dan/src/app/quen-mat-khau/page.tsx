import Link from "next/link";

export default function QuenMatKhau() {
  return (
    <div className="flex-1 h-full flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Central Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-primary/5 border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8">
              {/* Branding/Icon */}
              <div className="mb-8 flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined gov-icon text-primary text-4xl">lock_reset</span>
                </div>
              </div>
              
              {/* Header Text */}
              <div className="text-center mb-8">
                <h1 className="gov-section-title text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Quên mật khẩu?</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                  Vui lòng nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.
                </p>
              </div>
              
              {/* Form */}
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1" htmlFor="email">
                    Địa chỉ Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-xl">mail</span>
                    </div>
                    <input className="block w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-base" id="email" name="email" placeholder="example@email.gov.vn" type="email" />
                  </div>
                </div>
                <Link href="/dat-lai-mat-khau" className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-lg text-base font-bold tracking-wide transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group">
                  Gửi liên kết khôi phục
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">send</span>
                </Link>
              </form>
              
              {/* Footer Link */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link href="/dang-nhap" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors">
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          </div>
          
          {/* Additional Help/Security Note */}
          <div className="mt-8 text-center px-4">
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
              Nếu bạn gặp khó khăn, vui lòng liên hệ Tổng đài hỗ trợ 
              <span className="text-primary font-bold ml-1">1900 1000</span> hoặc gửi phản ánh kiến nghị.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
