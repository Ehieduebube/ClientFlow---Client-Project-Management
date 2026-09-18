import { ChevronLeft, ChevronRight } from 'lucide-react'
import { pluralize } from '@/lib/utils'

interface PaginationProps {
  page: number
  pageCount: number
  totalItems: number
  rangeStart: number
  rangeEnd: number
  itemLabel: string
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  pageCount,
  totalItems,
  rangeStart,
  rangeEnd,
  itemLabel,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <div className="mt-3 flex items-center justify-between gap-4">
      <p className="text-sm text-ink-500">
        Showing <span className="font-medium text-ink-700">{rangeStart}–{rangeEnd}</span> of{' '}
        <span className="font-medium text-ink-700">{totalItems}</span> {pluralize(totalItems, itemLabel)}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-300 text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[5.5rem] text-center text-sm text-ink-600">
          Page {page} of {pageCount}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-300 text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
