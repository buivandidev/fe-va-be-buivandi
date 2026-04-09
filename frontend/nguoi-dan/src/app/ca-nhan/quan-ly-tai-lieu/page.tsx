'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi, unwrapApiEnvelope } from '@/lib/api';

type TepItem = {
  id?: string; Id?: string;
  tenTep?: string; TenTep?: string;
  kichThuocTep?: number; KichThuocTep?: number;
  urlTep?: string | null; UrlTep?: string | null;
};
type DonUngApiItem = {
  maTheoDoi?: string; MaTheoDoi?: string;
  tenDichVu?: string; TenDichVu?: string;
  danhSachTep?: TepItem[]; DanhSachTep?: TepItem[];
};
type KetQuaPhanTrang<T> = { danhSach?: T[]; DanhSach?: T[] };
type TaiLieuHienThi = { id: string; tenTep: string; maHoSo: string; tenDichVu: string; sizeText: string; url: string };

function formatSize(bytes?: number): string {
  const b = bytes ?? 0;
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export default function QuanLyTaiLieuPage() {
  const [docs, setDocs] = useState<TaiLieuHienThi[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/dang-nhap?returnUrl=%2Fca-nhan%2Fquan-ly-tai-lieu');
      return;
    }

    let mounted = true;
    void (async () => {
      try {
        const res = await fetchApi('/api/public/applications?trang=1&kichThuocTrang=100', { cache: 'no-store' });
        const payload = await res.json().catch(() => null);
        const data = unwrapApiEnvelope<KetQuaPhanTrang<DonUngApiItem>>(payload);
        if (!mounted || !res.ok || !data.success || !data.data) return;

        const list = Array.isArray(data.data.danhSach) ? data.data.danhSach : Array.isArray(data.data.DanhSach) ? data.data.DanhSach : [];
        const files: TaiLieuHienThi[] = [];
        for (const app of list) {
          const ma = app.maTheoDoi ?? app.MaTheoDoi ?? '';
          const tenDv = app.tenDichVu ?? app.TenDichVu ?? 'Dịch vụ công';
          const teps = Array.isArray(app.danhSachTep) ? app.danhSachTep : Array.isArray(app.DanhSachTep) ? app.DanhSachTep : [];
          for (const t of teps) {
            const id = t.id ?? t.Id ?? `${ma}-${t.tenTep ?? t.TenTep ?? 'tep'}`;
            const tenTep = t.tenTep ?? t.TenTep ?? 'Tệp đính kèm';
            const url = t.urlTep ?? t.UrlTep ?? '';
            files.push({ id, tenTep, maHoSo: ma, tenDichVu: tenDv, sizeText: formatSize(t.kichThuocTep ?? t.KichThuocTep), url });
          }
        }
        setDocs(files);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter((d) =>
      d.tenTep.toLowerCase().includes(q) ||
      d.maHoSo.toLowerCase().includes(q) ||
      d.tenDichVu.toLowerCase().includes(q),
    );
  }, [docs, keyword]);

  const handleDownload = (url: string) => {
    if (!url) {
      setMessage('Tệp này chưa có liên kết tải xuống.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-all group" href="/dich-vu-cong">
                  <span className="material-symbols-outlined text-xl">add_circle</span>
                  <span className="text-sm font-semibold">Nộp hồ sơ mới</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-all group" href="/ca-nhan/quan-ly-ho-so">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">file_copy</span>
                  <span className="text-sm font-medium">Hồ sơ của tôi</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 bg-primary text-white rounded-lg transition-all shadow-sm shadow-primary/20" href="/ca-nhan/quan-ly-tai-lieu">
                  <span className="material-symbols-outlined text-xl">folder_open</span>
                  <span className="text-sm font-medium">Quản lý tài liệu</span>
                </Link>
                <Link className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-all group border-t border-slate-100 mt-2 pt-4" href="/ca-nhan/doi-mat-khau">
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">lock_reset</span>
                  <span className="text-sm font-medium">Đổi mật khẩu</span>
                </Link>
              </nav>
            </div>
          </aside>

          <div className="flex-1 space-y-6">
            <section>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Quản lý tài liệu</h2>
              <p className="text-slate-500 mt-1">Danh sách tài liệu đính kèm từ các hồ sơ bạn đã nộp.</p>
            </section>

            {message && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
                {message}
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm theo tên tệp, mã hồ sơ hoặc thủ tục..."
                  className="w-full rounded-lg border-slate-200 bg-white py-2 px-3 text-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Tệp</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã hồ sơ</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Thủ tục</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Dung lượng</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td className="px-5 py-8 text-center text-sm text-slate-500" colSpan={5}>Đang tải tài liệu...</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td className="px-5 py-8 text-center text-sm text-slate-500" colSpan={5}>Chưa có tài liệu đính kèm nào.</td></tr>
                    ) : (
                      filtered.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3 text-sm font-medium">{d.tenTep}</td>
                          <td className="px-5 py-3 text-sm font-mono">{d.maHoSo}</td>
                          <td className="px-5 py-3 text-sm text-slate-600">{d.tenDichVu}</td>
                          <td className="px-5 py-3 text-sm text-slate-600">{d.sizeText}</td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => handleDownload(d.url)}
                              className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90"
                            >
                              Tải xuống
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
