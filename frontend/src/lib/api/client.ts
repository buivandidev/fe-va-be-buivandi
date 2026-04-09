import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { env } from '@/lib/config/environment'
import { logger } from '@/lib/utils/logger'
import { tokenStorage } from '@/lib/auth/token'

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

// Add request interceptor to include auth token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = tokenStorage.get()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        logger.log('[API Client] Request with token:', config.method?.toUpperCase(), config.url)
      } else {
        logger.warn('[API Client] No token found in localStorage for:', config.method?.toUpperCase(), config.url)
      }
    }
    return config
  },
  (error) => {
    logger.error('[API Client] Request error:', error)
    return Promise.reject(error)
  }
)

/**
 * Response wrapper/unwrapper for API responses
 * Handles the custom format: { thanhCong, thongDiep, duLieu }
 */
export function unwrapApi<T>(response: AxiosResponse<unknown>): T {
  const payload = response?.data as { 
    thanhCong?: boolean; 
    ThanhCong?: boolean; 
    thongDiep?: string; 
    ThongDiep?: string; 
    duLieu?: T; 
    DuLieu?: T;
  } | null | undefined;

  if (!payload) {
    throw new Error('Phản hồi API không hợp lệ')
  }

  // Check if response indicates failure
  const isSuccess = payload.thanhCong ?? payload.ThanhCong ?? false;
  if (!isSuccess) {
    throw new Error(payload.thongDiep ?? payload.ThongDiep ?? 'Yêu cầu thất bại')
  }

  // Return the data payload (supports both naming conventions)
  return (payload.duLieu ?? payload.DuLieu ?? payload) as T
}

/**
 * Error handling helper for API errors
 */
export function getApiErrorMessage(error: unknown): string {
  const err = error as { response?: { data?: { thongDiep?: string } }, message?: string };
  if (err.response?.data?.thongDiep) {
    return err.response.data.thongDiep
  }

  if (err.message) {
    return err.message
  }

  return 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
}

/**
 * Add response interceptor to handle 401 errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    logger.log('[API Client] Response:', response.status, response.config.method?.toUpperCase(), response.config.url)
    return response
  },
  (error) => {
    const status = error?.response?.status
    logger.error('[API Client] Response error:', status, error.config?.method?.toUpperCase(), error.config?.url, error.message)

    if (status === 401) {
      // Clear auth and redirect to login
      if (typeof window !== 'undefined') {
        logger.warn('[API Client] 401 Unauthorized - clearing auth')
        tokenStorage.clear()
        window.dispatchEvent(new Event('auth:unauthorized'))
      }
    }

    return Promise.reject(error)
  }
)
