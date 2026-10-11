import { useMemo, useRef, useState } from 'react'
import { fetchTransactions } from '../../api/mockApi'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { Pagination } from '../../components/ui/Pagination'
import { StateMessage } from '../../components/ui/StateMessage'
import { useFetch } from '../../hooks/useFetch'
import { paginate, type PageSize } from '../../lib/pagination'
import type { Transaction } from '../../types'
import { DEFAULT_FILTERS, filterAndSort, type Filters } from './filters'
import { TransactionDetails } from './TransactionDetails'
import { TransactionFilters } from './TransactionFilters'
import { TransactionList } from './TransactionList'

/**
 * Owns the transactions data, the filters, pagination and the selected transaction,
 * and decides which state to show. The components it renders only receive props.
 */
export function TransactionsSection() {
  const { data: transactions, error, loading, retry } = useFetch(fetchTransactions)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<PageSize>(10)
  const sectionRef = useRef<HTMLElement>(null)

  // Derived from data + filters on every change, so it can never get out of sync.
  const visible = useMemo(() => filterAndSort(transactions ?? [], filters), [transactions, filters])
  const currentPage = paginate(visible, page, pageSize)

  // Any change to what is in the list sends the user back to page 1,
  // otherwise they could be left on page 4 of a list that now has 1 page.
  const changeFilters = (next: Filters) => {
    setFilters(next)
    setPage(1)
  }

  const resetFilters = () => changeFilters({ ...DEFAULT_FILTERS, sort: filters.sort })

  const changePageSize = (size: PageSize) => {
    setPageSize(size)
    setPage(1)
  }

  const changePage = (next: number) => {
    setPage(next)
    // If the user scrolled down to the pagination controls, bring the top of the list back into view.
    const top = sectionRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function renderContent() {
    if (loading) return <StateMessage title="Loading transactions…" />

    if (error) {
      return (
        <StateMessage
          role="alert"
          title="We couldn't load your transactions"
          description="Please try again."
          action={<Button onClick={retry}>Try again</Button>}
        />
      )
    }

    if (!transactions || transactions.length === 0) {
      return <StateMessage title="No transactions yet" description="Your payments will appear here." />
    }

    if (visible.length === 0) {
      return (
        <StateMessage
          title="No matching transactions"
          description="Try changing or clearing your filters."
          action={
            <Button variant="secondary" onClick={resetFilters}>
              Clear filters
            </Button>
          }
        />
      )
    }

    return (
      <>
        <TransactionList transactions={currentPage.items} onSelect={setSelected} />
        <Pagination
          page={currentPage.page}
          totalPages={currentPage.totalPages}
          totalItems={currentPage.totalItems}
          from={currentPage.from}
          to={currentPage.to}
          pageSize={pageSize}
          onPageChange={changePage}
          onPageSizeChange={changePageSize}
        />
      </>
    )
  }

  const hasTransactions = !loading && !error && transactions && transactions.length > 0

  return (
    <Card ref={sectionRef} aria-labelledby="transactions-title" className="scroll-mt-4">
      <div className="space-y-4 p-4 sm:p-5">
        <h2 id="transactions-title" className="text-lg font-semibold">
          Recent transactions
        </h2>
        {hasTransactions && <TransactionFilters filters={filters} onChange={changeFilters} onReset={resetFilters} />}
      </div>

      {renderContent()}

      {selected && (
        <Modal title="Transaction details" onClose={() => setSelected(null)}>
          <TransactionDetails transaction={selected} />
        </Modal>
      )}
    </Card>
  )
}
