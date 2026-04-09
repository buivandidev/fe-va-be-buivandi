"use client";

import Link from "next/link";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchApi, unwrapApiEnvelope } from "@/lib/api";

type DangNhapResult = {
  maTruyCap?: string;
  MaTruyCap?: string;
  token?: string;
  Token?: string;
};

function chuanHoaDuongDanDieuHuong(returnUrl: string | null): string {
  if (!returnUrl || !returnUrl.startsWith("/")) {
    return "/ca-nhan";
  }

  return returnUrl;
}

export default function DangNhapPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 h-full flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
          <span className="text-sm text-slate-500 dark:text-slate-400">Đang tải trang đăng nhập...</span>
        </div>
      }
    >
      <DangNhapPageContent />
    </Suspense>
  );
}

function DangNhapPageContent() {
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [nhoDangNhap, setNhoDangNhap] = useState(false);
  const [hienMatKhau, setHienMatKhau] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [thongBaoLoi, setThongBaoLoi] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const returnUrl = useMemo(
    () => chuanHoaDuongDanDieuHuong(searchParams?.get("returnUrl") ?? null),
    [searchParams]
  );
  const vuaDangKyThanhCong = searchParams?.get("registered") === "1";

  const handleDangNhap = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setDangGui(true);
    setThongBaoLoi(null);

    try {
      const res = await fetchApi("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          matKhau,
          nhoDangNhap,
        }),
      });

      const payload = await res.json().catch(() => null);
      console.log('📦 Login response:', { status: res.ok, payload });
      
      const { success, message, data } = unwrapApiEnvelope<DangNhapResult>(payload);

      const token =
        data?.maTruyCap ??
        data?.MaTruyCap ??
        data?.token ??
        data?.Token ??
        (payload as { maTruyCap?: string; token?: string } | null)?.maTruyCap ??
        (payload as { maTruyCap?: string; token?: string } | null)?.token;

      console.log('🔑 Extracted token:', token ? token.substring(0, 30) + '...' : 'NONE');

      if (!res.ok || !success || !token) {
        setThongBaoLoi(message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        return;
      }

      console.log('✅ Đăng nhập thành công, token:', token.substring(0, 20) + '...');
      localStorage.setItem("token", token);
      localStorage.setItem("lastLoginAt", new Date().toISOString());
      
      // Dispatch custom event to notify Header
      window.dispatchEvent(new Event("userLoggedIn"));
      
      console.log('🔄 Chuyển hướng đến:', returnUrl);
      router.push(returnUrl);
    } catch (error) {
      console.error(error);
      setThongBaoLoi("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
    } finally {
      setDangGui(false);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      <main className="flex-grow flex items-center justify-center p-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-none">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Đăng nhập hệ thống</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Vui lòng đăng nhập để tiếp tục sử dụng dịch vụ công</p>
              </div>

              <form className="space-y-5" onSubmit={handleDangNhap}>
                {vuaDangKyThanhCong && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-300">
                    Đăng ký thành công. Vui lòng đăng nhập để tiếp tục sử dụng dịch vụ.
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined gov-icon absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white placeholder:text-slate-400"
                      placeholder="Nhập email của bạn"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu</label>
                    <Link href="/quen-mat-khau" className="text-xs font-bold text-primary hover:underline">Quên mật khẩu?</Link>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined gov-icon absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                    <input
                      className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white placeholder:text-slate-400"
                      placeholder="Nhập mật khẩu"
                      type={hienMatKhau ? "text" : "password"}
                      value={matKhau}
                      onChange={(e) => setMatKhau(e.target.value)}
                      required
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      type="button"
                      onClick={() => setHienMatKhau((v) => !v)}
                    >
                      <span className="material-symbols-outlined gov-icon text-xl">{hienMatKhau ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                    id="remember"
                    type="checkbox"
                    checked={nhoDangNhap}
                    onChange={(e) => setNhoDangNhap(e.target.checked)}
                  />
                  <label className="ml-2 text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">Ghi nhớ đăng nhập</label>
                </div>

                {thongBaoLoi && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-300">
                    {thongBaoLoi}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={dangGui}
                  className="block text-center w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {dangGui ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Chưa có tài khoản? <Link href="/dang-ky" className="text-primary font-bold hover:underline">Đăng ký ngay</Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
            <span className="material-symbols-outlined gov-icon text-sm">verified_user</span>
            <span className="text-xs">Kết nối được bảo mật bằng mã hóa 256-bit</span>
          </div>
        </div>
      </main>
    </div>
  );
}
