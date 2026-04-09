'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  dashboardApi,
  DuLieuBieuDo,
  ThongKeBangDieuKhien,
  getApiErrorMessage,
} from '@/lib/api/admin'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

interface StatCard {
  label: string
  value: number
  icon: string
  color: string
  bgColor: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<ThongKeBangDieuKhien | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [articlesChart, setArticlesChart] = useState<DuLieuBieuDo | null>(null)
  const [statusChart, setStatusChart] = useState<DuLieuBieuDo | null>(null)
  const [loadingArticlesChart, setLoadingArticlesChart] = useState(true)
  const [loadingStatusChart, setLoadingStatusChart] = useState(true)
  const [articlesChartError, setArticlesChartError] = useState<string | null>(null)
  const [statusChartError, setStatusChartError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardApi.layThongKe()
      setStats(data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const loadArticlesChart = async () => {
    try {
      setLoadingArticlesChart(true)
      setArticlesChartError(null)
      const data = await dashboardApi.layBieuDoBaiViet(6)
      setArticlesChart(data)
    } catch (err) {
      setArticlesChartError(getApiErrorMessage(err))
      setArticlesChart(null)
    } finally {
      setLoadingArticlesChart(false)
    }
  }

  const loadStatusChart = async () => {
    try {
      setLoadingStatusChart(true)
      setStatusChartError(null)
      const data = await dashboardApi.layBieuDoTrangThaiHoSo()
      setStatusChart(data)
    } catch (err) {
      setStatusChartError(getApiErrorMessage(err))
      setStatusChart(null)
    } finally {
      setLoadingStatusChart(false)
    }
  }

  const loadDashboard = async () => {
    await Promise.all([loadStats(), loadArticlesChart(), loadStatusChart()])
  }

  const articlesChartData = useMemo(() => {
    if (!articlesChart || articlesChart.nhanDuLieu.length === 0 || articlesChart.tapDuLieu.length === 0) {
      return null
    }

    return {
      labels: articlesChart.nhanDuLieu,
      datasets: articlesChart.tapDuLieu.map((item, index) => ({
        label: item.nhanDuLieu || `Tap du lieu ${index + 1}`,
        data: item.duLieu,
        backgroundColor: item.mauNen || 'rgba(59, 130, 246, 0.4)',
        borderColor: item.mauVien || 'rgb(37, 99, 235)',
        borderWidth: 1,
        borderRadius: 8,
      })),
    }
  }, [articlesChart])

  const statusChartData = useMemo(() => {
    if (!statusChart || statusChart.nhanDuLieu.length === 0 || statusChart.tapDuLieu.length === 0) {
      return null
    }

    const source = statusChart.tapDuLieu[0]
    const palette = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#6366f1', '#f97316']

    return {
      labels: statusChart.nhanDuLieu,
      datasets: [
        {
          label: source.nhanDuLieu || 'Ho so',
          data: source.duLieu,
          backgroundColor: statusChart.nhanDuLieu.map((_, index) => palette[index % palette.length]),
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    }
  }, [statusChart])

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      title: { display: false },
    },
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-line rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-900 mb-2">Lỗi tải dữ liệu</h2>
        <p className="text-red-800 text-sm mb-4">{error}</p>
        <button
          onClick={loadStats}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Thử lại
        </button>
      </div>
    )
  }

  const mainStats: StatCard[] = [
    { label: 'Tổng tin tức', value: stats?.tongBaiViet || 0, icon: '📝', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Tổng dịch vụ', value: stats?.tongDichVu || 0, icon: '🛎️', color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Tổng hồ sơ', value: stats?.tongDonUng || 0, icon: '📋', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Tổng người dùng', value: stats?.tongNguoiDung || 0, icon: '👥', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ]

  const alertStats = [
    { label: 'Hồ sơ chờ xử lý', value: stats?.donUngChoXuLy || 0, color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { label: 'Hồ sơ quá hạn', value: stats?.donUngQuaHan || 0, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    { label: 'Hồ sơ sắp đến hạn', value: stats?.donUngSapDenHan || 0, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { label: 'Bình luận chờ duyệt', value: stats?.binhLuanChoDuyet || 0, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  ]

  const contentStats = [
    { label: 'Tin tức đã xuất bản', value: stats?.baiVietDaXuatBan || 0 },
    { label: 'Tin tức chờ duyệt', value: stats?.baiVietChoDuyet || 0 },
    { label: 'Tổng bình luận', value: stats?.tongBinhLuan || 0 },
    { label: 'Liên hệ chưa đọc', value: stats?.lienHeChuaDoc || 0 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink mb-2">Bảng điều khiển</h1>
        <p className="text-ink-muted">Tổng quan hệ thống quản lý Phường Xã</p>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {mainStats.map((stat) => (
          <div key={stat.label} className={`${stat.bgColor} border border-line rounded-lg p-6`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-ink-muted text-sm">{stat.label}</p>
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Alert Stats */}
      <div>
        <h2 className="text-xl font-semibold text-ink mb-4">⚠️ Cần chú ý</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {alertStats.map((stat) => (
            <div key={stat.label} className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-4`}>
              <p className="text-sm text-ink-muted mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Stats */}
      <div>
        <h2 className="text-xl font-semibold text-ink mb-4">📊 Nội dung</h2>
        <div className="bg-white border border-line rounded-lg p-6">
          <div className="grid md:grid-cols-4 gap-6">
            {contentStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-brand">{stat.value}</p>
                <p className="text-ink-muted text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <section className="bg-white border border-line rounded-lg p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ink">Xu hướng tin tức</h2>
            {articlesChartError && (
              <button
                onClick={loadArticlesChart}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Thu lai
              </button>
            )}
          </div>

          {loadingArticlesChart ? (
            <div className="h-72 animate-pulse rounded-lg bg-slate-100" />
          ) : articlesChartError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Không tải được dữ liệu biểu đồ tin tức: {articlesChartError}
            </div>
          ) : !articlesChartData ? (
            <div className="h-72 rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 flex items-center justify-center">
              Chưa có dữ liệu biểu đồ tin tức.
            </div>
          ) : (
            <div className="h-72">
              <Bar data={articlesChartData} options={barOptions} />
            </div>
          )}
        </section>

        <section className="bg-white border border-line rounded-lg p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ink">Trang thai ho so</h2>
            {statusChartError && (
              <button
                onClick={loadStatusChart}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Thu lai
              </button>
            )}
          </div>

          {loadingStatusChart ? (
            <div className="h-72 animate-pulse rounded-lg bg-slate-100" />
          ) : statusChartError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Khong tai duoc du lieu bieu do trang thai ho so: {statusChartError}
            </div>
          ) : !statusChartData ? (
            <div className="h-72 rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 flex items-center justify-center">
              Chua co du lieu bieu do trang thai ho so.
            </div>
          ) : (
            <div className="h-72">
              <Doughnut data={statusChartData} options={doughnutOptions} />
            </div>
          )}
        </section>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-ink mb-4">⚡ Thao tác nhanh</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Link href="/admin/articles" className="block p-4 bg-white border border-line rounded-lg hover:border-brand hover:shadow-md transition text-center">
            <span className="text-2xl">📝</span>
            <p className="mt-2 font-medium">Quản lý tin tức</p>
          </Link>
          <Link href="/admin/services" className="block p-4 bg-white border border-line rounded-lg hover:border-brand hover:shadow-md transition text-center">
            <span className="text-2xl">🛎️</span>
            <p className="mt-2 font-medium">Quản lý dịch vụ</p>
          </Link>
          <Link href="/admin/applications" className="block p-4 bg-white border border-line rounded-lg hover:border-brand hover:shadow-md transition text-center">
            <span className="text-2xl">📋</span>
            <p className="mt-2 font-medium">Quản lý hồ sơ</p>
          </Link>
          <Link href="/admin/users" className="block p-4 bg-white border border-line rounded-lg hover:border-brand hover:shadow-md transition text-center">
            <span className="text-2xl">👥</span>
            <p className="mt-2 font-medium">Quản lý người dùng</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
