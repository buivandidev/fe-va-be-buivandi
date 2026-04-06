import React from 'react';
import Link from 'next/link';

export default function DashboardCaNhan() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex-1 h-full">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Chức năng chính</h3>
              </div>
              <nav className="p-2 space-y-1">
                <Link className="flex items-center gap-3 px-3 py-2.5 bg-primary text-white rounded-lg transition-all shadow-sm shadow-primary/20" href="/dich-vu-cong">
                  <span className="material-symbols-outlined text-xl">add_circle</span>
                  <span className="text-sm font-semibold">Nộp hồ sơ mới</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group" href="#">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">calendar_month</span>
                  <span className="text-sm font-medium">Lịch hẹn của tôi</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group" href="/ca-nhan/ho-so">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">manage_accounts</span>
                  <span className="text-sm font-medium">Thông tin tài khoản</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group" href="/ca-nhan/tai-lieu">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">folder_open</span>
                  <span className="text-sm font-medium">Quản lý tài liệu</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group border-t border-slate-100 dark:border-slate-800 mt-2 pt-4" href="#">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">lock_reset</span>
                  <span className="text-sm font-medium">Đổi mật khẩu</span>
                </Link>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all group">
                  <span className="material-symbols-outlined text-xl">logout</span>
                  <span className="text-sm font-medium">Đăng xuất</span>
                </button>
              </nav>
            </div>
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-5 border border-primary/10">
              <h4 className="font-bold text-sm text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">info</span>
                Trợ giúp trực tuyến
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Nếu bạn gặp khó khăn trong quá trình thực hiện thủ tục, hãy liên hệ tổng đài 1900.xxxx để được hỗ trợ.
              </p>
              <button className="w-full py-2 bg-white dark:bg-slate-800 text-primary text-xs font-bold rounded-lg border border-primary/20 hover:bg-primary hover:text-white transition-all">
                Liên hệ ngay
              </button>
            </div>
          </aside>
          <div className="flex-1 space-y-8">
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Chào mừng, Nguyễn Văn A</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">history</span>
                  Đăng nhập lần cuối: 10:30, 24/10/2023
                </p>
              </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                    <span className="material-symbols-outlined">pending_actions</span>
                  </div>
                  <span className="text-green-600 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+1 mới</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Hồ sơ đang xử lý</p>
                <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 tracking-tight">05</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                  <span className="text-green-600 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+12 tháng này</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Hồ sơ đã hoàn thành</p>
                <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 tracking-tight">128</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <span className="text-red-600 text-xs font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">03 chưa đọc</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Thông báo mới</p>
                <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 tracking-tight">03</p>
              </div>
            </section>
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Hồ sơ nộp gần đây</h3>
                <Link className="text-primary text-sm font-bold hover:underline flex items-center gap-1" href="#">
                  Xem tất cả
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã hồ sơ</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên thủ tục</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Ngày nộp</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100">H00.01.23.001</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block truncate max-w-xs">Cấp đổi Giấy phép lái xe</span>
                        <span className="text-xs text-slate-400">Sở Giao thông vận tải</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">20/10/2023</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                          Đang xử lý
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100">H00.01.23.045</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block truncate max-w-xs">Đăng ký khai sinh</span>
                        <span className="text-xs text-slate-400">UBND Phường/Xã</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">15/10/2023</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          Đã trả kết quả
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100">H00.01.23.089</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block truncate max-w-xs">Xác nhận tình trạng hôn nhân</span>
                        <span className="text-xs text-slate-400">Sở Tư Pháp</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">10/10/2023</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                          Cần bổ sung
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
      
    </div>
  );
}
