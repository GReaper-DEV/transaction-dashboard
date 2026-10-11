import { fetchAccount } from '../../api/mockApi'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useFetch } from '../../hooks/useFetch'
import { formatMoney } from '../../lib/money'

export function AccountSummary() {
  
  const { data: account, error, loading, retry } = useFetch(fetchAccount)

  if (loading) {
    return (
      <Card className="p-5 sm:p-6" aria-busy="true">
        <p className="text-sm text-slate-500">Loading account…</p>
      </Card>
    )
  }

  if (error || !account) {
    return (
      <Card role="alert" className="flex items-center justify-between gap-4 p-5 sm:p-6">
        <p className="text-sm text-rose-800">We couldn't load your account.</p>
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-5 sm:p-6" aria-labelledby="account-name">
      <div className="flex items-start justify-between gap-4">
        <h1 id="account-name" className="font-semibold">
          {account.name}
        </h1>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
          {account.balance.currency}
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-500">Current balance</p>
      <p className={`text-3xl font-semibold tabular-nums sm:text-4xl ${account.balance.minor < 0 ? 'text-rose-700' : ''}`}>
        {formatMoney(account.balance)}
      </p>
    </Card>
  )
}
