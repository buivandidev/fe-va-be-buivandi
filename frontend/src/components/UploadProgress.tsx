interface UploadProgressProps {
  progress: number
  fileName: string
  fileSize?: number
  onCancel?: () => void
}

export function UploadProgress({ 
  progress, 
  fileName, 
  fileSize,
  onCancel 
}: UploadProgressProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{fileName}</p>
          {fileSize && (
            <p className="text-xs text-slate-600 mt-1">{formatFileSize(fileSize)}</p>
          )}
        </div>
        {onCancel && progress < 100 && (
          <button
            onClick={onCancel}
            className="ml-2 text-slate-400 hover:text-slate-600 transition"
            aria-label="Hủy tải lên"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>

      {/* eslint-disable-next-line jsx-a11y/aria-proptypes */}
      <div
        className="relative w-full bg-slate-200 rounded-full h-2 overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Tiến trình tải lên: ${progress}%`}
      >
        <div
          className={`absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300 ease-out upload-progress-bar`}
          data-testid="progress-bar"
          aria-hidden="true"
          data-progress={progress}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs font-medium text-blue-700">{progress}%</p>
        {progress === 100 && (
          <span className="text-xs text-green-600 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Hoàn thành
          </span>
        )}
      </div>
    </div>
  )
}

// Multiple files upload progress
interface MultipleUploadProgressProps {
  files: Array<{
    name: string
    progress: number
    size?: number
    error?: string
  }>
  onCancelFile?: (index: number) => void
}

export function MultipleUploadProgress({ 
  files, 
  onCancelFile 
}: MultipleUploadProgressProps) {
  const totalProgress = files.reduce((sum, file) => sum + file.progress, 0) / files.length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-900">
          Đang tải lên {files.length} file
        </h4>
        <span className="text-sm font-medium text-blue-600">
          {Math.round(totalProgress)}%
        </span>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {files.map((file, index) => (
          <div key={index}>
            {file.error ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900 truncate">{file.name}</p>
                <p className="text-xs text-red-600 mt-1">{file.error}</p>
              </div>
            ) : (
              <UploadProgress
                progress={file.progress}
                fileName={file.name}
                fileSize={file.size}
                onCancel={onCancelFile ? () => onCancelFile(index) : undefined}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
