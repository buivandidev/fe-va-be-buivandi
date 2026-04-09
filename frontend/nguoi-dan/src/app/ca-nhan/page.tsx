'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi, unwrapApiEnvelope } from '@/lib/api';

type HoSoNguoiDung = { hoTen?: string; HoTen?: string };
type DonUngApiItem = {
  maTheoDoi?: string; MaTheoDoi?: string;
  tenDichVu?: string; TenDichVu?: string;
  ngayNop?: string; NgayNop?: string;
  trangThai?: number | string; TrangThai?: number | string;
  nhanTrangThai?: string; NhanTrangThai?: string;
};
type KetQuaPhanTrang<T> = { danhSach?: T[]; DanhSach?: T[] };
type SoLuongChuaDoc = { soLuongChuaDoc?: number };
type HoSoGanDay = {
  maHoSo: string;
  tenThuTuc: string;
  ngayNop: string;
  trangThaiLabel: string;
  badgeClass: string;
};

const STATUS_LABELS: Record<string, { label: string; bgColor: string; icon: string }> = {
  ChoXuLy: { label: 'Chờ xử lý', icon: 'schedule', bgColor: 'bg-amber-50 text-amber-700 border-amber-100' },
  DangXuLy: { label: 'Đang xử lý', icon: 'sync', bgColor: 'bg-blue-50 text-blue-700 border-blue-100' },
  HoanThanh: { label: 'Hoàn thành', icon: 'check_circle', bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  TuChoi: { label: 'Từ chối', icon: 'cancel', bgColor: 'bg-rose-50 text-rose-700 border-rose-100' }
};

function formatDate(value?: string): string {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function mapTrangThaiLabel(item: DonUngApiItem): string {
  const label = item.nhanTrangThai ?? item.NhanTrangThai;
  if (label) return label;
  const raw = item.trangThai ?? item.TrangThai;
  if (typeof raw === 'string') return STATUS_LABELS[raw]?.label || raw;
  switch (raw) {
    case 0: return STATUS_LABELS.ChoXuLy.label;
    case 1: return STATUS_LABELS.DangXuLy.label;
    case 2: return STATUS_LABELS.HoanThanh.label;
    case 3: return STATUS_LABELS.TuChoi.label;
    default: return STATUS_LABELS.DangXuLy.label;
  }
}

function mapBadgeClass(trangThai: string | number | undefined): string {
  if (typeof trangThai === 'string' && STATUS_LABELS[trangThai]) return STATUS_LABELS[trangThai].bgColor;
  if (typeof trangThai === 'number') {
    switch (trangThai) {
      case 0: return STATUS_LABELS.ChoXuLy.bgColor;
      case 1: return STATUS_LABELS.DangXuLy.bgColor;
      case 2: return STATUS_LABELS.HoanThanh.bgColor;
      case 3: return STATUS_LABELS.TuChoi.bgColor;
      default: return STATUS_LABELS.DangXuLy.bgColor;
    }
  }
  const label = String(trangThai || '').toLowerCase();
  if (label.includes('hoàn') || label.includes('đã trả')) return STATUS_LABELS.HoanThanh.bgColor;
  if (label.includes('từ chối')) return STATUS_LABELS.TuChoi.bgColor;
  if (label.includes('chờ')) return STATUS_LABELS.ChoXuLy.bgColor;
  return STATUS_LABELS.DangXuLy.bgColor;
}

export default function DashboardCaNhan() {
  const [hoTen, setHoTen] = useState('Người dùng');
  const [hoSoGanDay, setHoSoGanDay] = useState<HoSoGanDay[]>([]);
  const [tongDangXuLy, setTongDangXuLy] = useState(0);
  const [tongHoanThanh, setTongHoanThanh] = useState(0);
  const [soThongBaoChuaDoc, setSoThongBaoChuaDoc] = useState(0);
  const [lastLoginLabel, setLastLoginLabel] = useState('Chưa có dữ liệu');
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/dang-nhap?returnUrl=%2Fca-nhan');
      return;
    }

    // Calculate last login label once
    const rawLastLogin = localStorage.getItem('lastLoginAt');
    let loginLabel = 'Chưa có thông tin';
    if (rawLastLogin) {
      const d = new Date(rawLastLogin);
      if (!Number.isNaN(d.getTime())) {
        loginLabel = `${d.toLocaleTimeString('vi-VN')}, ${d.toLocaleDateString('vi-VN')}`;
      }
    }
    setLastLoginLabel(loginLabel);

    void (async () => {
      try {
        const [profileRes, appsRes, unreadRes] = await Promise.all([
          fetchApi('/api/public/profile', { cache: 'no-store' }),
          fetchApi('/api/public/applications?trang=1&kichThuocTrang=100', { cache: 'no-store' }),
          fetchApi('/api/public/notifications/count', { cache: 'no-store' }),
        ]);

        const profilePayload = await profileRes.json().catch(() => null);
        const profile = unwrapApiEnvelope<HoSoNguoiDung>(profilePayload);
        if (profileRes.ok && profile.success && profile.data) {
          setHoTen(profile.data.hoTen ?? profile.data.HoTen ?? 'Người dùng');
        }

        const appsPayload = await appsRes.json().catch(() => null);
        const apps = unwrapApiEnvelope<KetQuaPhanTrang<DonUngApiItem>>(appsPayload);
        if (appsRes.ok && apps.success && apps.data) {
          const list = Array.isArray(apps.data.danhSach) ? apps.data.danhSach : Array.isArray(apps.data.DanhSach) ? apps.data.DanhSach : [];
          const normalized = list.map((item) => {
            const trangThaiLabel = mapTrangThaiLabel(item);
            const trangThaiKey = item.trangThai ?? item.TrangThai;
            return {
              maHoSo: item.maTheoDoi ?? item.MaTheoDoi ?? '',
              tenThuTuc: item.tenDichVu ?? item.TenDichVu ?? 'Dịch vụ công',
              ngayNop: formatDate(item.ngayNop ?? item.NgayNop),
              trangThaiLabel,
              badgeClass: mapBadgeClass(trangThaiKey),
            };
          }).filter((x) => x.maHoSo);

          setHoSoGanDay(normalized.slice(0, 5));
          setTongDangXuLy(normalized.filter((x) => {
            const s = x.trangThaiLabel.toLowerCase();
            return s.includes('chờ') || s.includes('đang') || s.includes('tiếp nhận') || s.includes('bổ sung');
          }).length);
          setTongHoanThanh(normalized.filter((x) => x.trangThaiLabel.toLowerCase().includes('hoàn')).length);
        }

        const unreadPayload = await unreadRes.json().catch(() => null);
        const unread = unwrapApiEnvelope<SoLuongChuaDoc>(unreadPayload);
        if (unreadRes.ok && unread.success && unread.data?.soLuongChuaDoc != null) {
          setSoThongBaoChuaDoc(unread.data.soLuongChuaDoc);
        }
      } catch (error) {
        console.error('Error dashboard:', error);
      }
    })();
  }, [router]);

  const nhanThongBao = useMemo(() => (soThongBaoChuaDoc > 99 ? '99+' : String(soThongBaoChuaDoc)), [soThongBaoChuaDoc]);

  const dangXuat = () => {
    localStorage.removeItem('token');
    router.push('/dang-nhap');
  };

  return (
    <div className="bg-slate-50/50 dark:bg-background-dark min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Enhanced Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none p-6">
              <div className="flex flex-col items-center p-6 bg-primary/5 rounded-[2rem] mb-8 border border-primary/10">
                 <div className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-black mb-4 shadow-xl shadow-primary/20">
                    {hoTen.charAt(0)}
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white text-center line-clamp-1">{hoTen}</h3>
                 <p className="text-xs font-bold text-primary mt-1 uppercase tracking-widest">Tài khoản công dân</p>
              </div>

              <nav className="space-y-2">
                <Link className="flex items-center gap-3 px-5 py-3.5 bg-primary text-white rounded-2xl transition-all shadow-xl shadow-primary/20 font-black text-sm" href="/dich-vu-cong">
                  <span className="material-symbols-outlined text-xl">add_box</span>
                  Nộp hồ sơ mới
                </Link>
                {[
                  { icon: 'history', label: 'Quản lý hồ sơ', href: '/ca-nhan/ho-so' },
                  { icon: 'calendar_today', label: 'Lịch hẹn trực tiếp', href: '/ca-nhan/lich-hen' },
                  { icon: 'notifications_active', label: 'Thông báo hệ thống', href: '/ca-nhan/thong-bao' },
                  { icon: 'folder_shared', label: 'Kho tài liệu số', href: '/ca-nhan/quan-ly-tai-lieu' },
                ].map((item) => (
                  <Link key={item.href} className="flex items-center gap-3 px-5 py-3.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all font-bold text-sm" href={item.href}>
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={dangXuat} className="w-full flex items-center gap-3 px-5 py-3.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-all font-black text-sm">
                    <span className="material-symbols-outlined text-xl font-black">logout</span>
                    ĐĂNG XUẤT
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Right Content */}
          <div className="flex-1 space-y-10">
            {/* Elegant Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1">
                <nav className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Trung tâm điều hành cá nhân
                </nav>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Chào buổi sáng, <br className="md:hidden"/> {hoTen.split(' ').pop()}!</h2>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-base">login</span> Truy cập cuối: {lastLoginLabel}</span>
                </div>
              </div>
            </section>

            {/* Premium Stat Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Hồ sơ đang xử lý', value: tongDangXuLy, color: 'primary', icon: 'pending_actions' },
                { label: 'Hồ sơ đã trả kết quả', value: tongHoanThanh, color: 'emerald', icon: 'verified' },
                { label: 'Tin nhắn/Thông báo', value: soThongBaoChuaDoc, color: 'amber', icon: 'notifications' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                  <div className="flex items-center justify-between mb-4">
                     <span className={`material-symbols-outlined text-${stat.color}-500 text-3xl font-black`}>{stat.icon}</span>
                     <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Số liệu</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{String(stat.value).padStart(2, '0')}</p>
                </div>
              ))}
            </section>

            {/* Smart Application Table */}
            <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-8 md:p-10 border-b border-slate-50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Lịch sử nộp hồ sơ</h3>
                  <p className="text-sm font-medium text-slate-400 italic">Hiển thị 5 hồ sơ gần nhất của bạn</p>
                </div>
                <Link className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-all flex items-center gap-2" href="/ca-nhan/ho-so">
                  XEM TẤT CẢ
                  <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                </Link>
              </div>
              
              <div className="overflow-x-auto p-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mã biên nhận</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Thủ tục / Dịch vụ</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Ngày gửi</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {hoSoGanDay.length === 0 ? (
                      <tr>
                        <td className="px-6 py-20 text-center" colSpan={4}>
                          <div className="flex flex-col items-center gap-4 opacity-30">
                            <span className="material-symbols-outlined text-7xl">workspaces</span>
                            <p className="font-black text-lg text-slate-900 dark:text-white">Sẵn sàng chờ đón những hồ sơ đầu tiên của bạn!</p>
                          </div>
                        </td>
                      </tr>
                    ) : hoSoGanDay.map((hoSo) => (
                      <tr key={hoSo.maHoSo} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-6 py-6">
                          <span className="text-sm font-black text-slate-400 font-mono tracking-wider">{hoSo.maHoSo}</span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-sm font-black text-slate-800 dark:text-slate-200 block truncate max-w-xs group-hover:text-primary transition-colors">{hoSo.tenThuTuc}</span>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className="text-sm font-bold text-slate-500 font-mono">{hoSo.ngayNop}</span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${hoSo.badgeClass}`}>
                             {hoSo.trangThaiLabel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
