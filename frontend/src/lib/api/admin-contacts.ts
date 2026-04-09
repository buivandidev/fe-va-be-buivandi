import { apiClient, unwrapApi, getApiErrorMessage } from './client'
import { KetQuaPhanTrang } from './admin'

// ========== CONTACTS API ==========
export interface TinNhanLienHe {
  id: string
  hoTen: string
  email: string
  soDienThoai?: string
  noiDung: string
  daDoc: boolean
  ngayTao: string
  ngayDoc?: string
}

export const contactsApi = {
  async layDanhSach(params: {
    daDoc?: boolean
    trang?: number
    kichThuocTrang?: number
  } = {}): Promise<KetQuaPhanTrang<TinNhanLienHe>> {
    const res = await apiClient.get('/api/contact', { params })
    return unwrapApi<KetQuaPhanTrang<TinNhanLienHe>>(res)
  },

  async danhDauDaDoc(id: string): Promise<void> {
    await apiClient.patch(`/api/contact/${id}/read`)
  },

  async xoa(id: string): Promise<void> {
    await apiClient.delete(`/api/contact/${id}`)
  }
}

export { getApiErrorMessage }
