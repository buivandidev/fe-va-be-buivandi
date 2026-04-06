import React from 'react';
import Link from 'next/link';

export default function ThongBaoMoi() {
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
                <Link className="flex items-center justify-between px-3 py-2.5 bg-primary text-white rounded-lg transition-all shadow-sm shadow-primary/20" href="/ca-nhan/thong-bao">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">notifications_active</span>
                    <span className="text-sm font-semibold">Hộp thư thông báo</span>
                  </div>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group" href="/ca-nhan/quan-ly-ho-so">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">file_copy</span>
                  <span className="text-sm font-medium">Hồ sơ của tôi</span>
                </Link>
              </nav>
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Hộp thư thông báo</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý các thông báo, giấy tờ từ cơ quan nhà nước gửi cho bạn.</p>
              </div>
              <div className="flex gap-2">
                 <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50">
                    <span className="material-symbols-outlined text-[20px]">done_all</span>
                    Đánh dấu đã đọc tất cả
                 </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Nofitication Item 1 (Unread) */}
                <div className="p-4 sm:p-6 bg-blue-50/50 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex gap-4">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between gap-4 items-start">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Hồ sơ đăng ký khai sinh đã có kết quả</h4>
                        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">2 giờ trước</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Hồ sơ mã số H00.01.23.045 của quý khách đã được xử lý xong. Quý khách vui lòng đến UBND Phường Bến Thành để nhận lại kết quả hoặc kiểm tra tài liệu điện tử.</p>
                    <div className="mt-3">
                         <button className="text-primary text-sm font-bold hover:underline">Xem chi tiết hồ sơ</button>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                </div>

                {/* Nofitication Item 2 (Unread) */}
                <div className="p-4 sm:p-6 bg-blue-50/50 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex gap-4">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <span className="material-symbols-outlined">error</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between gap-4 items-start">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Yêu cầu bổ sung tài liệu hồ sơ</h4>
                        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">1 ngày trước</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Hồ sơ H00.01.23.089 cần được bổ sung thêm bản sao sổ hộ khẩu trước ngày 15/11/2023. Vui lòng cập nhật sớm nhất có thể.</p>
                    <div className="mt-3">
                         <button className="text-primary text-sm font-bold hover:underline">Bổ sung hồ sơ ngay</button>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                </div>

                 {/* Nofitication Item 3 (Read) */}
                <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex gap-4">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined">receipt_long</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between gap-4 items-start">
                        <h4 className="text-base font-bold text-slate-700 dark:text-slate-300 leading-tight">Thanh toán lệ phí thành công</h4>
                        <span className="text-xs font-medium text-slate-400 whitespace-nowrap">3 ngày trước</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Bạn đã thanh toán thành công 135,000 VND cho lệ phí dịch vụ công. (Mã giao dịch: PAY-4919320).</p>
                  </div>
                </div>

              </div>
              
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
                 <button className="text-primary text-sm font-bold hover:underline">Tải thêm thông báo cũ hơn</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
