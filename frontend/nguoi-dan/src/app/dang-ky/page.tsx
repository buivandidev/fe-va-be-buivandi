"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi, unwrapApiEnvelope } from "@/lib/api";

export default function DangKyPage() {
  const [hoTen, setHoTen] = useState("");
  const [cccd, setCccd] = useState("");
  const [email, setEmail] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
  const [chapNhanDieuKhoan, setChapNhanDieuKhoan] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [thongBaoLoi, setThongBaoLoi] = useState<string | null>(null);

  const router = useRouter();

  const handleDangKy = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setThongBaoLoi(null);

    if (!chapNhanDieuKhoan) {
      setThongBaoLoi("Bạn cần đồng ý điều khoản sử dụng trước khi đăng ký.");
      return;
    }

    if (matKhau.length < 8) {
      setThongBaoLoi("Mật khẩu cần tối thiểu 8 ký tự.");
      return;
    }

    if (matKhau !== xacNhanMatKhau) {
      setThongBaoLoi("Mật khẩu xác nhận không khớp.");
      return;
    }

    setDangGui(true);

    try {
      const res = await fetchApi("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hoTen: hoTen.trim(),
          email: email.trim(),
          matKhau,
          xacNhanMatKhau,
          soDienThoai: soDienThoai.trim() || undefined,
          // Backend hiện không lưu CCCD trong DTO đăng ký, giữ lại ở UI để người dân khai báo.
          cccd: cccd.trim() || undefined,
        }),
      });

      const payload = await res.json().catch(() => null);
      const { success, message } = unwrapApiEnvelope(payload);

      if (!res.ok || !success) {
        setThongBaoLoi(message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
        return;
      }

      router.push(`/dang-nhap?registered=1&returnUrl=${encodeURIComponent("/ca-nhan/thanh-toan")}`);
    } catch (error) {
      console.error(error);
      setThongBaoLoi("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
    } finally {
      setDangGui(false);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <main className="flex-1 flex justify-center py-12 px-4">
        <div className="w-full max-w-[640px] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden text-sm">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h1 className="gov-section-title text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight mb-2 text-center">Đăng ký tài khoản công dân</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base text-center">Vui lòng điền đầy đủ thông tin bên dưới để khởi tạo tài khoản định danh quốc gia.</p>
          </div>

          <form className="p-8 space-y-6" onSubmit={handleDangKy}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined gov-icon text-sm text-primary">person</span>
                  Họ và tên
                </label>
                <input
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none"
                  placeholder="Nhập đầy đủ họ và tên"
                  type="text"
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined gov-icon text-sm text-primary">badge</span>
                  Số định danh cá nhân (CCCD)
                </label>
                <input
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none"
                  placeholder="Nhập 12 số trên thẻ CCCD"
                  type="text"
                  value={cccd}
                  onChange={(e) => setCccd(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined gov-icon text-sm text-primary">mail</span>
                  Email
                </label>
                <input
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none"
                  placeholder="example@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined gov-icon text-sm text-primary">call</span>
                  Số điện thoại
                </label>
                <input
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none"
                  placeholder="09xx xxx xxx"
                  type="tel"
                  value={soDienThoai}
                  onChange={(e) => setSoDienThoai(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined gov-icon text-sm text-primary">lock</span>
                  Mật khẩu
                </label>
                <input
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none"
                  placeholder="••••••••"
                  type="password"
                  value={matKhau}
                  onChange={(e) => setMatKhau(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined gov-icon text-sm text-primary">lock_reset</span>
                  Xác nhận mật khẩu
                </label>
                <input
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-primary focus:border-primary h-12 px-4 text-base outline-none"
                  placeholder="••••••••"
                  type="password"
                  value={xacNhanMatKhau}
                  onChange={(e) => setXacNhanMatKhau(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input
                className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                id="terms"
                type="checkbox"
                checked={chapNhanDieuKhoan}
                onChange={(e) => setChapNhanDieuKhoan(e.target.checked)}
              />
              <label className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed" htmlFor="terms">
                Tôi xác nhận các thông tin trên là chính xác và đồng ý với <Link href="/dieu-khoan" className="text-primary font-semibold hover:underline">Điều khoản sử dụng</Link> & <Link href="/chinh-sach" className="text-primary font-semibold hover:underline">Chính sách bảo mật</Link> của Cổng Dịch vụ công.
              </label>
            </div>

            {thongBaoLoi && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-300">
                {thongBaoLoi}
              </div>
            )}

            <button
              type="submit"
              disabled={dangGui}
              className="w-full bg-primary text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/30 hover:bg-primary-dark hover:shadow-primary/40 transition-all text-lg tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined gov-icon">how_to_reg</span>
              {dangGui ? "Đang đăng ký..." : "Đăng ký ngay"}
            </button>

            <div className="text-center pt-4">
              <p className="text-slate-600 dark:text-slate-400">
                Đã có tài khoản? <Link href="/dang-nhap" className="text-primary font-bold hover:underline">Đăng nhập ngay</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
