'use client'

import { useEffect, useState, useCallback } from 'react'
import { auditLogsApi, NhatKyKiemTra } from '@/lib/api/admin-settings'

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<NhatKyKiemTra[]>([])
  const [loading, setLoading] = useState(true)
  const [trang, setTrang] = useState(1)
  const [tongSo, setTongSo] = useState(0)
  const [tenThucThe, setTenThucThe] = useState('')
  const kichThuocTrang = 50

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true)
      const data = await auditLogsApi.layDanhSach({
        tenThucThe: tenThucThe || undefined,
        trang,
        kichThuocTrang
      })
      setLogs(data.danhSach)
      setTongSo(data.tongSo)
    } catch (error) {
      console.error('Lỗi tải nhật ký:', error)
    } finally {
      setLoading(false)
    }
  }, [trang, tenThucThe])

  useEffect(() => {
    loadLogs()
  }, [trang, tenThucThe, loadLogs])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const tongTrang = Math.ceil(tongSo / kichThuocTrang)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Nhật ký kiểm tra</h2>
        <p className="text-sm text-slate-600 mt-1">Theo dõi các thao tác trên hệ thống</p>
      </div>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Lọc theo tên thực thể..."
          value={tenThucThe}
          onChange={(e) => {
            setTenThucThe(e.target.value)
            setTrang(1)
          }}
          className="px-4 py-2 border border-slate-300 rounded-lg w-64"
        />
        <button
          onClick={() => {
            setTenThucThe('')
            setTrang(1)
          }}
          className="px-4 py-2 text-slate-600 hover:text-slate-900"
        >
          Xóa bộ lọc
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thời gian</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Thực thể</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hành động</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Người dùng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID thực thể</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {formatDate(log.thoiGian)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {log.tenThucThe}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          log.hanhDong === 'Create' ? 'bg-green-100 text-green-700' :
                          log.hanhDong === 'Update' ? 'bg-blue-100 text-blue-700' :
                          log.hanhDong === 'Delete' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {log.hanhDong}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {log.tenNguoiDung || 'Hệ thống'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                        {log.idThucThe ? `${log.idThucThe.substring(0, 8)}...` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {tongTrang > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-slate-600">
                Hiển thị {(trang - 1) * kichThuocTrang + 1} - {Math.min(trang * kichThuocTrang, tongSo)} trong tổng số {tongSo}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTrang(p => Math.max(1, p - 1))}
                  disabled={trang === 1}
                  className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50"
                >
                  Trước
                </button>
                <span className="px-3 py-1">
                  Trang {trang} / {tongTrang}
                </span>
                <button
                  onClick={() => setTrang(p => Math.min(tongTrang, p + 1))}
                  disabled={trang === tongTrang}
                  className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
