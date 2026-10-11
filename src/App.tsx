import { AccountSummary } from './features/account/AccountSummary'
import { TransactionsSection } from './features/transactions/TransactionsSection'

export default function App() {
  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-6 sm:space-y-6 sm:px-6 sm:py-10">
      <AccountSummary />
      <TransactionsSection />
    </main>
  )
}
