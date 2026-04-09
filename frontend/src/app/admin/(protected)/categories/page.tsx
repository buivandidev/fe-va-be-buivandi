'use client'

import { useEffect, useState } from 'react'
import { categoriesApi, DanhMuc, TaoDanhMucDto, CapNhatDanhMucDto, getApiErrorMessage } from '@/lib/api/admin'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<DanhMuc[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<TaoDanhMucDto>({
    ten: '',
    moTa: '',
    loai: 'BaiViet',
    thuTuSapXep: 0,
    dangHoatDong: true
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoriesApi.layDanhSach()
      setCategories(data)
    } catch (error) {
      console.error('Lỗi tải danh mục:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (category?: DanhMuc) => {
    if (category) {
      setEditingId(category.id)
      setFormData({
        ten: category.ten,
        moTa: category.moTa,
        loai: category.loai,
        thuTuSapXep: category.thuTuSapXep,
        dangHoatDong: category.dangHoatDong
      })
    } else {
      setEditingId(null)
      setFormData({
        ten: '',
        moTa: '',
        loai: 'BaiViet',
        thuTuSapXep: 0,
        dangHoatDong: true
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await categoriesApi.capNhat(editingId, formData as CapNhatDanhMucDto)
      } else {
        await categoriesApi.taoMoi(formData)
      }
      await loadCategories()
      setShowModal(false)
    } catch (error) {
      alert(getApiErrorMessage(error))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xác nhận xóa danh mục này?')) return
    
    try {
      await categoriesApi.xoa(id)
      await loadCategories()
    } catch (error) {
      alert(getApiErrorMessage(error))
    }
  }

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Quản lý danh mục</h2>
          <p className="text-sm text-slate-600 mt-1">Danh mục cho tin tức và dịch vụ</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Đường dẫn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thứ tự</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{cat.ten}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{cat.loai}</td>
                <td className="px-6 py-4 text-sm text-slate-500 font-mono">/{cat.duongDan}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{cat.thuTuSapXep}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    cat.dangHoatDong ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {cat.dangHoatDong ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="text-blue-600 hover:text-blue-700 mr-3"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên danh mục</label>
                <input
                  id="tenDanhMuc"
                  type="text"
                  value={formData.ten}
                  onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="VD: Tin tức"
                  aria-label="Tên danh mục"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
                <textarea
                  id="moTa"
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  rows={3}
                  aria-label="Mô tả"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Loại</label>
                <select
                  id="loai"
                  value={formData.loai}
                  onChange={(e) => setFormData({ ...formData, loai: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  aria-label="Loại danh mục"
                >
                  <option value="BaiViet">Bài viết</option>
                  <option value="DichVu">Dịch vụ</option>
                  <option value="ThuVien">Thư viện</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Thứ tự sắp xếp</label>
                <input
                  id="thuTuSapXep"
                  type="number"
                  value={formData.thuTuSapXep}
                  onChange={(e) => setFormData({ ...formData, thuTuSapXep: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  aria-label="Thứ tự sắp xếp"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="dangHoatDong"
                  checked={formData.dangHoatDong}
                  onChange={(e) => setFormData({ ...formData, dangHoatDong: e.target.checked })}
                  className="mr-2"
                  aria-label="Đang hoạt động"
                />
                <label htmlFor="dangHoatDong" className="text-sm text-slate-700">Đang hoạt động</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingId ? 'Cập nhật' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
