import React from 'react';
import Link from 'next/link';

export default function LichSuThanhToan() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex-1 h-full">
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 py-4">
              <nav className="px-2 space-y-1">
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg" href="/ca-nhan">
                  <span className="material-symbols-outlined text-xl">dashboard</span>
                  <span className="text-sm font-medium">Tổng quan</span>
                </Link>
                <Link className="flex items-center justify-between px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg" href="/ca-nhan/quan-ly-ho-so">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">file_copy</span>
                    <span className="text-sm font-medium">Hồ sơ của tôi</span>
                  </div>
                </Link>
                <Link className="flex items-center justify-between px-3 py-2.5 bg-primary text-white rounded-lg shadow-sm shadow-primary/20" href="/ca-nhan/thanh-toan">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">receipt_long</span>
                    <span className="text-sm font-semibold">Thanh toán & Biên lai</span>
                  </div>
                </Link>
              </nav>
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Lịch sử thanh toán</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Theo dõi biên lai phí/lệ phí các dịch vụ công đã nộp.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã giao dịch</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nội dung nộp phí</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Số tiền</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Ngày nộp</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Trạng thái/Biên lai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100">PAY-4919320</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block max-w-[200px] truncate" title="Lệ phí cấp đổi giấy phép lái xe">Lệ phí cấp đổi giấy phép lái xe</span>
                        <span className="text-xs text-slate-500">Mã HS: H00.01.23.001</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">135,000 ₫</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="text-sm text-slate-600 dark:text-slate-400">21/10/2023</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                           <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 uppercase">Thành công</span>
                           <button className="text-primary hover:text-primary/80" title="Tải biên lai PDF">
                               <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                           </button>
                        </div>
                      </td>
                    </tr>
                     <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100">PAY-4211119</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block max-w-[200px] truncate" title="Lệ phí chứng thực bản sao">Lệ phí chứng thực bản sao</span>
                        <span className="text-xs text-slate-500">Mã HS: H00.01.23.089</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">20,000 ₫</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className="text-sm text-slate-600 dark:text-slate-400">15/10/2023</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                           <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 uppercase">Thành công</span>
                           <button className="text-primary hover:text-primary/80" title="Tải biên lai PDF">
                               <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                           </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
