'use client'

import { useEffect, useState, useCallback } from 'react'
import { contactsApi, TinNhanLienHe, getApiErrorMessage } from '@/lib/api/admin-contacts'

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<TinNhanLienHe[]>([])
  const [loading, setLoading] = useState(true)
  const [trang, setTrang] = useState(1)
  const [tongSo, setTongSo] = useState(0)
  const [filterRead, setFilterRead] = useState<boolean | undefined>(undefined)
  const [selectedContact, setSelectedContact] = useState<TinNhanLienHe | null>(null)
  const kichThuocTrang = 20

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true)
      const data = await contactsApi.layDanhSach({
        daDoc: filterRead,
        trang,
        kichThuocTrang
      })
      setContacts(data.danhSach)
      setTongSo(data.tongSo)
    } catch (error) {
      console.error('Lỗi tải tin nhắn:', error)
    } finally {
      setLoading(false)
    }
  }, [trang, filterRead])

  useEffect(() => {
    loadContacts()
  }, [trang, filterRead, loadContacts])

  const handleMarkAsRead = async (id: string) => {
    try {
      await contactsApi.danhDauDaDoc(id)
      await loadContacts()
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, daDoc: true })
      }
    } catch (error) {
      alert(getApiErrorMessage(error))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xác nhận xóa tin nhắn này?')) return
    
    try {
      await contactsApi.xoa(id)
      await loadContacts()
      if (selectedContact?.id === id) {
        setSelectedContact(null)
      }
    } catch (error) {
      alert(getApiErrorMessage(error))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const tongTrang = Math.ceil(tongSo / kichThuocTrang)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Tin nhắn liên hệ</h2>
        <p className="text-sm text-slate-600 mt-1">Quản lý tin nhắn từ người dùng</p>
      </div>

      <div className="mb-4 flex gap-4">
        <label htmlFor="filterRead" className="sr-only">Lọc trạng thái đọc</label>
        <select
          id="filterRead"
          aria-label="Lọc trạng thái đọc"
          value={filterRead === undefined ? '' : filterRead ? 'true' : 'false'}
          onChange={(e) => {
            const val = e.target.value
            setFilterRead(val === '' ? undefined : val === 'true')
            setTrang(1)
          }}
          className="px-4 py-2 border border-slate-300 rounded-lg"
        >
          <option value="">Tất cả</option>
          <option value="false">Chưa đọc</option>
          <option value="true">Đã đọc</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 cursor-pointer hover:bg-slate-50 ${
                    selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                  } ${!contact.daDoc ? 'bg-yellow-50' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{contact.hoTen}</h3>
                        {!contact.daDoc && (
                          <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                            Mới
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{contact.email}</p>
                      {contact.soDienThoai && (
                        <p className="text-sm text-slate-600">{contact.soDienThoai}</p>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(contact.ngayTao)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{contact.noiDung}</p>
                </div>
              ))}
            </div>

            {tongTrang > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Trang {trang} / {tongTrang}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTrang(p => Math.max(1, p - 1))}
                    disabled={trang === 1}
                    className="px-3 py-1 border border-slate-300 rounded disabled:opacity-50"
                  >
                    Trước
                  </button>
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
          </div>

          {/* Detail */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            {selectedContact ? (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedContact.hoTen}</h3>
                    <p className="text-slate-600">{selectedContact.email}</p>
                    {selectedContact.soDienThoai && (
                      <p className="text-slate-600">{selectedContact.soDienThoai}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedContact.daDoc ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedContact.daDoc ? 'Đã đọc' : 'Chưa đọc'}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-500 mb-1">Ngày gửi:</p>
                  <p className="text-slate-900">{formatDate(selectedContact.ngayTao)}</p>
                </div>

                {selectedContact.daDoc && selectedContact.ngayDoc && (
                  <div className="mb-4">
                    <p className="text-sm text-slate-500 mb-1">Ngày đọc:</p>
                    <p className="text-slate-900">{formatDate(selectedContact.ngayDoc)}</p>
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-sm text-slate-500 mb-2">Nội dung:</p>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-900 whitespace-pre-wrap">{selectedContact.noiDung}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!selectedContact.daDoc && (
                    <button
                      onClick={() => handleMarkAsRead(selectedContact.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectedContact.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Xóa
                  </button>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Trả lời qua Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                Chọn một tin nhắn để xem chi tiết
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
