'use client'

import { useEffect, useState, useCallback } from 'react'
import { servicesApi, categoriesApi, DichVu, DanhMuc, TaoDichVuDto, getApiErrorMessage } from '@/lib/api/admin'

export default function AdminServicesPage() {
  const [services, setServices] = useState<DichVu[]>([])
  const [categories, setCategories] = useState<DanhMuc[]>([])
  const [pagination, setPagination] = useState({ tongSo: 0, trang: 1, kichThuocTrang: 10 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined)
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<DichVu | null>(null)
  const [formData, setFormData] = useState<TaoDichVuDto>({
    maDichVu: '',
    ten: '',
    moTa: '',
    huongDan: '',
    lePhi: 0,
    thoiGianXuLy: 0,
    danhMucId: '',
    dangHoatDong: true,
    thuTuSapXep: 0
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadServices = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const data = await servicesApi.layDanhSach({
        timKiem: search || undefined,
        dangHoatDong: filterActive,
        trang: page,
        kichThuocTrang: pagination.kichThuocTrang
      })
      setServices(data.danhSach)
      setPagination({ tongSo: data.tongSo, trang: data.trang, kichThuocTrang: data.kichThuocTrang })
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [search, filterActive, pagination.kichThuocTrang])

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.layDanhSach()
      setCategories(data)
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  useEffect(() => {
    loadServices()
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadServices(1)
  }

  const openCreateModal = () => {
    setEditingService(null)
    setFormData({
      maDichVu: '',
      ten: '',
      moTa: '',
      huongDan: '',
      lePhi: 0,
      thoiGianXuLy: 0,
      danhMucId: '',
      dangHoatDong: true,
      thuTuSapXep: 0
    })
    setFormError(null)
    setShowModal(true)
  }

  const openEditModal = (service: DichVu) => {
    setEditingService(service)
    setFormData({
      maDichVu: service.maDichVu,
      ten: service.ten,
      moTa: service.moTa || '',
      huongDan: service.huongDan || '',
      lePhi: service.lePhi || 0,
      thoiGianXuLy: service.thoiGianXuLy || 0,
      danhMucId: service.danhMucId || '',
      dangHoatDong: service.dangHoatDong,
      thuTuSapXep: service.thuTuSapXep
    })
    setFormError(null)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      if (editingService) {
        await servicesApi.capNhat(editingService.id, formData)
      } else {
        await servicesApi.taoMoi(formData)
      }
      setShowModal(false)
      loadServices(pagination.trang)
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (service: DichVu) => {
    if (!confirm(`Bạn có chắc muốn xóa dịch vụ "${service.ten}"?`)) return
    
    try {
      await servicesApi.xoa(service.id)
      loadServices(pagination.trang)
    } catch (err) {
      alert(getApiErrorMessage(err))
    }
  }

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'Miễn phí'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const totalPages = Math.ceil(pagination.tongSo / pagination.kichThuocTrang)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Quản lý dịch vụ</h1>
          <p className="text-ink-muted text-sm">Quản lý dịch vụ công trên hệ thống</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 border border-blue-700 transition flex items-center gap-2 font-semibold shadow-sm"
        >
          <span>+</span> Thêm dịch vụ
        </button>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
        <input
          aria-label="Tìm kiếm dịch vụ"
          type="text"
          placeholder="Tìm kiếm dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
        />
        <select
          aria-label="Lọc trạng thái dịch vụ"
          value={filterActive === undefined ? '' : filterActive ? 'true' : 'false'}
          onChange={(e) => {
            const val = e.target.value
            setFilterActive(val === '' ? undefined : val === 'true')
            loadServices(1)
          }}
          className="px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang hoạt động</option>
          <option value="false">Ngừng hoạt động</option>
        </select>
        <button
          type="submit"
          className="px-6 py-2 bg-ink text-white rounded-lg hover:bg-ink/90 transition"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
          <button onClick={() => loadServices()} className="ml-4 underline">Thử lại</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-line rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-line">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Mã</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Tên dịch vụ</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Lệ phí</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Thời gian xử lý</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Trạng thái</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-ink-muted">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                  Đang tải...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="border-b border-line last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                      {service.maDichVu}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-ink">{service.ten}</p>
                      {service.moTa && (
                        <p className="text-sm text-ink-muted truncate max-w-xs">{service.moTa}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {formatCurrency(service.lePhi)}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {service.thoiGianXuLy ? `${service.thoiGianXuLy} ngày` : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      service.dangHoatDong ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {service.dangHoatDong ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEditModal(service)}
                      className="px-3 py-1 text-sm text-brand hover:bg-brand/10 rounded transition"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition ml-2"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-muted">
            Hiển thị {services.length} / {pagination.tongSo} dịch vụ
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => loadServices(pagination.trang - 1)}
              disabled={pagination.trang <= 1}
              className="px-3 py-1 border border-line rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-3 py-1">
              Trang {pagination.trang} / {totalPages}
            </span>
            <button
              onClick={() => loadServices(pagination.trang + 1)}
              disabled={pagination.trang >= totalPages}
              className="px-3 py-1 border border-line rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-line sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-ink">
                {editingService ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-red-800 text-sm">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Mã dịch vụ *</label>
                  <input
                    aria-label="Mã dịch vụ"
                    type="text"
                    required
                    value={formData.maDichVu}
                    onChange={(e) => setFormData({ ...formData, maDichVu: e.target.value })}
                    className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                    placeholder="VD: DV001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Tên dịch vụ *</label>
                  <input
                    aria-label="Tên dịch vụ"
                    type="text"
                    required
                    value={formData.ten}
                    onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                    className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Mô tả</label>
                <textarea
                  aria-label="Mô tả dịch vụ"
                  rows={3}
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Hướng dẫn thực hiện</label>
                <textarea
                  aria-label="Hướng dẫn thực hiện dịch vụ"
                  rows={4}
                  value={formData.huongDan}
                  onChange={(e) => setFormData({ ...formData, huongDan: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Lệ phí (VNĐ)</label>
                  <input
                    aria-label="Lệ phí dịch vụ"
                    type="number"
                    min={0}
                    value={formData.lePhi}
                    onChange={(e) => setFormData({ ...formData, lePhi: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Thời gian xử lý (ngày)</label>
                  <input
                    aria-label="Thời gian xử lý dịch vụ"
                    type="number"
                    min={0}
                    value={formData.thoiGianXuLy}
                    onChange={(e) => setFormData({ ...formData, thoiGianXuLy: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Thứ tự sắp xếp</label>
                  <input
                    aria-label="Thứ tự sắp xếp dịch vụ"
                    type="number"
                    min={0}
                    value={formData.thuTuSapXep}
                    onChange={(e) => setFormData({ ...formData, thuTuSapXep: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Danh mục</label>
                <select
                  aria-label="Danh mục dịch vụ"
                  value={formData.danhMucId}
                  onChange={(e) => setFormData({ ...formData, danhMucId: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                >
                  <option value="">Không có danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.ten}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dangHoatDong"
                  checked={formData.dangHoatDong}
                  onChange={(e) => setFormData({ ...formData, dangHoatDong: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="dangHoatDong" className="text-sm text-ink">Đang hoạt động</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-line rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 border border-blue-700 transition disabled:opacity-50 font-semibold shadow-sm"
                >
                  {submitting ? 'Đang xử lý...' : (editingService ? 'Lưu cập nhật' : 'Lưu dịch vụ mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
