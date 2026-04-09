"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  lePhiTaiThoiDiemNop?: number;
  LePhiTaiThoiDiemNop?: number;
  trangThaiThanhToanLePhi?: number;
  TrangThaiThanhToanLePhi?: number;
};

type PagedResponse<T> = {
  danhSach?: T[];
  DanhSach?: T[];
};

type HoSoThanhToan = {
  id: string;
  maTheoDoi: string;
  tenDichVu: string;
  emailNguoiNop?: string;
  lePhi: number;
  trangThaiThanhToanLePhi: number;
};

type TaoLienKetThanhToanResult = {
  urlThanhToan?: string;
  UrlThanhToan?: string;
  paymentUrl?: string;
};

function layNhanTrangThaiThanhToan(trangThai: number): {
  label: string;
  className: string;
} {
  switch (trangThai) {
    case 1:
      return {
        label: "Chờ thanh toán",
        className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      };
    case 2:
      return {
        label: "Đã thanh toán",
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      };
    case 3:
      return {
        label: "Thanh toán thất bại",
        className: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
      };
    case 4:
      return {
        label: "Đã hủy",
        className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      };
    default:
      return {
        label: "Không yêu cầu",
        className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      };
  }
}

export default function ThanhToanPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 flex-1 h-full flex items-center justify-center">
            <p className="text-sm text-slate-500">Đang tải trang thanh toán...</p>
        </div>
      }
    >
      <ThanhToanPageContent />
    </Suspense>
  );
}

function ThanhToanPageContent() {
  const [hoSos, setHoSos] = useState<HoSoThanhToan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dangTaoLinkId, setDangTaoLinkId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentResultMessage, setPaymentResultMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams?.get('paymentStatus');
    if (status === '00') {
      setPaymentResultMessage({ text: 'Thanh toán lệ phí thành công! Hồ sơ của bạn đã được chuyển sang trạng thái chờ xử lý.', type: 'success' });
    } else if (status && status !== '00') {
      setPaymentResultMessage({ text: 'Giao dịch không thành công hoặc đã bị hủy. Vui lòng thử lại.', type: 'error' });
    }
  }, [searchParams]);

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

        const chuanHoa = danhSachRaw
          .map((item) => {
            const id = item.id ?? item.Id ?? "";
            const maTheoDoi = item.maTheoDoi ?? item.MaTheoDoi ?? "";
            const tenDichVu = item.tenDichVu ?? item.TenDichVu ?? "Dịch vụ công";
            const emailNguoiNop = item.emailNguoiNop ?? item.EmailNguoiNop;
            const lePhi = item.lePhiTaiThoiDiemNop ?? item.LePhiTaiThoiDiemNop ?? 0;
            const trangThaiThanhToanLePhi =
              item.trangThaiThanhToanLePhi ?? item.TrangThaiThanhToanLePhi ?? 0;

            return {
              id,
              maTheoDoi,
              tenDichVu,
              emailNguoiNop,
              lePhi,
              trangThaiThanhToanLePhi,
            } as HoSoThanhToan;
          })
          .filter((item) => item.id && item.maTheoDoi && item.lePhi > 0);

        if (mounted) {
          setHoSos(chuanHoa);
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

  const dsThanhToan = useMemo(
    () => hoSos.filter((x) => x.trangThaiThanhToanLePhi !== 0),
    [hoSos],
  );

  const handleTaoLienKetThanhToan = async (item: HoSoThanhToan) => {
    setErrorMessage(null);
    setDangTaoLinkId(item.id);
    try {
      const res = await fetchApi(`/api/public/applications/${item.id}/payment-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailNguoiNop: item.emailNguoiNop,
        }),
      });

      const payload = await res.json().catch(() => null);
      const { success, message, data } = unwrapApiEnvelope<TaoLienKetThanhToanResult>(payload);

      const urlThanhToan = data?.urlThanhToan ?? data?.UrlThanhToan ?? data?.paymentUrl;
      if (!res.ok || !success || !urlThanhToan) {
        setErrorMessage(message || "Không thể tạo liên kết thanh toán.");
        return;
      }

      window.location.href = urlThanhToan;
    } catch (error) {
      console.error(error);
      setErrorMessage("Không thể kết nối tới hệ thống thanh toán.");
    } finally {
      setDangTaoLinkId(null);
    }
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
                <Link
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group"
                  href="/ca-nhan"
                >
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">dashboard</span>
                  <span className="text-sm font-medium">Tổng quan</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all group"
                  href="/ca-nhan/quan-ly-ho-so"
                >
                  <span className="material-symbols-outlined text-xl group-hover:text-primary">file_copy</span>
                  <span className="text-sm font-medium">Hồ sơ của tôi</span>
                </Link>
                <Link
                  className="flex items-center gap-3 px-3 py-2.5 bg-primary text-white rounded-lg transition-all shadow-sm shadow-primary/20"
                  href="/ca-nhan/thanh-toan"
                >
                  <span className="material-symbols-outlined text-xl">receipt_long</span>
                  <span className="text-sm font-semibold">Thanh toán lệ phí</span>
                </Link>
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="gov-section-title text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined gov-icon text-primary text-3xl">payments</span>
                Thanh toán lệ phí
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                Danh sách hồ sơ có yêu cầu thanh toán trực tuyến.
              </p>
            </div>

            {paymentResultMessage && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 ${
                paymentResultMessage.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-900/30 dark:text-emerald-300' 
                  : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/20 dark:border-rose-900/30 dark:text-rose-300'
              }`}>
                <span className="material-symbols-outlined">
                  {paymentResultMessage.type === 'success' ? 'check_circle' : 'error'}
                </span>
                <p className="font-medium text-sm">{paymentResultMessage.text}</p>
                <button 
                  onClick={() => setPaymentResultMessage(null)}
                  className="ml-auto text-current opacity-60 hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}

            {errorMessage ? (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Mã hồ sơ</th>
                      <th className="px-5 py-4">Dịch vụ</th>
                      <th className="px-5 py-4 text-right">Lệ phí</th>
                      <th className="px-5 py-4 text-center">Trạng thái</th>
                      <th className="px-5 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : dsThanhToan.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                          Không có hồ sơ nào cần thanh toán.
                        </td>
                      </tr>
                    ) : (
                      dsThanhToan.map((item) => {
                        const tt = layNhanTrangThaiThanhToan(item.trangThaiThanhToanLePhi);
                        const choThanhToan = item.trangThaiThanhToanLePhi === 1;
                        const dangXuLy = dangTaoLinkId === item.id;

                        return (
                          <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100">{item.maTheoDoi}</td>
                            <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{item.tenDichVu}</td>
                            <td className="px-5 py-4 text-right font-bold text-slate-900 dark:text-slate-100">
                              {item.lePhi.toLocaleString("vi-VN")} đ
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${tt.className}`}>
                                {tt.label}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              {choThanhToan ? (
                                <button
                                  onClick={() => void handleTaoLienKetThanhToan(item)}
                                  disabled={dangXuLy}
                                  className="inline-flex items-center justify-center px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 disabled:opacity-70"
                                >
                                  {dangXuLy ? "Đang tạo..." : "Thanh toán"}
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400">-</span>
                              )}
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
