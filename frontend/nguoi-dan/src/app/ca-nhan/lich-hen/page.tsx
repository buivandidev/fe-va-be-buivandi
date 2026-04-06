import React from 'react';
import Link from 'next/link';

export default function LichHenCuaToi() {
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
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group" href="/ca-nhan/quan-ly-ho-so">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">file_copy</span>
                  <span className="text-sm font-medium">Hồ sơ của tôi</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 bg-primary text-white rounded-lg transition-all shadow-sm shadow-primary/20" href="/ca-nhan/lich-hen">
                  <span className="material-symbols-outlined text-xl">calendar_month</span>
                  <span className="text-sm font-semibold">Lịch hẹn của tôi</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group" href="/ca-nhan/thanh-toan">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">receipt_long</span>
                  <span className="text-sm font-medium">Thanh toán & Biên lai</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group" href="/ca-nhan/ho-so">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">manage_accounts</span>
                  <span className="text-sm font-medium">Thông tin tài khoản</span>
                </Link>
              </nav>
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Lịch hẹn của tôi</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Danh sách các lịch hẹn nộp hồ sơ, nhận kết quả tại cơ quan nhà nước.</p>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
                <span className="material-symbols-outlined text-lg">edit_calendar</span>
                Đặt lịch hẹn mới
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card Lịch Hẹn Sắp Tới */}
                  <div className="border border-primary/30 bg-primary/5 rounded-xl p-5 relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Sắp tới</div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-lg w-16 h-16 shadow-sm border border-slate-100 dark:border-slate-700">
                        <span className="text-xs text-slate-500 font-bold uppercase">Tháng 11</span>
                        <span className="text-2xl text-primary font-black">05</span>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Nhận kết quả GPLX</h4>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mt-2">
                           <span className="material-symbols-outlined text-base">schedule</span>
                           08:30 - 09:30
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mt-1">
                           <span className="material-symbols-outlined text-base">domain</span>
                           Trung tâm Hành chính công Tỉnh
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mt-1">
                           <span className="material-symbols-outlined text-base">qr_code_2</span>
                           Mã hẹn: <b className="text-slate-900 dark:text-white">HM-1123-889</b>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-primary/20 flex gap-2">
                      <button className="flex-1 py-2 text-sm font-bold text-primary bg-white dark:bg-slate-800 border border-primary/20 rounded hover:bg-primary hover:text-white transition-colors">Xem chi tiết</button>
                      <button className="flex-1 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Hủy lịch</button>
                    </div>
                  </div>

                  {/* Card Lịch Hẹn Đã Qua */}
                  <div className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-lg w-16 h-16 shadow-sm border border-slate-100 dark:border-slate-700 opacity-80">
                        <span className="text-xs text-slate-500 font-bold uppercase">Tháng 10</span>
                        <span className="text-2xl text-slate-700 dark:text-slate-300 font-black">20</span>
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight line-through decoration-slate-400">Nộp hồ sơ Đăng ký khai sinh</h4>
                        <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                           <span className="material-symbols-outlined text-base">schedule</span>
                           14:00 - 15:00
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                           <span className="material-symbols-outlined text-base">domain</span>
                           UBND Phường Bến Thành
                        </div>
                        <span className="inline-flex w-fit items-center mt-2 px-2 py-0.5 rounded text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Đã hoàn thành
                        </span>
                      </div>
                    </div>
                  </div>
               </div>
               
               <div className="mt-8 text-center bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4">
                  <span className="material-symbols-outlined text-blue-500 text-3xl mb-2">info</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Quý khách vui lòng đến trước 10 phút để lấy số thứ tự theo lịch hẹn.<br/>Trường hợp không thể đến, vui lòng hủy lịch trước ít nhất 2 giờ.</p>
               </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
