import Link from "next/link";
import Image from "next/image";

export default function DangNhap() {
  return (
    <div className="flex-1 h-full flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-none">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Đăng nhập hệ thống</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Vui lòng đăng nhập để tiếp tục sử dụng dịch vụ công</p>
              </div>
              <form className="space-y-5">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tên đăng nhập hoặc Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                    <input className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white placeholder:text-slate-400" placeholder="Nhập tài khoản của bạn" type="text" />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu</label>
                    <Link href="/quen-mat-khau" className="text-xs font-bold text-primary hover:underline">Quên mật khẩu?</Link>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                    <input className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white placeholder:text-slate-400" placeholder="Nhập mật khẩu" type="password" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" type="button">
                      <span className="material-symbols-outlined text-xl">visibility</span>
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary" id="remember" type="checkbox" />
                  <label className="ml-2 text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">Ghi nhớ đăng nhập</label>
                </div>

                {/* Submit Button */}
                <Link href="/ca-nhan" className="block text-center w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]">
                  Đăng nhập
                </Link>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Hoặc đăng nhập bằng</span>
                  </div>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" type="button">
                    <Image alt="Google" width={16} height={16} className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv8A3MsTi2Og0n-t7HRKXfFbPCX2vTgmLpbO56EZxOVsSgPifnQyndoNRdnJUPqQ1AE5MtN9YagSliZBLKljis0mTnLQdr7ajDvoOfai9M6bcZBEkKl7OS5NcyCcdJ9ZWn5Ctkasf1HqnE-FtUJLcabHOrIYgN-QRDwXKplsz-JKhx3WvhjEJ1dSjiG4GFF3_3JZSD0h0EitBj5aIzPH8zLPGad_AGWMerwp8OnNoSuitCKN1WRJ2gdqYic21o9T53zCNUWBuBCuQ" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" type="button">
                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-black">Z</div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Zalo</span>
                  </button>
                </div>
              </form>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Chưa có tài khoản? <Link href="/dang-ky" className="text-primary font-bold hover:underline">Đăng ký ngay</Link>
              </p>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="text-xs">Kết nối được bảo mật bằng mã hóa 256-bit</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      
    </div>
  );
}
