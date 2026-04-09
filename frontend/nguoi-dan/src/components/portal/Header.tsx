 "use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchApi, unwrapApiEnvelope } from "@/lib/api";

type HoSoNguoiDung = {
  hoTen?: string;
  HoTen?: string;
};

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      console.log('🔐 Header: Checking auth, token:', token ? 'EXISTS' : 'NONE');
      
      if (!token) {
        setIsAuthenticated(false);
        setDisplayName(null);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(true);
      
      try {
        const res = await fetchApi("/api/public/profile", { cache: "no-store" });
        
        console.log('📡 Header: Profile API status:', res.status);
        
        if (res.status === 401) {
          // Token thực sự không hợp lệ
          console.warn('⚠️ Header: Token invalid (401), clearing...');
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setDisplayName(null);
          setIsLoading(false);
          return;
        }
        
        if (!res.ok) {
          // Lỗi khác (500, 503, etc.) - giữ token, chỉ không hiển thị tên
          console.warn('⚠️ Header: API error but keeping token, status:', res.status);
          setDisplayName(null);
          setIsLoading(false);
          return;
        }

        const payload = await res.json();
        const { success, data } = unwrapApiEnvelope<HoSoNguoiDung>(payload);
        
        console.log('📡 Header: Profile API response:', { ok: res.ok, success, hasData: !!data });
        
        if (!success || !data) {
          console.warn('⚠️ Header: Invalid response format');
          setDisplayName(null);
          setIsLoading(false);
          return;
        }
        
        const name = data.hoTen ?? data.HoTen ?? null;
        console.log('✅ Header: Authenticated as', name);
        setDisplayName(name);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Header: Error checking auth:', error);
        // Keep authenticated state from token even if profile fetch fails
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        console.log('🔄 Header: Token changed in storage, rechecking...');
        checkAuth();
      }
    };

    // Listen for custom login event
    const handleLoginEvent = () => {
      console.log('🔄 Header: Login event received, rechecking...');
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleLoginEvent);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleLoginEvent);
    };
  }, []);

  const shortName = useMemo(() => {
    if (!displayName) return "Tài khoản";
    const parts = displayName.trim().split(/\s+/);
    return parts.slice(-2).join(" ");
  }, [displayName]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setDisplayName(null);
    window.location.href = "/dang-nhap";
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <span className="material-symbols-outlined gov-icon text-primary text-3xl">travel_explore</span>
              <h1 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight hidden sm:block">
                Cổng Dịch vụ công
              </h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="gov-nav-link hover:text-primary transition-colors">Trang chủ</Link>
            <Link href="/tin-tuc" className="gov-nav-link hover:text-primary transition-colors">Tin tức</Link>
            <Link href="/dich-vu-cong" className="gov-nav-link hover:text-primary transition-colors">Thủ tục hành chính</Link>
            <Link href="/thu-vien" className="gov-nav-link hover:text-primary transition-colors">Thư viện</Link>
            <Link href="/tra-cuu" className="gov-nav-link hover:text-primary transition-colors">Tra cứu hồ sơ</Link>
            <Link href="/lien-he" className="gov-nav-link hover:text-primary transition-colors">Liên hệ</Link>
          </nav>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"></div>
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/ca-nhan"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
                >
                  {shortName}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link href="/dang-nhap" className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-primary-dark transition">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
