'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi, unwrapApiEnvelope } from '@/lib/api';

type ThongBaoItem = {
  id?: string; Id?: string;
  tieuDe?: string; TieuDe?: string;
  noiDung?: string; NoiDung?: string;
  lienKet?: string | null; LienKet?: string | null;
  daDoc?: boolean; DaDoc?: boolean;
  ngayTao?: string; NgayTao?: string;
};
type KetQuaPhanTrang<T> = { danhSach?: T[]; DanhSach?: T[] };
type SoLuongChuaDoc = { soLuongChuaDoc?: number };

function relativeTime(value?: string): string {
  if (!value) return '--';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '--';
  const diffMin = Math.max(1, Math.floor((Date.now() - d.getTime()) / 60000));
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  return `${Math.floor(diffHour / 24)} ngày trước`;
}

export default function ThongBaoMoi() {
  const [items, setItems] = useState<ThongBaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAll, setSavingAll] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/dang-nhap?returnUrl=%2Fca-nhan%2Fthong-bao');
      return;
    }

    let mounted = true;
    void (async () => {
      try {
        const [listRes, countRes] = await Promise.all([
          fetchApi('/api/public/notifications?trang=1&kichThuocTrang=30', { cache: 'no-store' }),
          fetchApi('/api/public/notifications/count', { cache: 'no-store' }),
        ]);

        const listPayload = await listRes.json().catch(() => null);
        const listData = unwrapApiEnvelope<KetQuaPhanTrang<ThongBaoItem>>(listPayload);
        if (mounted && listRes.ok && listData.success && listData.data) {
          const arr = Array.isArray(listData.data.danhSach)
            ? listData.data.danhSach
            : Array.isArray(listData.data.DanhSach)
              ? listData.data.DanhSach
              : [];
          setItems(arr);
        }

        const countPayload = await countRes.json().catch(() => null);
        const countData = unwrapApiEnvelope<SoLuongChuaDoc>(countPayload);
        if (mounted && countRes.ok && countData.success) {
          setUnreadCount(countData.data?.soLuongChuaDoc ?? 0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  const markAllRead = async () => {
    setSavingAll(true);
    setNotice(null);
    try {
      const res = await fetchApi('/api/public/notifications/read-all', { method: 'PATCH' });
      const payload = await res.json().catch(() => null);
      const x = unwrapApiEnvelope(payload);
      if (!res.ok || !x.success) {
        setNotice(x.message ?? 'Không thể đánh dấu đã đọc.');
        return;
      }
      setItems((prev) => prev.map((n) => ({ ...n, daDoc: true, DaDoc: true })));
      setUnreadCount(0);
      setNotice('Đã đánh dấu tất cả thông báo là đã đọc.');
    } finally {
      setSavingAll(false);
    }
  };

  const unreadBadge = useMemo(() => (unreadCount > 99 ? '99+' : String(unreadCount)), [unreadCount]);

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
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-all group" href="/ca-nhan">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">dashboard</span>
                  <span className="text-sm font-medium">Tổng quan</span>
                </Link>
                <Link className="flex items-center justify-between px-3 py-2.5 bg-primary text-white rounded-lg transition-all shadow-sm shadow-primary/20" href="/ca-nhan/thong-bao">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">notifications_active</span>
                    <span className="text-sm font-semibold">Hộp thư thông báo</span>
                  </div>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadBadge}</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-all group" href="/ca-nhan/quan-ly-ho-so">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">file_copy</span>
                  <span className="text-sm font-medium">Hồ sơ của tôi</span>
                </Link>
              </nav>
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Hộp thư thông báo</h2>
                <p className="text-slate-500 mt-1">Quản lý các thông báo từ cơ quan nhà nước gửi cho bạn.</p>
              </div>
              <button
                onClick={() => void markAllRead()}
                disabled={savingAll || unreadCount === 0}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[20px]">done_all</span>
                {savingAll ? 'Đang cập nhật...' : 'Đánh dấu đã đọc tất cả'}
              </button>
            </div>

            {notice && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">{notice}</div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <div className="p-6 text-sm text-slate-500">Đang tải thông báo...</div>
                ) : items.length === 0 ? (
                  <div className="p-6 text-sm text-slate-500">Chưa có thông báo nào.</div>
                ) : (
                  items.map((n) => {
                    const id = n.id ?? n.Id ?? '';
                    const tieuDe = n.tieuDe ?? n.TieuDe ?? 'Thông báo';
                    const noiDung = n.noiDung ?? n.NoiDung ?? '';
                    const daDoc = n.daDoc ?? n.DaDoc ?? false;
                    const link = n.lienKet ?? n.LienKet ?? null;
                    const ngay = relativeTime(n.ngayTao ?? n.NgayTao);
                    return (
                      <div key={id || `${tieuDe}-${ngay}`} className={`p-4 sm:p-6 transition-colors flex gap-4 ${daDoc ? 'bg-white' : 'bg-blue-50/50'}`}>
                        <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center ${daDoc ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                          <span className="material-symbols-outlined">notifications</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between gap-4 items-start">
                            <h4 className={`text-base font-bold leading-tight ${daDoc ? 'text-slate-700' : 'text-slate-900'}`}>{tieuDe}</h4>
                            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{ngay}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{noiDung}</p>
                          {link && (
                            <div className="mt-3">
                              <Link href={link} className="text-primary text-sm font-bold hover:underline">Xem chi tiết</Link>
                            </div>
                          )}
                        </div>
                        {!daDoc && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
