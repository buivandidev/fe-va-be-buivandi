'use client'

import { useEffect, useState, useCallback, useTransition } from 'react'
import { commentsApi, BinhLuan, getApiErrorMessage } from '@/lib/api/admin'

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<BinhLuan[]>([])
  const [pagination, setPagination] = useState({ tongSo: 0, trang: 1, kichThuocTrang: 20 })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [filterApproved, setFilterApproved] = useState<boolean | undefined>(undefined)

  const loadComments = useCallback((page: number = 1) => {
    startTransition(async () => {
      try {
        setError(null)
        const data = await commentsApi.layDanhSach({
          daDuyet: filterApproved,
          trang: page,
          kichThuocTrang: pagination.kichThuocTrang
        })
        setComments(data.danhSach)
        setPagination({ tongSo: data.tongSo, trang: data.trang, kichThuocTrang: data.kichThuocTrang })
      } catch (err) {
        setError(getApiErrorMessage(err))
      }
    })
  }, [filterApproved, pagination.kichThuocTrang])

  useEffect(() => {
    loadComments(1)
  }, [filterApproved, loadComments])

  const handleApprove = async (comment: BinhLuan) => {
    try {
      await commentsApi.duyet(comment.id)
      loadComments(pagination.trang)
    } catch (err) {
      alert(getApiErrorMessage(err))
    }
  }

  const handleDelete = async (comment: BinhLuan) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return
    
    try {
      await commentsApi.xoa(comment.id)
      loadComments(pagination.trang)
    } catch (err) {
      alert(getApiErrorMessage(err))
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
          <h1 className="text-2xl font-bold text-ink">Quản lý bình luận</h1>
          <p className="text-ink-muted text-sm">Duyệt và quản lý bình luận trên hệ thống</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          aria-label="Lọc trạng thái bình luận"
          value={filterApproved === undefined ? '' : filterApproved ? 'true' : 'false'}
          onChange={(e) => {
            const val = e.target.value
            setFilterApproved(val === '' ? undefined : val === 'true')
          }}
          className="px-4 py-2 border border-line rounded-lg focus:outline-none focus:border-brand"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="false">Chờ duyệt</option>
          <option value="true">Đã duyệt</option>
        </select>
        <button
          onClick={() => loadComments(1)}
          className="px-6 py-2 bg-ink text-white rounded-lg hover:bg-ink/90 transition"
        >
          Làm mới
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
          <button onClick={() => loadComments()} className="ml-4 underline">Thử lại</button>
        </div>
      )}

      {/* Comments list */}
      <div className={`space-y-4 transition-opacity ${isPending ? 'opacity-50' : ''}`}>
        {isPending && comments.length === 0 ? (
          <div className="bg-white border border-line rounded-lg p-8 text-center text-ink-muted">
            Đang tải...
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-white border border-line rounded-lg p-8 text-center text-ink-muted">
            Không có bình luận nào
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-white border rounded-lg p-4 ${
                comment.daDuyet ? 'border-line' : 'border-yellow-300 bg-yellow-50/50'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center text-brand font-medium text-sm">
                      {(comment.nguoiDung?.hoTen || comment.tenNguoi || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-ink">
                        {comment.nguoiDung?.hoTen || comment.tenNguoi || 'Ẩn danh'}
                      </p>
                      <p className="text-xs text-ink-muted">{formatDate(comment.ngayTao)}</p>
                    </div>
                    {!comment.daDuyet && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                        Chờ duyệt
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <p className="text-ink pl-11">{comment.noiDung}</p>

                  {/* Article link */}
                  {comment.baiViet && (
                    <p className="text-sm text-ink-muted mt-2 pl-11">
                      Bài viết: <span className="text-brand">{comment.baiViet.tieuDe}</span>
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!comment.daDuyet && (
                    <button
                      onClick={() => handleApprove(comment)}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition"
                    >
                      ✓ Duyệt
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition"
                  >
                    ✕ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-muted">
            Hiển thị {comments.length} / {pagination.tongSo} bình luận
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => loadComments(pagination.trang - 1)}
              disabled={pagination.trang <= 1 || isPending}
              className="px-3 py-1 border border-line rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <span className="px-3 py-1">
              Trang {pagination.trang} / {totalPages}
            </span>
            <button
              onClick={() => loadComments(pagination.trang + 1)}
              disabled={pagination.trang >= totalPages || isPending}
              className="px-3 py-1 border border-line rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
