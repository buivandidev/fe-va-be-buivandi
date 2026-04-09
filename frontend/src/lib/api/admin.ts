import { apiClient, unwrapApi, getApiErrorMessage } from './client'

// ========== DASHBOARD API ==========
export interface ThongKeBangDieuKhien {
  tongBaiViet: number
  baiVietDaXuatBan: number
  baiVietChoDuyet: number
  tongNguoiDung: number
  tongDichVu: number
  tongDonUng: number
  donUngChoXuLy: number
  donUngQuaHan: number
  donUngSapDenHan: number
  lienHeChuaDoc: number
  tongBinhLuan: number
  binhLuanChoDuyet: number
}

export interface TapDuLieuBieuDo {
  nhanDuLieu: string
  duLieu: number[]
  mauNen: string
  mauVien: string
}

export interface DuLieuBieuDo {
  nhanDuLieu: string[]
  tapDuLieu: TapDuLieuBieuDo[]
}

export const dashboardApi = {
  async layThongKe(): Promise<ThongKeBangDieuKhien> {
    const res = await apiClient.get('/api/admin/dashboard/stats')
    return unwrapApi<ThongKeBangDieuKhien>(res)
  },

  async layBieuDoBaiViet(soThang: number = 6): Promise<DuLieuBieuDo> {
    const res = await apiClient.get(`/api/admin/dashboard/articles-chart`, {
      params: { soThang }
    })
    return unwrapApi<DuLieuBieuDo>(res)
  },

  async layBieuDoTrangThaiHoSo(): Promise<DuLieuBieuDo> {
    const res = await apiClient.get('/api/admin/dashboard/applications-status-chart')
    return unwrapApi<DuLieuBieuDo>(res)
  }
}

// ========== USERS API ==========
export interface NguoiDung {
  id: string
  hoTen: string
  email: string
  soDienThoai?: string
  anhDaiDien?: string
  dangHoatDong: boolean
  danhSachVaiTro: string[]
  ngayTao: string
  ngayCapNhat?: string
}

export interface KetQuaPhanTrang<T> {
  danhSach: T[]
  tongSo: number
  trang: number
  kichThuocTrang: number
}

export interface TaoNguoiDungDto {
  hoTen: string
  email: string
  matKhau: string
  soDienThoai?: string
  vaiTro: string
  dangHoatDong: boolean
}

export interface CapNhatNguoiDungDto {
  hoTen: string
  soDienThoai?: string
  anhDaiDien?: string
  vaiTro: string
  dangHoatDong: boolean
}

export const usersApi = {
  async layDanhSach(params: {
    tuKhoa?: string
    trang?: number
    kichThuocTrang?: number
  } = {}): Promise<KetQuaPhanTrang<NguoiDung>> {
    const res = await apiClient.get('/api/admin/users', { params })
    return unwrapApi<KetQuaPhanTrang<NguoiDung>>(res)
  },

  async layTheoId(id: string): Promise<NguoiDung> {
    const res = await apiClient.get(`/api/admin/users/${id}`)
    return unwrapApi<NguoiDung>(res)
  },

  async taoMoi(data: TaoNguoiDungDto): Promise<{ id: string }> {
    const res = await apiClient.post('/api/admin/users', data)
    return unwrapApi<{ id: string }>(res)
  },

  async capNhat(id: string, data: CapNhatNguoiDungDto): Promise<void> {
    await apiClient.put(`/api/admin/users/${id}`, data)
  },

  async voHieuHoa(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/users/${id}`)
  }
}

// ========== ARTICLES API ==========
export type TrangThaiBaiViet = 'BanNhap' | 'ChoDuyet' | 'DaXuatBan' | 'LuuTru'

const TRANG_THAI_BAI_VIET_TO_NUMBER: Record<TrangThaiBaiViet, number> = {
  BanNhap: 0,
  ChoDuyet: 1,
  DaXuatBan: 2,
  LuuTru: 3,
}

const NUMBER_TO_TRANG_THAI_BAI_VIET: Record<number, TrangThaiBaiViet> = {
  0: 'BanNhap',
  1: 'ChoDuyet',
  2: 'DaXuatBan',
  3: 'LuuTru',
}

export interface BaiViet {
  id: string
  tieuDe: string
  tomTat?: string
  noiDung: string
  anhDaiDien?: string
  duongDan: string
  danhMucId: string
  danhMuc?: {
    id: string
    ten: string
  }
  tacGia?: {
    id: string
    hoTen: string
  }
  trangThai: TrangThaiBaiViet
  soLuotXem: number
  soBinhLuan: number
  ngayTao: string
  ngayCapNhat?: string
  ngayXuatBan?: string
}

export interface TaoBaiVietDto {
  tieuDe: string
  tomTat?: string
  noiDung: string
  anhDaiDien?: string
  danhMucId: string
  trangThai: TrangThaiBaiViet
  ngayXuatBan?: string
}

export interface CapNhatBaiVietDto {
  tieuDe: string
  tomTat?: string
  noiDung: string
  anhDaiDien?: string
  danhMucId: string
  trangThai: TrangThaiBaiViet
  ngayXuatBan?: string
}

function normalizeTrangThaiBaiViet(value: unknown): TrangThaiBaiViet {
  if (typeof value === 'string' && value in TRANG_THAI_BAI_VIET_TO_NUMBER) {
    return value as TrangThaiBaiViet
  }
  if (typeof value === 'number' && value in NUMBER_TO_TRANG_THAI_BAI_VIET) {
    return NUMBER_TO_TRANG_THAI_BAI_VIET[value]
  }
  return 'BanNhap'
}

function normalizeBaiViet(item: BaiViet): BaiViet {
  return {
    ...item,
    trangThai: normalizeTrangThaiBaiViet(item.trangThai),
  }
}

export const articlesApi = {
  async layDanhSach(params: {
    tuKhoa?: string
    timKiem?: string
    danhMucId?: string
    trangThai?: TrangThaiBaiViet
    trang?: number
    kichThuocTrang?: number
  } = {}): Promise<KetQuaPhanTrang<BaiViet>> {
    const rawParams = { ...params };
    if (rawParams.trangThai) {
      // @ts-expect-error: map enum to number
      rawParams.trangThai = TRANG_THAI_BAI_VIET_TO_NUMBER[rawParams.trangThai];
    }
    const res = await apiClient.get('/api/admin/articles/admin', { params: rawParams })
    const payload = unwrapApi<KetQuaPhanTrang<BaiViet>>(res)
    return {
      ...payload,
      danhSach: payload.danhSach.map(normalizeBaiViet),
    }
  },

  async layTheoId(id: string): Promise<BaiViet> {
    const res = await apiClient.get(`/api/admin/articles/${id}/detail`)
    return normalizeBaiViet(unwrapApi<BaiViet>(res))
  },

  async taoMoi(data: TaoBaiVietDto): Promise<{ id: string }> {
    const rawData = {
      ...data,
      trangThai: TRANG_THAI_BAI_VIET_TO_NUMBER[data.trangThai]
    }
    const res = await apiClient.post('/api/admin/articles', rawData)
    return unwrapApi<{ id: string }>(res)
  },

  async capNhat(id: string, data: CapNhatBaiVietDto): Promise<void> {
    const rawData = {
      ...data,
      trangThai: TRANG_THAI_BAI_VIET_TO_NUMBER[data.trangThai]
    }
    await apiClient.put(`/api/admin/articles/${id}`, rawData)
  },

  async xoa(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/articles/${id}`)
  }
}

// ========== SERVICES API ==========
export interface DichVu {
  id: string
  maDichVu: string
  ten: string
  moTa?: string
  huongDan?: string
  lePhi?: number
  thoiGianXuLy?: number
  danhMucId?: string
  danhMuc?: {
    id: string
    ten: string
  }
  dangHoatDong: boolean
  thuTuSapXep: number
  ngayTao: string
  ngayCapNhat?: string
}

export interface TaoDichVuDto {
  maDichVu: string
  ten: string
  moTa?: string
  huongDan?: string
  lePhi?: number
  thoiGianXuLy?: number
  danhMucId?: string
  dangHoatDong: boolean
  thuTuSapXep?: number
}

export interface CapNhatDichVuDto {
  maDichVu: string
  ten: string
  moTa?: string
  huongDan?: string
  lePhi?: number
  thoiGianXuLy?: number
  danhMucId?: string
  dangHoatDong: boolean
  thuTuSapXep?: number
}

export const servicesApi = {
  async layDanhSach(params: {
    timKiem?: string
    danhMucId?: string
    dangHoatDong?: boolean
    trang?: number
    kichThuocTrang?: number
  } = {}): Promise<KetQuaPhanTrang<DichVu>> {
    const res = await apiClient.get('/api/admin/services/admin', { params })
    return unwrapApi<KetQuaPhanTrang<DichVu>>(res)
  },

  async taoMoi(data: TaoDichVuDto): Promise<{ id: string }> {
    const res = await apiClient.post('/api/admin/services', data)
    return unwrapApi<{ id: string }>(res)
  },

  async capNhat(id: string, data: CapNhatDichVuDto): Promise<void> {
    await apiClient.put(`/api/admin/services/${id}`, data)
  },

  async xoa(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/services/${id}`)
  }
}

// ========== APPLICATIONS API ==========
export type TrangThaiDonUng = 'ChoXuLy' | 'DangXuLy' | 'HoanThanh' | 'TuChoi'

const TRANG_THAI_DON_UNG_TO_NUMBER: Record<TrangThaiDonUng, number> = {
  ChoXuLy: 0,
  DangXuLy: 1,
  HoanThanh: 2,
  TuChoi: 3,
}

const NUMBER_TO_TRANG_THAI_DON_UNG: Record<number, TrangThaiDonUng> = {
  0: 'ChoXuLy',
  1: 'DangXuLy',
  2: 'HoanThanh',
  3: 'TuChoi',
}

export interface TepDonUng {
  id: string
  tenTep: string
  duongDanTep: string
  urlTep: string
  kichThuocTep: number
  loaiNoiDung?: string
}

export interface DonUng {
  id: string
  maTheoDoi: string
  tenNguoiNop: string
  emailNguoiNop: string
  soDienThoaiNguoiNop?: string
  diaChiNguoiNop?: string
  dichVuId: string
  dichVu?: {
    id: string
    ten: string
    maDichVu: string
  }
  phongBanHienTaiId?: string
  phongBanHienTai?: {
    id: string
    ten: string
  }
  nguoiXuLyId?: string
  trangThai: TrangThaiDonUng
  ghiChuNguoiNop?: string
  ghiChuNguoiXuLy?: string
  hanXuLy?: string
  ngayNop: string
  ngayXuLy?: string
  ngayCapNhat?: string
  danhSachTep: TepDonUng[]
}

export interface LichSuTrangThai {
  id: string
  donUngId: string
  trangThaiCu: TrangThaiDonUng
  trangThaiMoi: TrangThaiDonUng
  ghiChu?: string
  nguoiThayDoi?: {
    id: string
    hoTen: string
  }
  ngayTao: string
}

function normalizeTrangThaiDonUng(value: unknown): TrangThaiDonUng {
  if (typeof value === 'string' && value in TRANG_THAI_DON_UNG_TO_NUMBER) {
    return value as TrangThaiDonUng
  }
  if (typeof value === 'number' && value in NUMBER_TO_TRANG_THAI_DON_UNG) {
    return NUMBER_TO_TRANG_THAI_DON_UNG[value]
  }
  return 'ChoXuLy'
}

function normalizeDonUng(item: DonUng): DonUng {
  return {
    ...item,
    trangThai: normalizeTrangThaiDonUng(item.trangThai),
  }
}

function normalizeLichSuTrangThai(item: LichSuTrangThai): LichSuTrangThai {
  return {
    ...item,
    trangThaiCu: normalizeTrangThaiDonUng(item.trangThaiCu),
    trangThaiMoi: normalizeTrangThaiDonUng(item.trangThaiMoi),
  }
}

export interface CapNhatTrangThaiDto {
  trangThai: TrangThaiDonUng
  ghiChuNguoiXuLy?: string
}

export interface PhanCongXuLyDto {
  phongBanId: string
  nguoiXuLyId?: string
  hanXuLy?: string
  ghiChu?: string
}

export interface PhongBan {
  id: string
  ten: string
  moTa?: string
  emailLienHe?: string
  soDienThoai?: string
  diaChi?: string
  dangHoatDong: boolean
}

export interface KetQuaTaiNhieuTep {
  tepDaTaiLen: Array<{
    id: string
    tenTep: string
    urlTep: string
  }>
}

export const applicationsApi = {
  async layDanhSach(params: {
    trangThai?: TrangThaiDonUng
    tuKhoa?: string
    trang?: number
    kichThuocTrang?: number
  } = {}): Promise<KetQuaPhanTrang<DonUng>> {
    const res = await apiClient.get('/api/admin/applications', { params })
    const payload = unwrapApi<KetQuaPhanTrang<DonUng>>(res)
    return {
      ...payload,
      danhSach: payload.danhSach.map(normalizeDonUng),
    }
  },

  async layTheoId(id: string): Promise<DonUng> {
    const res = await apiClient.get(`/api/admin/applications/${id}`)
    return normalizeDonUng(unwrapApi<DonUng>(res))
  },

  async layLichSu(id: string): Promise<LichSuTrangThai[]> {
    const res = await apiClient.get(`/api/admin/applications/${id}/history`)
    return unwrapApi<LichSuTrangThai[]>(res).map(normalizeLichSuTrangThai)
  },

  async capNhatTrangThai(id: string, data: CapNhatTrangThaiDto): Promise<void> {
    await apiClient.patch(`/api/admin/applications/${id}/status`, {
      ...data,
      trangThai: TRANG_THAI_DON_UNG_TO_NUMBER[data.trangThai],
    })
  },

  async phanCongXuLy(id: string, data: PhanCongXuLyDto): Promise<void> {
    await apiClient.post(`/api/admin/applications/${id}/assign`, data)
  },

  async layDanhSachPhongBan(dangHoatDong: boolean = true): Promise<PhongBan[]> {
    const res = await apiClient.get('/api/public/departments', { params: { dangHoatDong } })
    return unwrapApi<PhongBan[]>(res)
  },

  async taiTepLen(id: string, file: File): Promise<{ id: string; tenTep: string; urlTep: string }> {
    const formData = new FormData()
    formData.append('tep', file)
    const res = await apiClient.post(`/api/admin/applications/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return unwrapApi<{ id: string; tenTep: string; urlTep: string }>(res)
  },

  async taiNhieuTepLen(id: string, files: File[]): Promise<KetQuaTaiNhieuTep> {
    const formData = new FormData()
    files.forEach((file) => formData.append('cacTep', file))
    const res = await apiClient.post(`/api/admin/applications/${id}/upload-files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return unwrapApi<KetQuaTaiNhieuTep>(res)
  },

  async taoLienKetThanhToan(id: string): Promise<{ urlThanhToan: string; maThamChieuThanhToan: string }> {
    const res = await apiClient.post(`/api/admin/applications/${id}/payment-link`)
    return unwrapApi<{ urlThanhToan: string; maThamChieuThanhToan: string }>(res)
  },

  layUrlXuatPhieu(id: string): string {
    return `/api/admin/applications/${id}/receipt`
  }
}

// ========== COMMENTS API ==========
export interface BinhLuan {
  id: string
  noiDung: string
  tenNguoi?: string
  emailNguoi?: string
  baiVietId: string
  baiViet?: {
    id: string
    tieuDe: string
  }
  nguoiDungId?: string
  nguoiDung?: {
    id: string
    hoTen: string
  }
  daDuyet: boolean
  ngayTao: string
  ngayCapNhat?: string
}

export const commentsApi = {
  async layDanhSach(params: {
    baiVietId?: string
    daDuyet?: boolean
    trang?: number
    kichThuocTrang?: number
  } = {}): Promise<KetQuaPhanTrang<BinhLuan>> {
    const res = await apiClient.get('/api/admin/comments', { params })
    return unwrapApi<KetQuaPhanTrang<BinhLuan>>(res)
  },

  async duyet(id: string): Promise<void> {
    await apiClient.patch(`/api/admin/comments/${id}/approve`)
  },

  async xoa(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/comments/${id}`)
  }
}

// ========== CATEGORIES API ==========
export interface DanhMuc {
  id: string
  ten: string
  moTa?: string
  duongDan: string
  loai: string
  thuTuSapXep: number
  dangHoatDong: boolean
  ngayTao: string
  ngayCapNhat?: string
}

export const categoriesApi = {
  async layDanhSach(): Promise<DanhMuc[]> {
    const res = await apiClient.get('/api/categories')
    return unwrapApi<DanhMuc[]>(res)
  },

  async taoMoi(data: TaoDanhMucDto): Promise<DanhMuc> {
    const res = await apiClient.post('/api/admin/categories', data)
    return unwrapApi<DanhMuc>(res)
  },

  async capNhat(id: string, data: CapNhatDanhMucDto): Promise<DanhMuc> {
    const res = await apiClient.put(`/api/admin/categories/${id}`, data)
    return unwrapApi<DanhMuc>(res)
  },

  async xoa(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/categories/${id}`)
  }
}

export interface TaoDanhMucDto {
  ten: string
  moTa?: string
  loai: string
  chaId?: string
  thuTuSapXep?: number
  dangHoatDong?: boolean
}

export interface CapNhatDanhMucDto {
  ten: string
  moTa?: string
  loai: string
  chaId?: string
  thuTuSapXep?: number
  dangHoatDong?: boolean
}

// ========== MEDIA API ==========
export interface PhuongTien {
  id: string
  tenTep: string
  duongDanTep: string
  urlTep: string
  kichThuocTep: number
  loaiNoiDung?: string
  loai: 'HinhAnh' | 'Video' | 'TaiLieu'
  vanBanThayThe?: string
  albumId?: string
  nguoiTaiLenId: string
  ngayTao: string
}

export interface AlbumPhuongTien {
  id: string;
  ten: string;
  moTa?: string;
  chuDe?: string;
  anhBia?: string;
  dangHoatDong: boolean;
  ngayTao: string;
  ngayCapNhat?: string;
}

export interface TaoAlbumPhuongTienDto {
  ten: string;
  moTa?: string;
  chuDe?: string;
  anhBia?: string;
  dangHoatDong?: boolean;
}

export interface CapNhatAlbumPhuongTienDto {
  ten: string;
  moTa?: string;
  chuDe?: string;
  anhBia?: string;
  dangHoatDong?: boolean;
}

export const mediaApi = {
  async taiLenAnh(file: File, albumId?: string, vanBanThayThe?: string): Promise<PhuongTien> {
    const formData = new FormData();
    formData.append('tep', file);
    if (albumId) formData.append('albumId', albumId);
    if (vanBanThayThe) formData.append('vanBanThayThe', vanBanThayThe);
    const res = await apiClient.post('/api/admin/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return unwrapApi<PhuongTien>(res);
  },

  async layDanhSachAlbum(): Promise<AlbumPhuongTien[]> {
    const res = await apiClient.get('/api/admin/media/albums');
    return unwrapApi<AlbumPhuongTien[]>(res);
  },

  async taoAlbum(data: TaoAlbumPhuongTienDto): Promise<{ id: string }> {
    const res = await apiClient.post('/api/admin/media/albums', data);
    return unwrapApi<{ id: string }>(res);
  },

  async capNhatAlbum(id: string, data: CapNhatAlbumPhuongTienDto): Promise<void> {
    await apiClient.put(`/api/admin/media/albums/${id}`, data);
  },

  async xoaAlbum(id: string): Promise<void> {
    await apiClient.delete(`/api/admin/media/albums/${id}`);
  }
};

export { getApiErrorMessage }
