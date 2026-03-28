import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { env } from '@/lib/config/environment'

/**
 * Client-side Axios instance (for Client Components)
 * Automatically includes credentials (cookies) with requests
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.publicApiBaseUrl,
  timeout: 15000,
  withCredentials: true, // Auto-send cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Response wrapper/unwrapper for API responses
 * Handles the custom format: { thanhCong, thongDiep, duLieu }
 */
export function unwrapApi<T>(response: AxiosResponse<any>): T {
  const payload = response?.data

  if (!payload) {
    throw new Error('Phản hồi API không hợp lệ')
  }

  // Check if response indicates failure
  if (typeof payload.thanhCong === 'boolean' && !payload.thanhCong) {
    throw new Error(payload.thongDiep ?? 'Yêu cầu thất bại')
  }

  // Return the data payload (supports both naming conventions)
  return (payload.duLieu ?? payload.DuLieu ?? payload) as T
}

/**
 * Error handling helper for API errors
 */
export function getApiErrorMessage(error: any): string {
  if (error.response?.data?.thongDiep) {
    return error.response.data.thongDiep
  }

  if (error.message) {
    return error.message
  }

  return 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
}

/**
 * Add response interceptor to handle 401 errors globally
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      // Clear auth and redirect to login
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:unauthorized'))
      }
    }

    return Promise.reject(error)
  }
)
