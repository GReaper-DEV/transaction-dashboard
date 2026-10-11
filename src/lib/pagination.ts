export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]

export interface Page<T> {
  items: T[]
  /** The page actually shown (1-based), kept within 1..totalPages. */
  page: number
  totalPages: number
  totalItems: number
  /** 1-based index of the first and last item on this page, e.g. 11 and 20. 0 when empty. */
  from: number
  to: number
}

/**
 * Returns one page of `items`. If `page` is out of range (for example after a
 * filter made the list shorter), it is clamped to the nearest valid page.
 */
export function paginate<T>(items: T[], page: number, pageSize: number): Page<T> {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return {
    items: pageItems,
    page: current,
    totalPages,
    totalItems,
    from: totalItems === 0 ? 0 : start + 1,
    to: start + pageItems.length,
  }
}
