import type { ReactNode } from 'react'
import { formatDateTime } from '../../lib/date'
import type { Transaction } from '../../types'
import { Amount } from './Amount'
import { StatusBadge } from './StatusBadge'

export function TransactionDetails({ transaction: tx }: { transaction: Transaction }) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-lg font-semibold break-words">{tx.merchant}</p>
        <Amount transaction={tx} className="mt-2 block text-3xl" />
        <div className="mt-2">
          <StatusBadge status={tx.status} />
        </div>
      </div>

      {tx.status === 'pending' && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          This payment hasn't settled yet. The final amount may still change.
        </p>
      )}
      {tx.status === 'declined' && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-900">
          This payment was declined and you were not charged.
          {tx.declineReason && ` Reason: ${tx.declineReason}`}
        </p>
      )}

      <dl className="divide-y divide-slate-100 text-sm">
        <Row label="Date">{formatDateTime(tx.date)}</Row>
        <Row label="Type">{tx.type === 'credit' ? 'Credit (money in)' : 'Debit (money out)'}</Row>
        <Row label="Currency">{tx.amount.currency}</Row>
        {tx.description && <Row label="Description">{tx.description}</Row>}
        {tx.category && <Row label="Category">{tx.category}</Row>}
        {tx.paymentMethod && <Row label="Payment method">{tx.paymentMethod}</Row>}
        {tx.reference && <Row label="Reference">{tx.reference}</Row>}
        <Row label="Transaction ID">{tx.id}</Row>
      </dl>
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="text-right break-words">{children}</dd>
    </div>
  )
}
