import React from 'react';
import Link from 'next/link';

export default function QuanLyHoSo() {
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
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group" href="/ca-nhan">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">dashboard</span>
                  <span className="text-sm font-medium">Tổng quan</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 bg-primary text-white rounded-lg transition-all shadow-sm shadow-primary/20" href="/ca-nhan/quan-ly-ho-so">
                  <span className="material-symbols-outlined text-xl">file_copy</span>
                  <span className="text-sm font-semibold">Hồ sơ của tôi</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group" href="/ca-nhan/thanh-toan">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">receipt_long</span>
                  <span className="text-sm font-medium">Thanh toán & Biên lai</span>
                </Link>
                 <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group" href="/ca-nhan/lich-hen">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">calendar_month</span>
                  <span className="text-sm font-medium">Lịch hẹn của tôi</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group" href="/ca-nhan/ho-so">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">manage_accounts</span>
                  <span className="text-sm font-medium">Thông tin tài khoản</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group border-t border-slate-100 dark:border-slate-800 mt-2 pt-4" href="#">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">lock_reset</span>
                  <span className="text-sm font-medium">Đổi mật khẩu</span>
                </Link>
              </nav>
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Quản lý hồ sơ Dịch vụ công</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Theo dõi tiến độ và trạng thái các hồ sơ đã nộp.</p>
              </div>
              <Link href="/dich-vu-cong" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Nộp hồ sơ mới
              </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex space-x-6 overflow-x-auto hide-scrollbar">
                  <button className="text-primary border-b-2 border-primary pb-4 text-sm font-bold whitespace-nowrap">Tất cả (15)</button>
                  <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent pb-4 text-sm font-medium whitespace-nowrap">Đang xử lý (5)</button>
                  <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent pb-4 text-sm font-medium whitespace-nowrap">Cần bổ sung (1)</button>
                  <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent pb-4 text-sm font-medium whitespace-nowrap">Đã hoàn thành (9)</button>
                  <button className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent pb-4 text-sm font-medium whitespace-nowrap">Đã rút/Hủy (0)</button>
                </div>
              </div>

              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input 
                      type="text" 
                      placeholder="Nhập mã hồ sơ hoặc tên thủ tục..." 
                      className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined text-[20px]">filter_list</span>
                    Lọc
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã hồ sơ</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tên thủ tục</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cơ quan tiếp nhận</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Ngày nộp</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <Link href="#" className="text-sm font-mono font-bold text-primary hover:underline">H00.01.23.001</Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block max-w-[250px] truncate" title="Cấp đổi Giấy phép lái xe do ngành GTVT cấp">Cấp đổi Giấy phép lái xe do ngành GTVT cấp</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Sở Giao thông vận tải</span>
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
                    
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <Link href="#" className="text-sm font-mono font-bold text-primary hover:underline">H00.01.23.045</Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block max-w-[250px] truncate" title="Đăng ký khai sinh">Đăng ký khai sinh</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">UBND Phường Bến Thành</span>
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

                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <Link href="#" className="text-sm font-mono font-bold text-primary hover:underline">H00.01.23.089</Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block max-w-[250px] truncate" title="Xác nhận tình trạng hôn nhân">Xác nhận tình trạng hôn nhân</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">UBND Phường Bến Thành</span>
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
                    
                     <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <Link href="#" className="text-sm font-mono font-bold text-primary hover:underline">H00.02.23.112</Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block max-w-[250px] truncate" title="Đăng ký thường trú">Đăng ký thường trú</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Công an Quận 1</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">01/10/2023</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          Mới tiếp nhận
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-500">Hiển thị 1-4 trong tổng số 15 hồ sơ</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 text-sm font-medium transition-colors" disabled>Trang trước</button>
                  <button className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors">Trang sau</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}
