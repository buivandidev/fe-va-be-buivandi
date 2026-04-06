import { buildApiUrl, isGuid, unwrapApiEnvelope } from "./api";

// Cấu trúc Dịch vụ công từ Backend
export interface DichVuDto {
  id: string;
  maDichVu: string;
  ten: string;
  moTa: string;
  soNgayXuLy: number;
  lePhi: number | null;
  dangHoatDong: boolean;
  mucDo: number;
  linhVucId: string | null;
  tenLinhVuc: string | null;
}

export interface PagedResult<T> {
  muc?: T[];
  danhSach?: T[];
  tongSoTrang?: number;
  tongTrang?: number;
  tongSoMuc?: number;
  tongBanGhi?: number;
}

export async function fetchServices(
  page: number,
  keyword: string = "",
  category: string = ""
): Promise<{ items: DichVuDto[]; totalPages: number; totalCount?: number }> {
  try {
    const query = new URLSearchParams();
    query.append("trang", page.toString());
    query.append("kichThuocTrang", "6");
    if (keyword) query.append("tuKhoa", keyword);
    if (category && isGuid(category)) query.append("danhMucId", category);

    const res = await fetch(buildApiUrl(`/api/services?${query.toString()}`), {
      cache: "no-store",
    });

    if (!res.ok) return { items: [], totalPages: 1 };

    const payload = await res.json();
    const { success, data } = unwrapApiEnvelope<PagedResult<DichVuDto>>(payload);

    if (success && data) {
      const items = Array.isArray(data.muc)
        ? data.muc
        : Array.isArray(data.danhSach)
        ? data.danhSach
        : [];

      const totalPages =
        typeof data.tongSoTrang === "number"
          ? data.tongSoTrang
          : typeof data.tongTrang === "number"
          ? data.tongTrang
          : 1;

      const totalCount =
        typeof data.tongSoMuc === "number"
          ? data.tongSoMuc
          : typeof data.tongBanGhi === "number"
          ? data.tongBanGhi
          : undefined;

      return { items, totalPages: totalPages < 1 ? 1 : totalPages, totalCount };
    }
  } catch (error) {
    console.error("Lỗi khi fetch API dịch vụ:", error);
  }

  return { items: [], totalPages: 1 };
}
