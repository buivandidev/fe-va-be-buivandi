"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchApi, unwrapApiEnvelope } from "@/lib/api";

type HoSoApiItem = {
  id?: string;
  Id?: string;
  maTheoDoi?: string;
  MaTheoDoi?: string;
  tenDichVu?: string;
  TenDichVu?: string;
  emailNguoiNop?: string;
  EmailNguoiNop?: string;
  ngayNop?: string;
  NgayNop?: string;
  ngayTao?: string;
  NgayTao?: string;
  trangThai?: number;
  TrangThai?: number;
  trangThaiThanhToanLePhi?: number;
  TrangThaiThanhToanLePhi?: number;
};

type PagedResponse<T> = {
  danhSach?: T[];
  DanhSach?: T[];
};

type HoSoItem = {
  id: string;
  maTheoDoi: string;
  tenDichVu: string;
  emailNguoiNop?: string;
  ngayNop?: string;
  trangThai: number;
  trangThaiThanhToanLePhi: number;
};

function layTrangThaiHoSo(trangThai: number): { label: string; className: string } {
  switch (trangThai) {
    case 1:
      return {
        label: "Đang xử lý",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      };
    case 2:
      return {
        label: "Hoàn thành",
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      };
    case 3:
      return {
        label: "Từ chối",
        className: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
      };
    case 4:
      return {
        label: "Yêu cầu bổ sung",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      };
    default:
      return {
        label: "Chờ xử lý",
        className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      };
  }
}

function layTrangThaiThanhToan(trangThai: number): { label: string; className: string } {
  switch (trangThai) {
    case 1:
      return {
        label: "Chờ nộp",
        className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      };
    case 2:
      return {
        label: "Đã nộp",
        className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      };
    default:
      return {
        label: "Không yêu cầu",
        className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      };
  }
}

function dinhDangNgay(giaTri?: string): string {
  if (!giaTri) return "-";
  const ngay = new Date(giaTri);
  if (Number.isNaN(ngay.getTime())) return "-";
  return ngay.toLocaleDateString("vi-VN");
}

export default function QuanLyHoSoPage() {
  const [hoSos, setHoSos] = useState<HoSoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/dang-nhap");
      return;
    }

    let mounted = true;

    const taiDuLieu = async () => {
      try {
        const res = await fetchApi("/api/public/applications?kichThuocTrang=100", {
          cache: "no-store",
        });

        const payload = await res.json().catch(() => null);
        const { success, data } = unwrapApiEnvelope<PagedResponse<HoSoApiItem>>(payload);

        if (!res.ok || !success || !data) {
          if (mounted) {
            setHoSos([]);
          }
          return;
        }

        const danhSachRaw = Array.isArray(data.danhSach)
          ? data.danhSach
          : Array.isArray(data.DanhSach)
            ? data.DanhSach
            : [];

        const dsChuanHoa = danhSachRaw
          .map((item) => ({
            id: item.id ?? item.Id ?? "",
            maTheoDoi: item.maTheoDoi ?? item.MaTheoDoi ?? "",
            tenDichVu: item.tenDichVu ?? item.TenDichVu ?? "Dịch vụ công",
            emailNguoiNop: item.emailNguoiNop ?? item.EmailNguoiNop,
            ngayNop: item.ngayNop ?? item.NgayNop ?? item.ngayTao ?? item.NgayTao,
            trangThai: item.trangThai ?? item.TrangThai ?? 0,
            trangThaiThanhToanLePhi:
              item.trangThaiThanhToanLePhi ?? item.TrangThaiThanhToanLePhi ?? 0,
          }))
          .filter((item) => item.id && item.maTheoDoi);

        if (mounted) {
          setHoSos(dsChuanHoa);
        }
      } catch (error) {
        console.error(error);
        if (mounted) {
          setHoSos([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void taiDuLieu();

    return () => {
      mounted = false;
    };
  }, [router]);

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
                <Link
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group"
                  href="/ca-nhan"
                >
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">dashboard</span>
                  <span className="text-sm font-medium">Tổng quan</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2.5 bg-primary text-white rounded-lg transition-all shadow-sm shadow-primary/20"
                  href="/ca-nhan/quan-ly-ho-so"
                >
                  <span className="material-symbols-outlined text-xl">file_copy</span>
                  <span className="text-sm font-semibold">Hồ sơ của tôi</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group"
                  href="/ca-nhan/thanh-toan"
                >
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">receipt_long</span>
                  <span className="text-sm font-medium">Thanh toán lệ phí</span>
                </Link>
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-3xl">folder_shared</span>
                Quản lý hồ sơ
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Theo dõi trạng thái hồ sơ đã nộp.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Mã hồ sơ</th>
                      <th className="px-5 py-4">Dịch vụ</th>
                      <th className="px-5 py-4">Ngày nộp</th>
                      <th className="px-5 py-4">Trạng thái</th>
                      <th className="px-5 py-4">Thanh toán</th>
                      <th className="px-5 py-4 text-right">Tra cứu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : hoSos.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                          Bạn chưa nộp hồ sơ nào.
                        </td>
                      </tr>
                    ) : (
                      hoSos.map((item) => {
                        const trangThai = layTrangThaiHoSo(item.trangThai);
                        const thanhToan = layTrangThaiThanhToan(item.trangThaiThanhToanLePhi);
                        const href = item.emailNguoiNop
                          ? `/tra-cuu?ma=${encodeURIComponent(item.maTheoDoi)}&email=${encodeURIComponent(item.emailNguoiNop)}`
                          : `/tra-cuu?ma=${encodeURIComponent(item.maTheoDoi)}`;

                        return (
                          <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">{item.maTheoDoi}</td>
                            <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{item.tenDichVu}</td>
                            <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{dinhDangNgay(item.ngayNop)}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${trangThai.className}`}>
                                {trangThai.label}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${thanhToan.className}`}>
                                {thanhToan.label}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <Link
                                href={href}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                              </Link>
                            </td>
                          </tr>
                        );
                      })
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
