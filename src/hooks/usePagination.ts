import { useState } from 'react'

/**
 * Client-side pagination over an already-filtered array. `page` self-clamps
 * to the valid range, so a shrinking result set (a new filter, a delete)
 * never strands the view on an empty page — no reset effect required.
 */
export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return {
    page: currentPage,
    setPage,
    pageCount,
    pageItems,
    totalItems: items.length,
    rangeStart: items.length === 0 ? 0 : start + 1,
    rangeEnd: Math.min(start + pageSize, items.length),
  }
}
