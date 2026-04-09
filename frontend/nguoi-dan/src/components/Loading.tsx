interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export function Loading({ 
  message = 'Đang tải...', 
  size = 'md',
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}></div>
      {message && (
        <p className="text-slate-600 text-sm font-medium">{message}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  )
}

// Skeleton loading component
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>
  )
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}
