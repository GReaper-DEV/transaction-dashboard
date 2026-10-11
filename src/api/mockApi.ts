import accountData from '../data/account.json'
import transactionsData from '../data/transactions.json'
import type { Account, Transaction } from '../types'

/**
 * Fake API backed by local JSON. It adds a delay so loading states are
 * visible. Replacing it with real `fetch` calls only changes this file.
 *
 * Add `?scenario=error`, `?scenario=empty` or `?scenario=slow` to the URL
 * to see the other states.
 */
function getScenario() {
  return new URLSearchParams(window.location.search).get('scenario')
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function latency() {
  return getScenario() === 'slow' ? 3000 : 600
}

export async function fetchAccount(): Promise<Account> {
  await delay(latency() / 2)
  return accountData as Account
}

export async function fetchTransactions(): Promise<Transaction[]> {
  await delay(latency())

  const scenario = getScenario()
  if (scenario === 'error') throw new Error('Failed to load transactions')
  if (scenario === 'empty') return []

  return transactionsData as Transaction[]
}
