import Link from "next/link";

export default function DoiMatKhauCaNhan() {
  return (
    <div className="flex-1 h-full bg-background-light dark:bg-background-dark flex flex-col font-display text-slate-900 dark:text-slate-100">
      {/* Header */}
      

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <Link href="/ca-nhan" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-medium text-sm">Tổng quan</span>
            </Link>
            <Link href="/ca-nhan/ho-so" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">person</span>
              <span className="font-medium text-sm">Hồ sơ cá nhân</span>
            </Link>
            <Link href="/ca-nhan/doi-mat-khau" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-colors">
              <span className="material-symbols-outlined">password</span>
              <span className="font-medium text-sm">Đổi mật khẩu</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold">Đổi mật khẩu</h2>
              <p className="text-sm text-slate-500 mt-1">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
            </div>
            <div className="p-6">
              <form className="max-w-md space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mật khẩu hiện tại</label>
                  <input 
                    type="password" 
                    className="w-full h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Nhập mật khẩu hiện tại" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    className="w-full h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Tối thiểu 8 ký tự, có chữ và số" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    className="w-full h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Nhập lại mật khẩu mới" 
                  />
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                    Lưu thay đổi
                  </button>
                  <button type="button" className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2 px-6 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
