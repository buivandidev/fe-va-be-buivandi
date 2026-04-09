'use client'

import Link from "next/link";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { fetchApi, resolveMediaUrl, unwrapApiEnvelope } from "@/lib/api";

type HoSoNguoiDung = {
  hoTen?: string;
  HoTen?: string;
  email?: string;
  Email?: string;
  soDienThoai?: string | null;
  SoDienThoai?: string | null;
  anhDaiDien?: string | null;
  AnhDaiDien?: string | null;
};

type AvatarUploadResult = {
  anhDaiDien?: string;
  AnhDaiDien?: string;
  avatarUrl?: string;
};

export default function HoSoCaNhan() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [email, setEmail] = useState("");
  const [anhDaiDien, setAnhDaiDien] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetchApi("/api/public/profile", { cache: "no-store" });
      const payload = await res.json().catch(() => null);
      const { success, message: apiMessage, data } = unwrapApiEnvelope<HoSoNguoiDung>(payload);
      if (!res.ok || !success || !data) {
        setError(apiMessage || "Không tải được hồ sơ cá nhân.");
        return;
      }

      setHoTen(data.hoTen ?? data.HoTen ?? "");
      setEmail(data.email ?? data.Email ?? "");
      setSoDienThoai((data.soDienThoai ?? data.SoDienThoai ?? "") || "");
      setAnhDaiDien(data.anhDaiDien ?? data.AnhDaiDien ?? null);
    } catch {
      setError("Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!hoTen.trim()) {
      setError("Họ tên không được để trống.");
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetchApi("/api/public/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hoTen: hoTen.trim(),
          soDienThoai: soDienThoai.trim() || null,
        }),
      });

      const payload = await res.json().catch(() => null);
      const { success, message: apiMessage } = unwrapApiEnvelope(payload);
      if (!res.ok || !success) {
        setError(apiMessage || "Lưu thay đổi thất bại.");
        return;
      }

      setMessage(apiMessage || "Đã lưu thay đổi.");
      await loadProfile();
    } catch {
      setError("Không thể kết nối máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("tep", file);

      const res = await fetchApi("/api/public/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const payload = await res.json().catch(() => null);
      const { success, message: apiMessage, data } = unwrapApiEnvelope<AvatarUploadResult>(payload);
      if (!res.ok || !success) {
        setError(apiMessage || "Tải ảnh đại diện thất bại.");
        return;
      }

      const avatarFromApi = data?.anhDaiDien ?? data?.AnhDaiDien ?? data?.avatarUrl ?? null;
      setAnhDaiDien(avatarFromApi);
      setMessage(apiMessage || "Đã cập nhật ảnh đại diện.");
      await loadProfile();
    } catch {
      setError("Không thể kết nối máy chủ.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteAvatar = () => {
    void (async () => {
      setError(null);
      setMessage(null);
      setUploadingAvatar(true);
      try {
        const res = await fetchApi("/api/public/profile/avatar", {
          method: "DELETE",
        });
        const payload = await res.json().catch(() => null);
        const { success, message: apiMessage } = unwrapApiEnvelope(payload);
        if (!res.ok || !success) {
          setError(apiMessage || "Xóa ảnh đại diện thất bại.");
          return;
        }
        setAnhDaiDien(null);
        setMessage(apiMessage || "Đã xóa ảnh đại diện.");
        await loadProfile();
      } catch {
        setError("Không thể kết nối máy chủ.");
      } finally {
        setUploadingAvatar(false);
      }
    })();
  };

  const goToChangePassword = () => {
    window.location.href = "/ca-nhan/doi-mat-khau";
  };

  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <main className="flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 px-4 md:px-0">
          <form onSubmit={handleSave}>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
              <h1 className="gov-section-title text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Hồ sơ cá nhân</h1>
              <div className="flex gap-3">
                <Link href="/ca-nhan" className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold transition-all hover:bg-slate-300">
                  Hủy bỏ
                </Link>
                <button type="submit" disabled={saving || loading} className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>

            {message && <p className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
            {error && <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 mb-6 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative group">
                  <Image
                    src={resolveMediaUrl(anhDaiDien, "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=User")}
                    alt="Avatar"
                    width={128}
                    height={128}
                    unoptimized
                    className="object-cover bg-center bg-no-repeat aspect-square rounded-full size-32 ring-4 ring-primary/10"
                  />
                </div>
                <div className="flex flex-col gap-2 text-center md:text-left">
                  <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Ảnh đại diện</h2>
                  <p className="text-slate-500 text-sm">Tải lên ảnh mới. Định dạng hỗ trợ: JPG, PNG, WEBP, GIF.</p>
                  <div className="flex gap-2 mt-2 justify-center md:justify-start">
                    <button type="button" onClick={openFilePicker} disabled={uploadingAvatar} className="flex items-center gap-2 rounded-lg px-4 py-2 bg-primary/10 text-primary text-sm font-bold border border-primary/20 hover:bg-primary/20 disabled:opacity-60">
                      <span className="material-symbols-outlined text-sm">upload</span>
                      {uploadingAvatar ? "Đang tải..." : "Tải ảnh lên"}
                    </button>
                    <button type="button" onClick={handleDeleteAvatar} disabled={uploadingAvatar || !anhDaiDien} className="flex items-center gap-2 rounded-lg px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed">
                      Xóa ảnh
                    </button>
                  </div>
                  <input id="file-upload-input" ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" title="Tải lên ảnh đại diện" />
                </div>
              </div>
            </div>

            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold">Thông tin cá nhân</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="hoTenInput" className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Họ và tên</label>
                  <input id="hoTenInput" value={hoTen} onChange={(e) => setHoTen(e.target.value)} className="form-input w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" placeholder="Nhập họ và tên đầy đủ" type="text" aria-label="Họ và tên" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="emailInput" className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Email</label>
                  <input id="emailInput" value={email} disabled className="form-input w-full rounded-lg border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400" type="email" aria-label="Email" />
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">contact_page</span>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold">Thông tin liên lạc</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="soDienThoaiInput" className="text-slate-700 dark:text-slate-300 text-sm font-semibold">Số điện thoại</label>
                    <input id="soDienThoaiInput" value={soDienThoai} onChange={(e) => setSoDienThoai(e.target.value)} className="form-input w-full rounded-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white" type="tel" placeholder="Nhập số điện thoại" aria-label="Số điện thoại" />
                  </div>
                </div>
              </div>
            </section>

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
                  <button type="button" onClick={goToChangePassword} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-primary hover:bg-slate-50">
                    Đổi mật khẩu
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-900 dark:text-white font-semibold">Xác thực 2 lớp (2FA)</span>
                    <span className="text-slate-500 text-sm">Tính năng sẽ được bật trong bản cập nhật tiếp theo.</span>
                  </div>
                  <input id="2fa-toggle" className="sr-only peer" type="checkbox" disabled aria-label="Bật xác thực hai lớp" />
                  <div className="w-11 h-6 rounded-full bg-slate-300 dark:bg-slate-700 opacity-60"></div>
                </div>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}
