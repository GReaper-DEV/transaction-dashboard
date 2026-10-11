import { describe, expect, it } from 'vitest'
import type { Transaction } from '../../types'
import { DEFAULT_FILTERS, filterAndSort } from './filters'

function tx(id: string, overrides: Partial<Transaction> = {}): Transaction {
  return {
    id,
    merchant: 'Shop',
    date: '2026-10-01T10:00:00Z',
    amount: { minor: 1000, currency: 'EUR' },
    type: 'debit',
    status: 'completed',
    ...overrides,
  }
}

const transactions = [
  tx('coffee', { merchant: 'Coffee Island', amount: { minor: 420, currency: 'EUR' }, date: '2026-10-03T08:00:00Z' }),
  tx('salary', { merchant: 'Acme Corp', type: 'credit', amount: { minor: 325000, currency: 'EUR' }, date: '2026-10-07T06:00:00Z' }),
  tx('amazon', { merchant: 'Amazon.com', status: 'pending', amount: { minor: 12999, currency: 'USD' }, date: '2026-10-08T19:00:00Z' }),
  tx('uniqlo', { merchant: 'Uniqlo', amount: { minor: 8990, currency: 'JPY' }, date: '2026-10-02T05:00:00Z' }),
]

const ids = (list: Transaction[]) => list.map((t) => t.id)

describe('filterAndSort', () => {
  it('returns all transactions, newest first, by default', () => {
    expect(ids(filterAndSort(transactions, DEFAULT_FILTERS))).toEqual(['amazon', 'salary', 'coffee', 'uniqlo'])
  })

  it('filters by merchant, ignoring case', () => {
    expect(ids(filterAndSort(transactions, { ...DEFAULT_FILTERS, merchant: 'AMAZ' }))).toEqual(['amazon'])
  })

  it('filters by status and type', () => {
    expect(ids(filterAndSort(transactions, { ...DEFAULT_FILTERS, status: 'pending' }))).toEqual(['amazon'])
    expect(ids(filterAndSort(transactions, { ...DEFAULT_FILTERS, type: 'credit' }))).toEqual(['salary'])
  })

  it('sorts by amount', () => {
    const eurOnly = transactions.filter((t) => t.amount.currency === 'EUR')
    expect(ids(filterAndSort(eurOnly, { ...DEFAULT_FILTERS, sort: 'amount-desc' }))).toEqual(['salary', 'coffee'])
    expect(ids(filterAndSort(eurOnly, { ...DEFAULT_FILTERS, sort: 'amount-asc' }))).toEqual(['coffee', 'salary'])
  })

  it('does not change the original array', () => {
    const copy = [...transactions]
    filterAndSort(transactions, { ...DEFAULT_FILTERS, sort: 'amount-asc' })
    expect(transactions).toEqual(copy)
  })
})
