import Link from "next/link";

export default function DoiMatKhauThanhCong() {
  return (
    <div className="flex-1 h-full flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800">
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined !text-6xl">check_circle</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Đổi mật khẩu thành công!</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                Bảo mật tài khoản của bạn đã được cập nhật thành công. Vui lòng đăng nhập lại bằng mật khẩu mới để tiếp tục sử dụng các dịch vụ công.
              </p>
              
              <div className="space-y-4">
                <Link href="/dang-nhap" className="block w-full bg-primary text-white py-3 px-6 rounded-lg font-bold text-base hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                  Đăng nhập ngay
                </Link>
                <Link href="/" className="block text-primary font-medium hover:underline text-sm py-2">
                  Quay lại Trang chủ
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-4 text-xs text-slate-400 uppercase tracking-widest">
            <span>An toàn</span>
            <span>•</span>
            <span>Bảo mật</span>
            <span>•</span>
            <span>Minh bạch</span>
          </div>
        </div>
      </main>

      
    </div>
  );
}
