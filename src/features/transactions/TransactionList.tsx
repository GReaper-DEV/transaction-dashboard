import { formatDate } from '../../lib/date'
import type { Transaction } from '../../types'
import { Amount } from './Amount'
import { StatusBadge } from './StatusBadge'

interface TransactionListProps {
  transactions: Transaction[]
  onSelect: (transaction: Transaction) => void
}

/**
 * A single responsive list: rows are stacked cards on mobile and line up as
 * columns on wider screens. Each row is a <button>, so it works with the keyboard.
 */
export function TransactionList({ transactions, onSelect }: TransactionListProps) {
  return (
    <>
      <ListHeader />
      <ul className="divide-y divide-slate-100">
        {transactions.map((tx) => (
          <li key={tx.id}>
            <TransactionRow transaction={tx} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </>
  )
}

const columns = 'md:grid md:grid-cols-[minmax(0,1fr)_7rem_5rem_6.5rem_8.5rem] md:items-center md:gap-4'

/** Column titles, shown on wider screens only. */
function ListHeader() {
  return (
    <div
      aria-hidden
      className={`hidden border-y border-slate-200 bg-slate-50 px-5 py-2 text-xs font-medium text-slate-500 uppercase ${columns}`}
    >
      <span>Merchant</span>
      <span>Date</span>
      <span>Type</span>
      <span>Status</span>
      <span className="text-right">Amount</span>
    </div>
  )
}

function TransactionRow({ transaction: tx, onSelect }: { transaction: Transaction; onSelect: (tx: Transaction) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(tx)}
      className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 hover:cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-600 sm:px-5 ${columns}`}
    >
      <span className="min-w-0">
        {/* Long names and descriptions are cut with "…"; the full text is in the details. */}
        <span className="block truncate text-sm font-medium" title={tx.merchant}>
          {tx.merchant}
        </span>
        {tx.description && (
          <span className="hidden truncate text-xs text-slate-500 md:block" title={tx.description}>
            {tx.description}
          </span>
        )}
        {/* On mobile the date and status share a second line. */}
        <span className="mt-1 flex items-center gap-2 text-xs text-slate-500 md:hidden">
          {formatDate(tx.date)}
          <StatusBadge status={tx.status} />
        </span>
      </span>

      <span className="hidden text-sm text-slate-600 md:block">{formatDate(tx.date)}</span>
      <span className="hidden text-sm text-slate-600 capitalize md:block">{tx.type}</span>
      <span className="hidden md:block">
        <StatusBadge status={tx.status} />
      </span>
      <Amount transaction={tx} className="shrink-0 text-right text-sm" />
    </button>
  )
}
