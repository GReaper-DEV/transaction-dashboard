import { PAGE_SIZE_OPTIONS, type PageSize } from '../../lib/pagination'
import { Button } from './Button'
import { Select } from './Select'

interface PaginationProps {
  page: number
  totalPages: number
  totalItems: number
  from: number
  to: number
  pageSize: PageSize
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: PageSize) => void
}

const pageSizeOptions = PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: `${size} per page` }))

export function Pagination({
  page,
  totalPages,
  totalItems,
  from,
  to,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5"
    >
      <div className="flex items-end gap-4">
        <div className="w-36">
          {/* <select> values are strings, so the page size is converted back to a number here. */}
          <Select
            label="Rows"
            value={String(pageSize)}
            options={pageSizeOptions}
            onChange={(value) => onPageSizeChange(Number(value) as PageSize)}
          />
        </div>
        <p className="pb-2.5 text-sm text-slate-600" aria-live="polite">
          {from}–{to} of {totalItems}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <Button variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <span className="text-sm whitespace-nowrap text-slate-600">
          Page {page} of {totalPages}
        </span>
        <Button variant="secondary" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </Button>
      </div>
    </nav>
  )
}
