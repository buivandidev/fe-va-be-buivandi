'use client'

import { useEffect, useState, useCallback, useTransition } from 'react'
import { applicationsApi, DonUng, TrangThaiDonUng, LichSuTrangThai, CapNhatTrangThaiDto, PhanCongXuLyDto, PhongBan, NguoiDung, usersApi, getApiErrorMessage } from '@/lib/api/admin'

const STATUS_LABELS: Record<TrangThaiDonUng, { label: string; color: string; bgColor: string }> = {
  'ChoXuLy': { label: 'Chờ xử lý', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  'DangXuLy': { label: 'Đang xử lý', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  'HoanThanh': { label: 'Hoàn thành', color: 'text-green-700', bgColor: 'bg-green-100' },
  'TuChoi': { label: 'Từ chối', color: 'text-red-700', bgColor: 'bg-red-100' }
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<DonUng[]>([])
  const [pagination, setPagination] = useState({ tongSo: 0, trang: 1, kichThuocTrang: 10 })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<TrangThaiDonUng | ''>('')
  
  // Detail modal states
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<DonUng | null>(null)
  const [history, setHistory] = useState<LichSuTrangThai[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  
  // Status update modal states
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusData, setStatusData] = useState<CapNhatTrangThaiDto>({
    trangThai: 'ChoXuLy',
    ghiChuNguoiXuLy: ''
  })
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [departments, setDepartments] = useState<PhongBan[]>([])
  const [assignableUsers, setAssignableUsers] = useState<NguoiDung[]>([])
  const [loadingAssignableUsers, setLoadingAssignableUsers] = useState(false)
  const [assignableUsersError, setAssignableUsersError] = useState<string | null>(null)
  const [assignData, setAssignData] = useState<PhanCongXuLyDto>({
    phongBanId: '',
    nguoiXuLyId: '',
    hanXuLy: '',
    ghiChu: ''
  })
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadDepartments = useCallback(async () => {
    try {
      const data = await applicationsApi.layDanhSachPhongBan(true)
      setDepartments(data)
    } catch {
      setDepartments([])
    }
  }, [])

  const loadAssignableUsers = useCallback(async () => {
    try {
      setLoadingAssignableUsers(true)
      setAssignableUsersError(null)
      const data = await usersApi.layDanhSach({
        trang: 1,
        kichThuocTrang: 100,
      })
      setAssignableUsers(data.danhSach.filter((user) => user.dangHoatDong))
    } catch (err) {
      // Users API co the bi chan theo role, nen van cho phep phan cong khong gan nguoi cu the.
      setAssignableUsers([])
      setAssignableUsersError(getApiErrorMessage(err))
    } finally {
      setLoadingAssignableUsers(false)
    }
  }, [])

  const loadApplications = useCallback((page: number = 1) => {
    startTransition(async () => {
      try {
        setError(null)
        const data = await applicationsApi.layDanhSach({
          tuKhoa: search || undefined,
          trangThai: filterStatus || undefined,
          trang: page,
          kichThuocTrang: pagination.kichThuocTrang
        })
        setApplications(data.danhSach)
        setPagination({ tongSo: data.tongSo, trang: data.trang, kichThuocTrang: data.kichThuocTrang })
      } catch (err) {
        setError(getApiErrorMessage(err))
      }
    })
  }, [search, filterStatus, pagination.kichThuocTrang])

  useEffect(() => {
    loadDepartments()
    loadAssignableUsers()
  }, [loadDepartments, loadAssignableUsers])

  useEffect(() => {
    loadApplications(1)
  }, [search, filterStatus, loadApplications])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadApplications(1)
  }

  const openDetailModal = async (app: DonUng) => {
    try {
      const fullApp = await applicationsApi.layTheoId(app.id)
      setSelectedApplication(fullApp)
      setShowDetailModal(true)
      
      // Load history
      setLoadingHistory(true)
      try {
        const historyData = await applicationsApi.layLichSu(app.id)
        setHistory(historyData)
      } catch (err) {
        console.error('Failed to load history:', err)
        setHistory([])
      } finally {
        setLoadingHistory(false)
      }
    } catch (err) {
      alert(getApiErrorMessage(err))
    }
  }

  const openStatusModal = (app: DonUng) => {
    setSelectedApplication(app)
    setStatusData({
      trangThai: app.trangThai,
      ghiChuNguoiXuLy: ''
    })
    setShowStatusModal(true)
  }

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApplication) return
    
    setSubmitting(true)
    try {
      await applicationsApi.capNhatTrangThai(selectedApplication.id, statusData)
      setShowStatusModal(false)
      setShowDetailModal(false)
      if (filterStatus && filterStatus !== statusData.trangThai) {
        setFilterStatus('')
        loadApplications(1)
        alert('Đã lưu trạng thái thành công. Bộ lọc đã được chuyển về "Tất cả trạng thái" để bạn thấy hồ sơ vừa cập nhật.')
        return
      }
      loadApplications(pagination.trang)
    } catch (err) {
      alert(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const openAssignModal = (app: DonUng) => {
    setSelectedApplication(app)
    setAssignData({
      phongBanId: app.phongBanHienTaiId || departments[0]?.id || '',
      nguoiXuLyId: app.nguoiXuLyId || '',
      hanXuLy: app.hanXuLy ? new Date(app.hanXuLy).toISOString().slice(0, 16) : '',
      ghiChu: ''
    })
    setShowAssignModal(true)
  }

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApplication || !assignData.phongBanId) return
    setSubmitting(true)
    try {
      await applicationsApi.phanCongXuLy(selectedApplication.id, {
        phongBanId: assignData.phongBanId,
        nguoiXuLyId: assignData.nguoiXuLyId || undefined,
        hanXuLy: assignData.hanXuLy ? new Date(assignData.hanXuLy).toISOString() : undefined,
        ghiChu: assignData.ghiChu || undefined
      })
      setShowAssignModal(false)
      loadApplications(pagination.trang)
    } catch (err) {
      alert(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const openUploadModal = (app: DonUng) => {
    setSelectedApplication(app)
    setUploadFiles([])
    setShowUploadModal(true)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApplication || uploadFiles.length === 0) return
    setSubmitting(true)
    try {
      if (uploadFiles.length === 1) {
        await applicationsApi.taiTepLen(selectedApplication.id, uploadFiles[0])
      } else {
        await applicationsApi.taiNhieuTepLen(selectedApplication.id, uploadFiles)
      }
      setShowUploadModal(false)
      const fullApp = await applicationsApi.layTheoId(selectedApplication.id)
      setSelectedApplication(fullApp)
      loadApplications(pagination.trang)
    } catch (err) {
      alert(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const openPaymentModal = async (app: DonUng) => {
    setSelectedApplication(app)
    setShowPaymentModal(true)
    setPaymentLink(null)
    setSubmitting(true)
    try {
      const res = await applicationsApi.taoLienKetThanhToan(app.id)
      setPaymentLink(res.urlThanhToan)
    } catch (err) {
      alert(getApiErrorMessage(err))
      setShowPaymentModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalPages = Math.ceil(pagination.tongSo / pagination.kichThuocTrang)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Quản lý hồ sơ</h1>
          <p className="text-ink-muted text-sm">Quản lý các hồ sơ, đơn đăng ký dịch vụ công</p>
        </div>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
        <input
          aria-label="Tìm theo mã hồ sơ, tên hoặc email"
          type="text"
          placeholder="Tìm theo mã hồ sơ, tên, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
        />
        <select
          aria-label="Lọc theo trạng thái hồ sơ"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TrangThaiDonUng | '')}
          className="px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
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
          <button onClick={() => loadApplications()} className="ml-4 underline">Thử lại</button>
        </div>
      )}

      {/* Table */}
      <div className={`bg-white border border-line rounded-lg overflow-hidden transition-opacity ${isPending ? 'opacity-50' : ''}`}>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-line">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Mã hồ sơ</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Người nộp</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Dịch vụ</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Trạng thái</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Ngày nộp</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Hạn xử lý</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-ink-muted">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isPending && applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-muted">
                  Đang tải...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-muted">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              applications.map((app) => {
                const isOverdue = app.hanXuLy && new Date(app.hanXuLy) < new Date() && 
                  app.trangThai !== 'HoanThanh' && app.trangThai !== 'TuChoi'
                
                return (
                  <tr key={app.id} className={`border-b border-line last:border-0 hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-brand/10 text-brand rounded text-sm font-mono font-medium">
                        {app.maTheoDoi}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-ink">{app.tenNguoiNop}</p>
                        <p className="text-sm text-ink-muted">{app.emailNguoiNop}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {app.dichVu?.ten || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_LABELS[app.trangThai]?.bgColor} ${STATUS_LABELS[app.trangThai]?.color}`}>
                        {STATUS_LABELS[app.trangThai]?.label || app.trangThai}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted text-sm">
                      {formatDate(app.ngayNop)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {app.hanXuLy ? (
                        <span className={isOverdue ? 'text-red-600 font-medium' : 'text-ink-muted'}>
                          {formatDate(app.hanXuLy)}
                          {isOverdue && ' (Quá hạn)'}
                        </span>
                      ) : (
                        <span className="text-ink-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openDetailModal(app)}
                        className="px-3 py-1 text-sm text-brand hover:bg-brand/10 rounded transition"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => openStatusModal(app)}
                        className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded transition ml-2"
                      >
                        Cập nhật
                      </button>
                      <button
                        onClick={() => openAssignModal(app)}
                        className="px-3 py-1 text-sm text-blue-700 hover:bg-blue-50 rounded transition ml-2"
                      >
                        Phân công
                      </button>
                      <button
                        onClick={() => openUploadModal(app)}
                        className="px-3 py-1 text-sm text-purple-700 hover:bg-purple-50 rounded transition ml-2"
                      >
                        Tải tệp
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-muted">
            Hiển thị {applications.length} / {pagination.tongSo} hồ sơ
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => loadApplications(pagination.trang - 1)}
              disabled={pagination.trang <= 1 || isPending}
              className="px-3 py-1 border border-line rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-3 py-1">
              Trang {pagination.trang} / {totalPages}
            </span>
            <button
              onClick={() => loadApplications(pagination.trang + 1)}
              disabled={pagination.trang >= totalPages || isPending}
              className="px-3 py-1 border border-line rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-line sticky top-0 bg-white flex justify-between items-center">
              <h2 className="text-xl font-bold text-ink">
                Chi tiết hồ sơ: {selectedApplication.maTheoDoi}
              </h2>
              <button onClick={() => setShowDetailModal(false)} className="text-ink-muted hover:text-ink">
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status badge */}
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${STATUS_LABELS[selectedApplication.trangThai]?.bgColor} ${STATUS_LABELS[selectedApplication.trangThai]?.color}`}>
                  {STATUS_LABELS[selectedApplication.trangThai]?.label}
                </span>
                <button
                  onClick={() => openStatusModal(selectedApplication)}
                  className="px-4 py-1.5 bg-brand text-white rounded-lg text-sm hover:bg-brand/90 transition"
                >
                  Cập nhật trạng thái
                </button>
                <button
                  onClick={() => openAssignModal(selectedApplication)}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Phân công xử lý
                </button>
                <button
                  onClick={() => openUploadModal(selectedApplication)}
                  className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
                >
                  Tải tệp lên
                </button>
                <a
                  href={applicationsApi.layUrlXuatPhieu(selectedApplication.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition"
                >
                  Xuất phiếu PDF
                </a>
                <button
                  onClick={() => openPaymentModal(selectedApplication)}
                  className="px-4 py-1.5 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition"
                >
                  Tạo link thanh toán
                </button>
              </div>

              {/* Info sections */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Applicant info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-ink border-b pb-2">Thông tin người nộp</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-ink-muted">Họ tên:</span> <span className="font-medium">{selectedApplication.tenNguoiNop}</span></p>
                    <p><span className="text-ink-muted">Email:</span> {selectedApplication.emailNguoiNop}</p>
                    <p><span className="text-ink-muted">Điện thoại:</span> {selectedApplication.soDienThoaiNguoiNop || 'N/A'}</p>
                    <p><span className="text-ink-muted">Địa chỉ:</span> {selectedApplication.diaChiNguoiNop || 'N/A'}</p>
                  </div>
                </div>

                {/* Application info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-ink border-b pb-2">Thông tin hồ sơ</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-ink-muted">Dịch vụ:</span> <span className="font-medium">{selectedApplication.dichVu?.ten}</span></p>
                    <p><span className="text-ink-muted">Ngày nộp:</span> {formatDate(selectedApplication.ngayNop)}</p>
                    <p><span className="text-ink-muted">Hạn xử lý:</span> {selectedApplication.hanXuLy ? formatDate(selectedApplication.hanXuLy) : 'Chưa có'}</p>
                    {selectedApplication.ngayXuLy && (
                      <p><span className="text-ink-muted">Ngày xử lý:</span> {formatDate(selectedApplication.ngayXuLy)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedApplication.ghiChuNguoiNop && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-ink">Ghi chú người nộp</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedApplication.ghiChuNguoiNop}</p>
                </div>
              )}

              {selectedApplication.ghiChuNguoiXuLy && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-ink">Ghi chú xử lý</h3>
                  <p className="text-sm bg-blue-50 p-3 rounded-lg">{selectedApplication.ghiChuNguoiXuLy}</p>
                </div>
              )}

              {/* Attachments */}
              {selectedApplication.danhSachTep && selectedApplication.danhSachTep.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-ink">Tệp đính kèm ({selectedApplication.danhSachTep.length})</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedApplication.danhSachTep.map((file) => (
                      <a
                        key={file.id}
                        href={file.urlTep}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 border border-line rounded hover:bg-gray-50 transition text-sm"
                      >
                        <span className="text-lg">📎</span>
                        <span className="truncate flex-1">{file.tenTep}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* History */}
              <div className="space-y-2">
                <h3 className="font-semibold text-ink">Lịch sử xử lý</h3>
                {loadingHistory ? (
                  <p className="text-sm text-ink-muted">Đang tải...</p>
                ) : history.length === 0 ? (
                  <p className="text-sm text-ink-muted">Chưa có lịch sử</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <div key={item.id} className="flex gap-3 text-sm border-l-2 border-brand pl-3 py-1">
                        <div className="flex-1">
                          <p>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${STATUS_LABELS[item.trangThaiCu]?.bgColor} ${STATUS_LABELS[item.trangThaiCu]?.color}`}>
                              {STATUS_LABELS[item.trangThaiCu]?.label}
                            </span>
                            <span className="mx-2">→</span>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${STATUS_LABELS[item.trangThaiMoi]?.bgColor} ${STATUS_LABELS[item.trangThaiMoi]?.color}`}>
                              {STATUS_LABELS[item.trangThaiMoi]?.label}
                            </span>
                          </p>
                          {item.ghiChu && <p className="text-ink-muted mt-1">{item.ghiChu}</p>}
                          <p className="text-xs text-ink-muted mt-1">
                            {item.nguoiThayDoi?.hoTen || 'Hệ thống'} • {formatDate(item.ngayTao)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-line">
              <h2 className="text-xl font-bold text-ink">
                Cập nhật trạng thái
              </h2>
              <p className="text-sm text-ink-muted">Hồ sơ: {selectedApplication.maTheoDoi}</p>
            </div>
            
            <form onSubmit={handleStatusUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Trạng thái mới *</label>
                <select
                  aria-label="Trạng thái mới"
                  required
                  value={statusData.trangThai}
                  onChange={(e) => setStatusData({ ...statusData, trangThai: e.target.value as TrangThaiDonUng })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                >
                  {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Ghi chú xử lý</label>
                <textarea
                  aria-label="Ghi chú xử lý"
                  rows={4}
                  value={statusData.ghiChuNguoiXuLy}
                  onChange={(e) => setStatusData({ ...statusData, ghiChuNguoiXuLy: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                  placeholder="Nhập ghi chú cho người nộp hồ sơ..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border border-line rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Đang xử lý...' : 'Lưu cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-line">
              <h2 className="text-xl font-bold text-ink">Phân công xử lý</h2>
              <p className="text-sm text-ink-muted">Hồ sơ: {selectedApplication.maTheoDoi}</p>
            </div>
            <form onSubmit={handleAssign} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Phòng ban *</label>
                <select
                  aria-label="Chọn phòng ban xử lý"
                  required
                  value={assignData.phongBanId}
                  onChange={(e) => setAssignData({ ...assignData, phongBanId: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                >
                  <option value="">Chọn phòng ban</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.ten}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Người xử lý</label>
                <select
                  aria-label="Chọn người xử lý"
                  value={assignData.nguoiXuLyId || ''}
                  onChange={(e) => setAssignData({ ...assignData, nguoiXuLyId: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                  disabled={loadingAssignableUsers || assignableUsers.length === 0}
                >
                  <option value="">Không chỉ định</option>
                  {assignableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.hoTen} ({user.email})
                    </option>
                  ))}
                </select>
                {loadingAssignableUsers && (
                  <p className="text-xs text-ink-muted mt-1">Đang tải danh sách người xử lý...</p>
                )}
                {!loadingAssignableUsers && assignableUsersError && (
                  <p className="text-xs text-amber-700 mt-1">
                    Không tải được danh sách người xử lý: {assignableUsersError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Hạn xử lý</label>
                <input
                  aria-label="Hạn xử lý"
                  type="datetime-local"
                  value={assignData.hanXuLy || ''}
                  onChange={(e) => setAssignData({ ...assignData, hanXuLy: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Ghi chú</label>
                <textarea
                  aria-label="Ghi chú phân công xử lý"
                  rows={3}
                  value={assignData.ghiChu || ''}
                  onChange={(e) => setAssignData({ ...assignData, ghiChu: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 border border-line rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Đang xử lý...' : 'Lưu phân công'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-line">
              <h2 className="text-xl font-bold text-ink">Tải tệp hồ sơ</h2>
              <p className="text-sm text-ink-muted">Hồ sơ: {selectedApplication.maTheoDoi}</p>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Chọn tệp *</label>
                <input
                  aria-label="Chọn tệp hồ sơ"
                  type="file"
                  multiple
                  required
                  onChange={(e) => setUploadFiles(Array.from(e.target.files ?? []))}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                />
                <p className="text-xs text-ink-muted mt-2">Hỗ trợ: jpg, png, pdf, doc, docx, xls, xlsx. Có thể chọn nhiều tệp.</p>
                {uploadFiles.length > 0 && (
                  <ul className="text-xs text-ink-muted mt-2 space-y-1 max-h-24 overflow-auto">
                    {uploadFiles.map((file) => (
                      <li key={`${file.name}-${file.size}`}>• {file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-line rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadFiles.length === 0}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Đang tải...' : `Tải lên (${uploadFiles.length})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Link Modal */}
      {showPaymentModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4">
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-ink">Link thanh toán</h2>
                <p className="text-sm text-ink-muted">Hồ sơ: {selectedApplication.maTheoDoi}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-ink-muted hover:text-ink">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {submitting ? (
                <p className="text-ink-muted">Đang tạo liên kết thanh toán...</p>
              ) : paymentLink ? (
                <>
                  <p className="text-sm text-ink-muted">Đã tạo liên kết thanh toán thành công.</p>
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 border border-line rounded-lg break-all text-brand hover:bg-brand/5"
                  >
                    {paymentLink}
                  </a>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(paymentLink)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                  >
                    Sao chép liên kết
                  </button>
                </>
              ) : (
                <p className="text-red-700">Không tạo được liên kết thanh toán.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
