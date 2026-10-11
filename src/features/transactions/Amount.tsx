import { cn } from '../../lib/cn'
import { formatMoney } from '../../lib/money'
import type { Transaction } from '../../types'
import { signedAmount } from './filters'

interface AmountProps {
  transaction: Transaction
  className?: string
}

/**
 * Signed transaction amount: "+€35.50" in green for money in, "-€22.40" for money out.
 * Declined amounts are struck through because they never affected the balance.
 */
export function Amount({ transaction, className }: AmountProps) {
  const isDeclined = transaction.status === 'declined'

  return (
    <span
      className={cn(
        'font-semibold whitespace-nowrap tabular-nums',
        isDeclined ? 'text-slate-400 line-through' : transaction.type === 'credit' ? 'text-emerald-700' : 'text-slate-900',
        className,
      )}
    >
      {formatMoney(signedAmount(transaction), { showSign: true })}
      {isDeclined && <span className="sr-only"> (declined, not charged)</span>}
    </span>
  )
}
