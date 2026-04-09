import { buildApiUrl, unwrapApiEnvelope } from "./api";

export interface TeamMember {
  id: string;
  hoTen: string;
  chucVu: string;
  soDienThoai?: string;
  email?: string;
  anhDaiDien?: string;
}

export interface Department {
  id: string;
  tenPhongBan: string;
  soDienThoai?: string;
  email?: string;
  moTa?: string;
  loaiPhongBan?: number; // 0=Lãnh đạo, 1=Chuyên môn, 2=Đoàn thể
  thanhViens?: TeamMember[];
}

type BackendDepartment = {
  id: string;
  ten?: string;
  tenPhongBan?: string;
  soDienThoai?: string;
  email?: string;
  moTa?: string;
  loaiPhongBan?: number;
  trangThai?: boolean;
  dangHoatDong?: boolean;
  thanhViens?: TeamMember[];
};

export async function fetchDepartments(): Promise<Department[]> {
  try {
    const res = await fetch(buildApiUrl("/api/departments"), {
      cache: "no-store", // Lấy dữ liệu mới nhất
    });

    if (!res.ok) return [];

    const payload = await res.json();
    const { success, data } = unwrapApiEnvelope<BackendDepartment[]>(payload);

    if (success && Array.isArray(data)) {
      return data
        .map((item) => {
          const tenPhongBan = (item.tenPhongBan ?? item.ten ?? "").trim();
          const dangHoatDong = item.dangHoatDong ?? item.trangThai ?? true;

          return {
            id: item.id,
            tenPhongBan,
            soDienThoai: item.soDienThoai,
            email: item.email,
            moTa: item.moTa,
            loaiPhongBan: item.loaiPhongBan,
            thanhViens: Array.isArray(item.thanhViens) ? item.thanhViens : [],
            dangHoatDong,
          } as Department & { dangHoatDong: boolean };
        })
        .filter((item) => item.tenPhongBan.length > 0 && item.dangHoatDong);
    }
  } catch (error) {
    console.error("Lỗi khi tải phòng ban, tổ chức:", error);
  }

  return [];
}

export function generateFallbackAvatar(name: string): string {
  const seed = name || "User";
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e2e8f0&textColor=475569`;
}
