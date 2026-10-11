export type TransactionType = 'credit' | 'debit'
export type TransactionStatus = 'completed' | 'pending' | 'declined'

/**
 * Money is stored as an integer number of minor units (cents, pence, yen)
 * plus its ISO 4217 currency code. Never as a float like 45.23.
 */
export interface Money {
  minor: number
  currency: string
}

export interface Account {
  id: string
  name: string
  balance: Money
}

export interface Transaction {
  id: string
  merchant: string
  description?: string
  category?: string
  /** ISO 8601 timestamp */
  date: string
  /** Always positive. The direction comes from `type`. */
  amount: Money
  type: TransactionType
  status: TransactionStatus
  reference?: string
  paymentMethod?: string
  declineReason?: string
}
