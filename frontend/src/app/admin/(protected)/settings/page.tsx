'use client'

import { useEffect, useState } from 'react'
import { settingsApi, CaiDatTrangWebDto, getApiErrorMessage, CaiDatTrangWeb } from '@/lib/api/admin-settings'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CaiDatTrangWeb[]>([])
  const [loading, setLoading] = useState(true)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSetting, setNewSetting] = useState<CaiDatTrangWebDto>({
    khoa: '',
    giaTri: '',
    loai: 'Text'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.layDanhSach()
      setSettings(data)
    } catch (error) {
      console.error('Lỗi tải cài đặt:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (khoa: string, giaTri: string) => {
    setEditingKey(khoa)
    setEditValue(giaTri)
  }

  const handleSave = async (khoa: string) => {
    try {
      await settingsApi.capNhatTheoKhoa(khoa, { giaTri: editValue })
      await loadSettings()
      setEditingKey(null)
    } catch (error) {
      alert(getApiErrorMessage(error))
    }
  }

  const handleDelete = async (khoa: string) => {
    if (!confirm(`Xác nhận xóa cài đặt "${khoa}"?`)) return
    
    try {
      await settingsApi.xoa(khoa)
      await loadSettings()
    } catch (error) {
      alert(getApiErrorMessage(error))
    }
  }

  const handleAdd = async () => {
    try {
      await settingsApi.taoMoi(newSetting)
      await loadSettings()
      setShowAddModal(false)
      setNewSetting({ khoa: '', giaTri: '', loai: 'Text' })
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
          <h2 className="text-2xl font-bold text-slate-900">Cài đặt hệ thống</h2>
          <p className="text-sm text-slate-600 mt-1">Quản lý cấu hình trang web</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Thêm cài đặt
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Khóa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Giá trị</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Loại</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {settings.map((setting) => (
              <tr key={setting.khoa} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{setting.khoa}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {editingKey === setting.khoa ? (
                    <input
                      id={`edit-value-${setting.khoa}`}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-1 border border-slate-300 rounded"
                      aria-label={`Giá trị cho ${setting.khoa}`}
                    />
                  ) : (
                    <span className="line-clamp-2">{setting.giaTri}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{setting.loai}</td>
                <td className="px-6 py-4 text-right text-sm">
                  {editingKey === setting.khoa ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSave(setting.khoa)}
                        className="text-green-600 hover:text-green-700"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingKey(null)}
                        className="text-slate-600 hover:text-slate-700"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(setting.khoa, setting.giaTri)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(setting.khoa)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Thêm cài đặt mới</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="add-key" className="block text-sm font-medium text-slate-700 mb-1">Khóa</label>
                <input
                  id="add-key"
                  type="text"
                  value={newSetting.khoa}
                  onChange={(e) => setNewSetting({ ...newSetting, khoa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="VD: TenTrangWeb"
                />
              </div>
              <div>
                <label htmlFor="add-value" className="block text-sm font-medium text-slate-700 mb-1">Giá trị</label>
                <input
                  id="add-value"
                  type="text"
                  value={newSetting.giaTri}
                  onChange={(e) => setNewSetting({ ...newSetting, giaTri: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="add-type" className="block text-sm font-medium text-slate-700 mb-1">Loại</label>
                <select
                  id="add-type"
                  value={newSetting.loai}
                  onChange={(e) => setNewSetting({ ...newSetting, loai: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  aria-label="Chọn loại cài đặt"
                >
                  <option value="Text">Text</option>
                  <option value="Number">Number</option>
                  <option value="Boolean">Boolean</option>
                  <option value="Json">Json</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
