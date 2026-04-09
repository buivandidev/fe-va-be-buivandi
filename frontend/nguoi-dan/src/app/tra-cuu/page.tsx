'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchApi, unwrapApiEnvelope } from '@/lib/api'

type DonUngTraCuu = {
  maTheoDoi?: string
  MaTheoDoi?: string
  tenNguoiNop?: string
  TenNguoiNop?: string
  emailNguoiNop?: string
  EmailNguoiNop?: string
  trangThai?: string
  TrangThai?: string
  nhanTrangThai?: string
  NhanTrangThai?: string
  ngayNop?: string
  NgayNop?: string
  ngayHenTra?: string
  NgayHenTra?: string
  hanXuLy?: string
  HanXuLy?: string
  tenDichVu?: string
  TenDichVu?: string
}

const STATUS_LABELS: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  ChoXuLy: { label: 'Chờ xử lý', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: 'pending' },
  DangXuLy: { label: 'Đang xử lý', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: 'sync' },
  HoanThanh: { label: 'Hoàn thành', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: 'check_circle' },
  TuChoi: { label: 'Từ chối', color: 'text-rose-600', bgColor: 'bg-rose-50', icon: 'cancel' }
}

function formatDate(value?: string): string {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function TraCuuHoSoContent() {
  const searchParams = useSearchParams()
  const [maTheoDoi, setMaTheoDoi] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DonUngTraCuu | null>(null)

  const traCuuHoSo = async (ma: string, mail: string) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetchApi(
        `/api/public/applications/track?maTheoDoi=${encodeURIComponent(ma)}&email=${encodeURIComponent(mail)}`,
        { cache: 'no-store' }
      )
      const payload = await res.json().catch(() => null)
      const { success, message, data } = unwrapApiEnvelope<DonUngTraCuu>(payload)

      if (!res.ok || !success || !data) {
        if (res.status === 404) {
          setError('Không tìm thấy hồ sơ hoặc email không khớp với mã tra cứu.')
          return
        }
        setError(message || 'Không thể tra cứu hồ sơ lúc này. Vui lòng thử lại sau.')
        return
      }

      setResult(data)
    } catch (err) {
      setError('Không thể kết nối máy chủ. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const ma = (searchParams?.get('ma') || '').trim()
    const mail = (searchParams?.get('email') || '').trim()
    if (!ma || !mail) return

    setMaTheoDoi(ma)
    setEmail(mail)
    void traCuuHoSo(ma, mail)
  }, [searchParams])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!maTheoDoi.trim() || !email.trim()) {
      setError('Vui lòng nhập đầy đủ mã tra cứu và email.')
      return
    }
    void traCuuHoSo(maTheoDoi.trim(), email.trim())
  }

  return (
    <div className="bg-slate-50/50 dark:bg-background-dark min-h-screen pb-20">
      <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        
        {/* Header section with badge */}
        <div className="text-center max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <span className="material-symbols-outlined text-base">saved_search</span>
            Theo dõi tiến độ
          </nav>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Khu vực tra cứu hồ sơ</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
            Sử dụng mã số biên nhận và địa chỉ Email đã đăng ký để kiểm tra trạng thái xử lý chính xác nhất từ cơ quan chức năng.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden mb-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={maTheoDoi}
                  onChange={(e) => setMaTheoDoi(e.target.value)}
                  placeholder="Mã hồ sơ (HS...)"
                  className="w-full px-6 h-14 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none text-base font-bold transition-all dark:text-white placeholder:text-slate-400"
                />
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email người nộp"
                  className="w-full px-6 h-14 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none text-base font-bold transition-all dark:text-white placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-14 px-10 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin font-black text-2xl">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined font-black text-2xl">search</span>
                )}
                {loading ? 'ĐANG TÌM' : 'TRA CỨU'}
              </button>
            </form>
          </div>

          {/* Results Area */}
          <div className="bg-slate-50/50 dark:bg-slate-800/30 p-8 md:p-12 border-t border-slate-100 dark:border-slate-800 min-h-[200px] flex flex-col justify-center">
            {error && (
              <div className="flex items-center gap-4 p-6 rounded-3xl border border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 animate-in slide-in-from-left-4">
                <span className="material-symbols-outlined text-4xl">error</span>
                <p className="font-bold">{error}</p>
              </div>
            )}

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-10 border-b border-slate-200 dark:border-slate-700">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">Mã số hồ sơ</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{result.maTheoDoi || result.MaTheoDoi}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl ${STATUS_LABELS[result.trangThai || result.TrangThai || 'ChoXuLy']?.bgColor} ${STATUS_LABELS[result.trangThai || result.TrangThai || 'ChoXuLy']?.color}`}>
                    <span className="material-symbols-outlined font-black">
                      {STATUS_LABELS[result.trangThai || result.TrangThai || 'ChoXuLy']?.icon}
                    </span>
                    <span className="text-sm font-black uppercase tracking-tight">
                      {STATUS_LABELS[result.trangThai || result.TrangThai || 'ChoXuLy']?.label}
                    </span>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: 'Họ tên người nộp', value: result.tenNguoiNop || result.TenNguoiNop, icon: 'person' },
                    { label: 'Dịch vụ yêu cầu', value: result.tenDichVu || result.TenDichVu, icon: 'assignment' },
                    { label: 'Ngày tiếp nhận', value: formatDate(result.ngayNop || result.NgayNop), icon: 'event' },
                    { label: 'Hẹn kết quả', value: formatDate(result.ngayHenTra || result.NgayHenTra || result.hanXuLy || result.HanXuLy), icon: 'calendar_today' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-xl">{item.icon}</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">{item.value || '--'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!error && !result && !loading && (
              <div className="text-center py-10 opacity-40">
                <span className="material-symbols-outlined text-7xl mb-4">manage_search</span>
                <p className="font-bold text-slate-500 italic">Vui lòng cung cấp mã hồ sơ để lấy thông tin chi tiết.</p>
              </div>
            )}
          </div>
        </div>

        {/* Advice Section */}
        <div className="grid md:grid-cols-2 gap-8 animate-in delay-500 duration-1000">
           <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white flex gap-6">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">info</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-lg">Tôi bị mất mã hồ sơ?</h4>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">Bạn có thể kiểm tra email đã dùng khi nộp hoặc đăng nhập vào Cổng dịch vụ công để xem lại danh sách hồ sơ cá nhân.</p>
              </div>
           </div>
           <div className="p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex gap-6">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-lg text-slate-900 dark:text-white">Hỗ trợ tra cứu nhanh</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium text-slate-500 dark:text-slate-400">Tổng đài 1900xxxx luôn sẵn sàng hỗ trợ giải đáp các thắc mắc về tình trạng hồ sơ 24/7.</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}

export default function TraCuuHoSo() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
           <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
        </div>
      }
    >
      <TraCuuHoSoContent />
    </Suspense>
  )
}
