import React from 'react';
import Link from 'next/link';

export default function HoSoCaNhan() {
  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <main className="flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 px-4 md:px-0">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Hồ sơ cá nhân</h1>
              <div className="flex gap-3">
                <Link href="/ca-nhan" className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold transition-all hover:bg-slate-300">
                  Hủy bỏ
                </Link>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90">
                  Lưu thay đổi
                </button>
              </div>
            </div>

            {/* Profile Picture Upload Area */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 mb-6 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative group">
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 ring-4 ring-primary/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAEWmjz1ijoPyvPgVr4_hInd2lWW_eLz2mWBAJXIdksf-jscN9ILsEyyAOsMbV-6BZ4LQy9dveara7t2v-dyXD0Ga8F0DPYhC6iWTuxmwnWkqOjsEwFjtxG0Mb8EKdCAJJOFHG19qariGlioLI-wT1fNYg-0zvj86oJ9DDZE25Yi5X1cnhVMtQ0PJ8lLBawrecXR9gYvomaq7HUrQHsH5cCeFzYJrf_SxlF2oYVlKahAuQL8NUtQvyiDGG6itFgJpm0pBV07UTLUX8")' }}></div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="material-symbols-outlined text-white">photo_camera</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-center md:text-left">
                  <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Ảnh đại diện</h2>
                  <p className="text-slate-500 text-sm">Tải lên ảnh mới. Định dạng hỗ trợ: JPG, PNG. Tối đa 2MB.</p>
                  <div className="flex gap-2 mt-2 justify-center md:justify-start">
                    <button className="flex items-center gap-2 rounded-lg px-4 py-2 bg-primary/10 text-primary text-sm font-bold border border-primary/20 hover:bg-primary/20">
                      <span className="material-symbols-outlined text-sm">upload</span>
                      Tải ảnh lên
                    </button>
                    <button className="flex items-center gap-2 rounded-lg px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200">
                      Xóa ảnh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold">Thông tin cá nhân</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Họ và tên</label>
                  <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" placeholder="Nhập họ và tên đầy đủ" type="text" defaultValue="Nguyễn Văn A"  title="Input" aria-label="Input" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Ngày sinh</label>
                  <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" type="date" defaultValue="1990-01-01"  title="Input" aria-label="Input" placeholder="Nhập..." />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Giới tính</label>
                  <select className="form-select w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" defaultValue="male" title="Select" aria-label="Select">
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Số CMND/CCCD</label>
                  <input className="form-input w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" placeholder="Số định danh cá nhân" type="text" defaultValue="001234567890"  title="Input" aria-label="Input" />
                </div>
              </div>
            </section>

            {/* Contact Details */}
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">contact_page</span>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold">Thông tin liên lạc</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Số điện thoại</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">call</span>
                      <input className="form-input w-full pl-10 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" type="tel" defaultValue="0987 654 321"  title="Input" aria-label="Input" placeholder="Nhập..." />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Email</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                      <input className="form-input w-full pl-10 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" type="email" defaultValue="nguyenvana@example.gov.vn"  title="Input" aria-label="Input" placeholder="Nhập..." />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Địa chỉ thường trú</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">location_on</span>
                    <textarea className="form-textarea w-full pl-10 rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white min-h-[100px]" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" defaultValue="Số 123, đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh" />
                  </div>
                </div>
              </div>
            </section>

            {/* Account Security */}
          <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-12">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">security</span>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold">Bảo mật tài khoản</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-900 dark:text-white font-semibold">Mật khẩu</span>
                    <span className="text-slate-500 text-sm">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-primary hover:bg-slate-50">
                    Đổi mật khẩu
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-900 dark:text-white font-semibold">Xác thực 2 lớp (2FA)</span>
                    <span className="text-slate-500 text-sm">Tăng cường bảo mật bằng mã OTP qua tin nhắn</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" type="checkbox" defaultChecked  title="Input" aria-label="Input" placeholder="Nhập..." />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
          </section>
        </div>
      </main>
    </div>
  );
}
