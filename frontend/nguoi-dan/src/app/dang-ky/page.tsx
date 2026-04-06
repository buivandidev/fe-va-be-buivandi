import Link from "next/link";

export default function DangKy() {
  return (
    <div className="flex-1 h-full flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Header */}
      

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-12 px-4">
        <div className="w-full max-w-[640px] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden text-sm">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight mb-2 text-center">Đăng ký tài khoản công dân</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base text-center">Vui lòng điền đầy đủ thông tin bên dưới để khởi tạo tài khoản định danh quốc gia.</p>
          </div>
          <form className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ và tên */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">person</span>
                  Họ và tên
                </label>
                <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none" placeholder="Nhập đầy đủ họ và tên" type="text" />
              </div>
              
              {/* CCCD */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">badge</span>
                  Số định danh cá nhân (CCCD)
                </label>
                <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none" placeholder="Nhập 12 số trên thẻ CCCD" type="text" />
              </div>
              
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">mail</span>
                  Email
                </label>
                <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none" placeholder="example@gmail.com" type="email" />
              </div>
              
              {/* Số điện thoại */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">call</span>
                  Số điện thoại
                </label>
                <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none" placeholder="09xx xxx xxx" type="tel" />
              </div>
              
              {/* Mật khẩu */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">lock</span>
                  Mật khẩu
                </label>
                <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none" placeholder="••••••••" type="password" />
              </div>
              
              {/* Nhập lại mật khẩu */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">lock_reset</span>
                  Xác nhận mật khẩu
                </label>
                <input className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none" placeholder="••••••••" type="password" />
              </div>
            </div>
            
            {/* Terms */}
            <div className="flex items-start gap-3 py-2">
              <input className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" id="terms" type="checkbox" />
              <label className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed" htmlFor="terms">
                Tôi xác nhận các thông tin trên là chính xác và đồng ý với <Link href="#" className="text-primary font-semibold hover:underline">Điều khoản sử dụng</Link> & <Link href="#" className="text-primary font-semibold hover:underline">Chính sách bảo mật</Link> của Cổng Dịch vụ công.
              </label>
            </div>
            
            {/* Action Button */}
            <Link href="/dang-nhap" className="w-full bg-primary text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/30 hover:bg-blue-700 hover:shadow-primary/40 transition-all text-lg tracking-wide flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">how_to_reg</span>
              Đăng ký ngay
            </Link>
            
            <div className="text-center pt-4">
              <p className="text-slate-600 dark:text-slate-400">
                Đã có tài khoản? <Link href="/dang-nhap" className="text-primary font-bold hover:underline">Đăng nhập ngay</Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      
    </div>
  );
}
