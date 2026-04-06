import React from 'react';
import Link from 'next/link';

export default function QuanLyTaiLieu() {
  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
              <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">Kho lưu trữ</h3>
              <nav className="mt-4 space-y-1">
                <Link className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-sm font-bold text-primary" href="#">
                  <span className="material-symbols-outlined text-[20px]">folder_open</span>
                  Tất cả tài liệu
                </Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800" href="#">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                  Định danh
                </Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800" href="#">
                  <span className="material-symbols-outlined text-[20px]">family_restroom</span>
                  Hộ tịch
                </Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800" href="#">
                  <span className="material-symbols-outlined text-[20px]">school</span>
                  Giáo dục
                </Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800" href="#">
                  <span className="material-symbols-outlined text-[20px]">medical_services</span>
                  Y tế
                </Link>
                <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800" href="#">
                  <span className="material-symbols-outlined text-[20px]">share_reviews</span>
                  Chia sẻ với cơ quan
                </Link>
              </nav>
            </div>

            {/* Security Indicators */}
            <div className="rounded-xl bg-green-50 p-4 ring-1 ring-green-100 dark:bg-green-950/20 dark:ring-green-900/30">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                <span className="text-xs font-bold uppercase">Bảo mật &amp; Xác thực</span>
              </div>
              <ul className="mt-3 space-y-2 text-xs text-green-800 dark:text-green-300">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Lưu trữ mã hóa AES-256
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Tài liệu đã xác thực số
                </li>
              </ul>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 space-y-6">
            {/* Page Title & Main Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Quản lý tài liệu cá nhân</h1>
                <p className="text-slate-500">Tổ chức và quản lý các giấy tờ quan trọng của bạn một cách bảo mật.</p>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
                <span className="material-symbols-outlined">upload_file</span>
                Tải lên tài liệu mới
              </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tổng dung lượng đã dùng</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">1.2 GB / 5.0 GB</p>
                  <div className="mt-3 h-2 w-48 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="w-1/4 h-full rounded-full bg-primary"></div>
                  </div>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <span className="material-symbols-outlined text-3xl">cloud_queue</span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-500">Tải lên gần đây</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">12 tài liệu</p>
                  <p className="mt-1 text-sm font-medium text-green-600">+3 trong tuần này</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <span className="material-symbols-outlined text-3xl">history</span>
                </div>
              </div>
            </div>

            {/* Document Explorer */}
            <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 overflow-hidden">
              {/* Search and Filter Bar */}
              <div className="border-b border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input className="w-full rounded-lg border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900" placeholder="Tìm kiếm tên tài liệu, loại hồ sơ..." type="text" />
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">filter_list</span>
                      Lọc
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">sort</span>
                      Sắp xếp
                    </button>
                  </div>
                </div>
              </div>

              {/* Document List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                      <th className="px-6 py-4">Tên tài liệu</th>
                      <th className="px-6 py-4">Danh mục</th>
                      <th className="px-6 py-4">Ngày tải lên</th>
                      <th className="px-6 py-4">Dung lượng</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded bg-red-100 p-2 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <span className="material-symbols-outlined text-[24px]">description</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Căn cước công dân (Mặt trước)</p>
                            <p className="text-xs text-slate-500">CCCD_NguyenVanAn_Front.pdf</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Định danh</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">12/05/2023</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">1.2 MB</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1 text-slate-400 hover:text-primary" title="Xem"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                          <button className="p-1 text-slate-400 hover:text-primary" title="Tải xuống"><span className="material-symbols-outlined text-[20px]">download</span></button>
                          <button className="p-1 text-slate-400 hover:text-slate-600" title="Thêm"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <span className="material-symbols-outlined text-[24px]">description</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Giấy khai sinh (Bản sao)</p>
                            <p className="text-xs text-slate-500">BirthCertificate_An.pdf</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Hộ tịch</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">20/01/2024</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">2.5 MB</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1 text-slate-400 hover:text-primary" title="Xem"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                          <button className="p-1 text-slate-400 hover:text-primary" title="Tải xuống"><span className="material-symbols-outlined text-[20px]">download</span></button>
                          <button className="p-1 text-slate-400 hover:text-slate-600" title="Thêm"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                            <span className="material-symbols-outlined text-[24px]">school</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Bằng Tốt nghiệp Đại học</p>
                            <p className="text-xs text-slate-500">Degree_University_An.jpg</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Giáo dục</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">15/02/2024</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">4.8 MB</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1 text-slate-400 hover:text-primary" title="Xem"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                          <button className="p-1 text-slate-400 hover:text-primary" title="Tải xuống"><span className="material-symbols-outlined text-[20px]">download</span></button>
                          <button className="p-1 text-slate-400 hover:text-slate-600" title="Thêm"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 dark:border-slate-800">
                <p className="text-sm text-slate-500">Hiển thị <span className="font-medium">1-4</span> của <span className="font-medium">12</span> tài liệu</p>
                <div className="flex gap-2">
                  <button className="rounded border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400" disabled>Trước</button>
                  <button className="rounded border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">Sau</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      
    </div>
  );
}
