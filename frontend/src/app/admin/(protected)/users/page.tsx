'use client'

import { useEffect, useState, useCallback, useTransition } from 'react'
import { usersApi, NguoiDung, TaoNguoiDungDto, CapNhatNguoiDungDto, getApiErrorMessage } from '@/lib/api/admin'

const ROLES = ['Admin', 'BienTap', 'NguoiDung']

export default function AdminUsersPage() {
  const [users, setUsers] = useState<NguoiDung[]>([])
  const [pagination, setPagination] = useState({ tongSo: 0, trang: 1, kichThuocTrang: 10 })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<NguoiDung | null>(null)
  const [formData, setFormData] = useState<TaoNguoiDungDto>({
    hoTen: '',
    email: '',
    matKhau: '',
    soDienThoai: '',
    vaiTro: 'NguoiDung',
    dangHoatDong: true
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadUsers = useCallback((page: number = 1) => {
    startTransition(async () => {
      try {
        setError(null)
        const data = await usersApi.layDanhSach({
          tuKhoa: search || undefined,
          trang: page,
          kichThuocTrang: pagination.kichThuocTrang
        })
        setUsers(data.danhSach)
        setPagination({ tongSo: data.tongSo, trang: data.trang, kichThuocTrang: data.kichThuocTrang })
      } catch (err) {
        setError(getApiErrorMessage(err))
      }
    })
  }, [search, pagination.kichThuocTrang])

  useEffect(() => {
    loadUsers(1)
  }, [search, loadUsers])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadUsers(1)
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData({
      hoTen: '',
      email: '',
      matKhau: '',
      soDienThoai: '',
      vaiTro: 'NguoiDung',
      dangHoatDong: true
    })
    setFormError(null)
    setShowModal(true)
  }

  const openEditModal = (user: NguoiDung) => {
    setEditingUser(user)
    setFormData({
      hoTen: user.hoTen,
      email: user.email,
      matKhau: '',
      soDienThoai: user.soDienThoai || '',
      vaiTro: user.danhSachVaiTro[0] || 'NguoiDung',
      dangHoatDong: user.dangHoatDong
    })
    setFormError(null)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      if (editingUser) {
        const updateData: CapNhatNguoiDungDto = {
          hoTen: formData.hoTen,
          soDienThoai: formData.soDienThoai,
          vaiTro: formData.vaiTro,
          dangHoatDong: formData.dangHoatDong
        }
        await usersApi.capNhat(editingUser.id, updateData)
      } else {
        await usersApi.taoMoi(formData)
      }
      setShowModal(false)
      loadUsers(pagination.trang)
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async (user: NguoiDung) => {
    if (!confirm(`Bạn có chắc muốn vô hiệu hóa tài khoản "${user.hoTen}"?`)) return
    
    try {
      await usersApi.voHieuHoa(user.id)
      loadUsers(pagination.trang)
    } catch (err) {
      alert(getApiErrorMessage(err))
    }
  }

  const totalPages = Math.ceil(pagination.tongSo / pagination.kichThuocTrang)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Quản lý người dùng</h1>
          <p className="text-ink-muted text-sm">Quản lý tài khoản người dùng trong hệ thống</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition flex items-center gap-2"
        >
          <span>+</span> Thêm người dùng
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <input
          aria-label="Tìm theo tên hoặc email người dùng"
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
        />
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
          <button onClick={() => loadUsers()} className="ml-4 underline">Thử lại</button>
        </div>
      )}

      {/* Table */}
      <div className={`bg-white border border-line rounded-lg overflow-hidden transition-opacity ${isPending ? 'opacity-50' : ''}`}>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-line">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Họ tên</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Vai trò</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Trạng thái</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Ngày tạo</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-ink-muted">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isPending && users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                  Đang tải...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-line last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center text-brand font-medium">
                        {user.hoTen.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-ink">{user.hoTen}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.danhSachVaiTro.includes('Admin') ? 'bg-purple-100 text-purple-700' :
                      user.danhSachVaiTro.includes('BienTap') ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.danhSachVaiTro.join(', ') || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.dangHoatDong ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.dangHoatDong ? 'Hoạt động' : 'Vô hiệu'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted text-sm">
                    {new Date(user.ngayTao).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEditModal(user)}
                      className="px-3 py-1 text-sm text-brand hover:bg-brand/10 rounded transition"
                    >
                      Sửa
                    </button>
                    {user.dangHoatDong && (
                      <button
                        onClick={() => handleDeactivate(user)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition ml-2"
                      >
                        Vô hiệu hóa
                      </button>
                    )}
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
            Hiển thị {users.length} / {pagination.tongSo} người dùng
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => loadUsers(pagination.trang - 1)}
              disabled={pagination.trang <= 1 || isPending}
              className="px-3 py-1 border border-line rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-3 py-1">
              Trang {pagination.trang} / {totalPages}
            </span>
            <button
              onClick={() => loadUsers(pagination.trang + 1)}
              disabled={pagination.trang >= totalPages || isPending}
              className="px-3 py-1 border border-line rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-line">
              <h2 className="text-xl font-bold text-ink">
                {editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-red-800 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Họ tên *</label>
                <input
                  aria-label="Họ tên người dùng"
                  type="text"
                  required
                  value={formData.hoTen}
                  onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Email *</label>
                <input
                  aria-label="Email người dùng"
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand disabled:bg-gray-100"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Mật khẩu *</label>
                  <input
                    aria-label="Mật khẩu người dùng"
                    type="password"
                    required
                    value={formData.matKhau}
                    onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                    className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                    minLength={8}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Số điện thoại</label>
                <input
                  aria-label="Số điện thoại người dùng"
                  type="tel"
                  value={formData.soDienThoai}
                  onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Vai trò *</label>
                <select
                  aria-label="Vai trò người dùng"
                  required
                  value={formData.vaiTro}
                  onChange={(e) => setFormData({ ...formData, vaiTro: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
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
                  className="flex-1 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition disabled:opacity-50"
                >
                  {submitting ? 'Đang xử lý...' : (editingUser ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
