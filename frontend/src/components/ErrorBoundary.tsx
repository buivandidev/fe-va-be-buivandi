'use client'

import { Component, ReactNode } from 'react'
import { logger } from '@/lib/utils/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    logger.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-red-600 text-3xl">error</span>
              <h2 className="text-xl font-bold text-red-900">Đã xảy ra lỗi</h2>
            </div>
            <p className="text-red-800 mb-4">
              {this.state.error?.message || 'Có lỗi không xác định xảy ra'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined })
                window.location.reload()
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
