interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange: (page: number) => void
  showInfo?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true
}: PaginationProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {showInfo && totalItems && itemsPerPage && (
        <p className="text-sm text-slate-600">
          Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Trang trước"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-2 rounded-lg transition ${
                currentPage === page
                  ? 'bg-primary text-white font-medium'
                  : 'border border-slate-300 hover:bg-slate-50'
              }`}
              aria-label={`Trang ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Trang sau"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  )
}
