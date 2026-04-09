'use client'

import { useEffect, useState, useCallback, useTransition } from 'react'
import dynamic from 'next/dynamic'
import { articlesApi, categoriesApi, mediaApi, BaiViet, DanhMuc, TrangThaiBaiViet, TaoBaiVietDto, getApiErrorMessage } from '@/lib/api/admin'
import { logger } from '@/lib/utils/logger'

const RichEditor = dynamic(() => import('@/components/rich-editor'), { ssr: false, loading: () => <p>Đang tải Editor...</p> })

const STATUS_LABELS: Record<TrangThaiBaiViet, { label: string; color: string }> = {
  'BanNhap': { label: 'Nháp', color: 'bg-gray-100 text-gray-700' },
  'ChoDuyet': { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700' },
  'DaXuatBan': { label: 'Đã xuất bản', color: 'bg-green-100 text-green-700' },
  'LuuTru': { label: 'Lưu trữ (Từ chối)', color: 'bg-red-100 text-red-700' }
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<BaiViet[]>([])
  const [categories, setCategories] = useState<DanhMuc[]>([])
  const [pagination, setPagination] = useState({ tongSo: 0, trang: 1, kichThuocTrang: 10 })
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<TrangThaiBaiViet | ''>('')
  const [filterCategory, setFilterCategory] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<BaiViet | null>(null)
  const [formData, setFormData] = useState<TaoBaiVietDto>({
    tieuDe: '',
    tomTat: '',
    noiDung: '',
    anhDaiDien: '',
    danhMucId: '',
    trangThai: 'BanNhap'
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isPending, startTransition] = useTransition()

  const loadArticles = useCallback((page: number = 1) => {
    startTransition(async () => {
      try {
        setError(null)
        logger.log('🔍 Loading articles...', { search, filterStatus, filterCategory, page })
        const data = await articlesApi.layDanhSach({
          timKiem: search || undefined,
          tuKhoa: search || undefined,
          danhMucId: filterCategory || undefined,
          trangThai: filterStatus || undefined,
          trang: page,
          kichThuocTrang: pagination.kichThuocTrang
        })
        logger.log('✅ Articles loaded:', data)
        setArticles(data.danhSach)
        setPagination({ tongSo: data.tongSo, trang: data.trang, kichThuocTrang: data.kichThuocTrang })
      } catch (err) {
        logger.error('❌ Error loading articles:', err)
        setError(getApiErrorMessage(err))
      }
    })
  }, [search, filterStatus, filterCategory, pagination.kichThuocTrang])

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoriesApi.layDanhSach()
      setCategories(data)
      // Set default category for new articles if not already set
      if (!formData.danhMucId && data.length > 0) {
        setFormData(prev => ({ ...prev, danhMucId: data[0].id }))
      }
    } catch (err) {
      logger.error('Failed to load categories:', err)
    }
  }, [formData.danhMucId])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    loadArticles(1)
  }, [search, filterStatus, filterCategory, loadArticles])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as TrangThaiBaiViet | '')
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value)
  }

  const openCreateModal = () => {
    setEditingArticle(null)
    setFormData({
      tieuDe: '',
      tomTat: '',
      noiDung: '',
      anhDaiDien: '',
      danhMucId: categories[0]?.id || '',
      trangThai: 'BanNhap'
    })
    setFormError(null)
    setShowModal(true)
  }

  const openEditModal = async (article: BaiViet) => {
    try {
      const fullArticle = await articlesApi.layTheoId(article.id)
      setEditingArticle(fullArticle)
      setFormData({
        tieuDe: fullArticle.tieuDe,
        tomTat: fullArticle.tomTat || '',
        noiDung: fullArticle.noiDung,
        anhDaiDien: fullArticle.anhDaiDien || '',
        danhMucId: fullArticle.danhMucId,
        trangThai: fullArticle.trangThai
      })
      setFormError(null)
      setShowModal(true)
    } catch (err) {
      alert(getApiErrorMessage(err))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      if (editingArticle) {
        await articlesApi.capNhat(editingArticle.id, formData)
      } else {
        await articlesApi.taoMoi(formData)
      }
      setShowModal(false)
      loadArticles(pagination.trang)
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (article: BaiViet) => {
    if (!confirm(`Bạn có chắc muốn xóa bài viết "${article.tieuDe}"?`)) return
    
    try {
      await articlesApi.xoa(article.id)
      loadArticles(pagination.trang)
    } catch (err) {
      alert(getApiErrorMessage(err))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFormError('Vui lòng chọn file ảnh (jpg, png, gif, webp)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Kích thước ảnh không được vượt quá 5MB')
      return
    }

    setUploadingImage(true)
    setFormError(null)

    try {
      const media = await mediaApi.taiLenAnh(file)
      setFormData({ ...formData, anhDaiDien: media.urlTep })
    } catch (err) {
      setFormError(getApiErrorMessage(err))
    } finally {
      setUploadingImage(false)
    }
  }

  const totalPages = Math.ceil(pagination.tongSo / pagination.kichThuocTrang)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Quản lý tin tức</h1>
          <p className="text-ink-muted text-sm">Quản lý tin tức và bài viết trên hệ thống</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition flex items-center gap-2"
        >
          <span>+</span> Thêm tin tức
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          aria-label="Tìm kiếm bài viết"
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={search}
          onChange={handleSearchChange}
          className="flex-1 min-w-[200px] px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
        />
        <select
          aria-label="Lọc theo trạng thái bài viết"
          value={filterStatus}
          onChange={handleStatusChange}
          className="px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          aria-label="Lọc theo danh mục bài viết"
          value={filterCategory}
          onChange={handleCategoryChange}
          className="px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.ten}</option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
          <button onClick={() => loadArticles()} className="ml-4 underline">Thử lại</button>
        </div>
      )}

      {/* Table */}
      <div className={`bg-white border border-line rounded-lg overflow-hidden transition-opacity ${isPending ? 'opacity-50' : ''}`}>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-line">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Tiêu đề</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Danh mục</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Trạng thái</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Lượt xem</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-ink-muted">Ngày tạo</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-ink-muted">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isPending && articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                  Đang tải...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="border-b border-line last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <p className="font-medium text-ink truncate">{article.tieuDe}</p>
                      {article.tomTat && (
                        <p className="text-sm text-ink-muted truncate">{article.tomTat}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {article.danhMuc?.ten || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_LABELS[article.trangThai]?.color || 'bg-gray-100'}`}>
                      {STATUS_LABELS[article.trangThai]?.label || article.trangThai}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {article.soLuotXem?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-3 text-ink-muted text-sm">
                    {new Date(article.ngayTao).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEditModal(article)}
                      className="px-3 py-1 text-sm text-brand hover:bg-brand/10 rounded transition"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(article)}
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
            Hiển thị {articles.length} / {pagination.tongSo} bài viết
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => loadArticles(pagination.trang - 1)}
              disabled={pagination.trang <= 1 || isPending}
              className="px-3 py-1 border border-line rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-3 py-1">
              Trang {pagination.trang} / {totalPages}
            </span>
            <button
              onClick={() => loadArticles(pagination.trang + 1)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-line sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-ink">
                {editingArticle ? 'Cập nhật tin tức' : 'Thêm tin tức mới'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded p-3 text-red-800 text-sm">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Tiêu đề *</label>
                <input
                  aria-label="Tiêu đề bài viết"
                  type="text"
                  required
                  value={formData.tieuDe}
                  onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Tóm tắt</label>
                <textarea
                  aria-label="Tóm tắt bài viết"
                  rows={2}
                  value={formData.tomTat}
                  onChange={(e) => setFormData({ ...formData, tomTat: e.target.value })}
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                />
              </div>

              <div className="flex flex-col">
                <label className="block text-sm font-medium text-ink mb-1">Nội dung * (Viết tin tức & Upload ảnh tùy chỉnh bên trong)</label>
                <RichEditor
                  value={formData.noiDung}
                  onChange={(content) => setFormData({ ...formData, noiDung: content })}
                  placeholder="Viết nội dung tin tức, hỗ trợ chèn ảnh và định dạng phong phú..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Danh mục *</label>
                  <select
                    aria-label="Danh mục bài viết"
                    required
                    value={formData.danhMucId}
                    onChange={(e) => setFormData({ ...formData, danhMucId: e.target.value })}
                    className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.ten}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Trạng thái</label>
                  <select
                    aria-label="Trạng thái bài viết"
                    value={formData.trangThai}
                    onChange={(e) => setFormData({ ...formData, trangThai: e.target.value as TrangThaiBaiViet })}
                    className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
                  >
                    {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Ảnh đại diện</label>
                <div className="space-y-2">
                  {formData.anhDaiDien && (
                    <div className="relative w-full h-48 border border-line rounded-lg overflow-hidden">
                      <img 
                        src={formData.anhDaiDien} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, anhDaiDien: '' })}
                        className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="flex-1 text-sm"
                      aria-label="Chọn file ảnh để tải lên"
                      title="Chọn file ảnh để tải lên"
                    />
                    {uploadingImage && (
                      <span className="text-sm text-ink-muted">Đang tải lên...</span>
                    )}
                  </div>
                  <input
                    aria-label="Hoặc nhập URL ảnh đại diện"
                    type="url"
                    value={formData.anhDaiDien}
                    onChange={(e) => setFormData({ ...formData, anhDaiDien: e.target.value })}
                    className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:border-brand text-sm"
                    placeholder="Hoặc nhập URL ảnh: https://..."
                  />
                </div>
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
                  {submitting ? 'Đang xử lý...' : (editingArticle ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
