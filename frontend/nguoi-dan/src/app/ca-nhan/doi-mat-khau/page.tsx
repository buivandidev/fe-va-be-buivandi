 'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { fetchApi, unwrapApiEnvelope } from "@/lib/api";

export default function DoiMatKhauCaNhan() {
  const [matKhauHienTai, setMatKhauHienTai] = useState("");
  const [matKhauMoi, setMatKhauMoi] = useState("");
  const [xacNhanMatKhauMoi, setXacNhanMatKhauMoi] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!matKhauHienTai || !matKhauMoi || !xacNhanMatKhauMoi) {
      setError("Vui lòng nhập đầy đủ các trường mật khẩu.");
      return;
    }

    if (matKhauMoi !== xacNhanMatKhauMoi) {
      setError("Xác nhận mật khẩu mới không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetchApi("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matKhauHienTai,
          matKhauMoi,
          xacNhanMatKhauMoi,
        }),
      });
      const payload = await res.json().catch(() => null);
      const { success, message: apiMessage } = unwrapApiEnvelope(payload);

      if (!res.ok || !success) {
        setError(apiMessage || "Đổi mật khẩu thất bại.");
        return;
      }

      setMessage("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/dang-nhap";
      }, 1200);
    } catch {
      setError("Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 h-full bg-background-light dark:bg-background-dark flex flex-col font-display text-slate-900 dark:text-slate-100">
      {/* Header */}
      

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <Link href="/ca-nhan" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined gov-icon">dashboard</span>
              <span className="font-medium text-sm">Tổng quan</span>
            </Link>
            <Link href="/ca-nhan/ho-so" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined gov-icon">person</span>
              <span className="font-medium text-sm">Hồ sơ cá nhân</span>
            </Link>
            <Link href="/ca-nhan/doi-mat-khau" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-colors">
              <span className="material-symbols-outlined gov-icon">password</span>
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
              <form className="max-w-md space-y-6" onSubmit={handleSubmit}>
                {message && (
                  <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                  </p>
                )}
                {error && (
                  <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mật khẩu hiện tại</label>
                  <input 
                    type="password" 
                    value={matKhauHienTai}
                    onChange={(e) => setMatKhauHienTai(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Nhập mật khẩu hiện tại" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={matKhauMoi}
                    onChange={(e) => setMatKhauMoi(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Tối thiểu 8 ký tự, có chữ và số" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={xacNhanMatKhauMoi}
                    onChange={(e) => setXacNhanMatKhauMoi(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none" 
                    placeholder="Nhập lại mật khẩu mới" 
                  />
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button type="submit" disabled={loading} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? "Đang xử lý..." : "Lưu thay đổi"}
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
