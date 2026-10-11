import { toMajorUnits } from '../../lib/money'
import type { Money, Transaction, TransactionStatus, TransactionType } from '../../types'

export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

export interface Filters {
  merchant: string
  status: TransactionStatus | 'all'
  type: TransactionType | 'all'
  sort: SortOption
}

export const DEFAULT_FILTERS: Filters = {
  merchant: '',
  status: 'all',
  type: 'all',
  sort: 'date-desc',
}

/** Amount with direction applied: money in is positive, money out is negative. */
export function signedAmount(tx: Transaction): Money {
  return tx.type === 'debit' ? { ...tx.amount, minor: -tx.amount.minor } : tx.amount
}

function compare(a: Transaction, b: Transaction, sort: SortOption): number {
  switch (sort) {
    case 'date-desc':
      return Date.parse(b.date) - Date.parse(a.date)
    case 'date-asc':
      return Date.parse(a.date) - Date.parse(b.date)
    // Compares the amount values (45.23, not 4523 cents). Amounts in different currencies
    // can't be compared properly without exchange rates; see "Known limitations" in the README.
    case 'amount-desc':
      return toMajorUnits(b.amount) - toMajorUnits(a.amount)
    case 'amount-asc':
      return toMajorUnits(a.amount) - toMajorUnits(b.amount)
  }
}

/** Returns a new filtered and sorted array. The input is not modified. */
export function filterAndSort(transactions: Transaction[], filters: Filters): Transaction[] {
  const query = filters.merchant.trim().toLowerCase()

  return transactions
    .filter((tx) => filters.status === 'all' || tx.status === filters.status)
    .filter((tx) => filters.type === 'all' || tx.type === filters.type)
    .filter((tx) => tx.merchant.toLowerCase().includes(query))
    .sort((a, b) => compare(a, b, filters.sort))
}

export function hasActiveFilters(filters: Filters): boolean {
  return filters.merchant.trim() !== '' || filters.status !== 'all' || filters.type !== 'all'
}
