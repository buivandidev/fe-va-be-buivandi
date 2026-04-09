import { apiClient, unwrapApi, getApiErrorMessage } from './client'
import { KetQuaPhanTrang } from './admin'

// ========== SETTINGS API ==========
export interface CaiDatTrangWeb {
  id: string
  khoa: string
  giaTri: string
  loai: string
  ngayCapNhat: string
}

export interface CaiDatTrangWebDto {
  khoa: string
  giaTri?: string
  loai: string
}

export interface CapNhatCaiDatTrangWebDto {
  giaTri?: string
}

export const settingsApi = {
  async layDanhSach(): Promise<CaiDatTrangWeb[]> {
    const res = await apiClient.get('/api/admin/settings')
    return unwrapApi<CaiDatTrangWeb[]>(res)
  },

  async capNhatTheoKhoa(khoa: string, data: CapNhatCaiDatTrangWebDto): Promise<void> {
    await apiClient.put(`/api/admin/settings/${khoa}`, data)
  },

  async taoMoi(data: CaiDatTrangWebDto): Promise<{ id: string; khoa: string }> {
    const res = await apiClient.post('/api/admin/settings', data)
    return unwrapApi<{ id: string; khoa: string }>(res)
  },

  async xoa(khoa: string): Promise<void> {
    await apiClient.delete(`/api/admin/settings/${khoa}`)
  }
}

// ========== AUDIT LOGS API ==========
export interface NhatKyKiemTra {
  id: string
  tenThucThe: string
  idThucThe: string
  hanhDong: string
  duLieuCu?: string
  duLieuMoi?: string
  nguoiDungId?: string
  tenNguoiDung?: string
  thoiGian: string
}

export const auditLogsApi = {
  async layDanhSach(params: {
    tenThucThe?: string
    nguoiDungId?: string
    trang?: number
    kichThuocTrang?: number
  } = {}): Promise<KetQuaPhanTrang<NhatKyKiemTra>> {
    const res = await apiClient.get('/api/admin/audit-logs', { params })
    return unwrapApi<KetQuaPhanTrang<NhatKyKiemTra>>(res)
  }
}

export { getApiErrorMessage }
