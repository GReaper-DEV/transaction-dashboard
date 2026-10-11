import { Button } from '../../components/ui/Button'
import { Select, type Option } from '../../components/ui/Select'
import { TextInput } from '../../components/ui/TextInput'
import { hasActiveFilters, type Filters, type SortOption } from './filters'

const statusOptions: Option<Filters['status']>[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'declined', label: 'Declined' },
]

const typeOptions: Option<Filters['type']>[] = [
  { value: 'all', label: 'All types' },
  { value: 'credit', label: 'Credit (money in)' },
  { value: 'debit', label: 'Debit (money out)' },
]

const sortOptions: Option<SortOption>[] = [
  { value: 'date-desc', label: 'Date: newest first' },
  { value: 'date-asc', label: 'Date: oldest first' },
  { value: 'amount-desc', label: 'Amount: largest first' },
  { value: 'amount-asc', label: 'Amount: smallest first' },
]

interface TransactionFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
  onReset: () => void
}

export function TransactionFilters({ filters, onChange, onReset }: TransactionFiltersProps) {
  // Update one field and keep the rest.
  const update = (changes: Partial<Filters>) => onChange({ ...filters, ...changes })

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_10rem_11rem_12rem_auto] lg:items-end">
      <TextInput
        label="Merchant"
        placeholder="Search merchants"
        value={filters.merchant}
        onChange={(merchant) => update({ merchant })}
      />
      <Select label="Status" value={filters.status} options={statusOptions} onChange={(status) => update({ status })} />
      <Select label="Type" value={filters.type} options={typeOptions} onChange={(type) => update({ type })} />
      <Select label="Sort by" value={filters.sort} options={sortOptions} onChange={(sort) => update({ sort })} />
      <Button variant="secondary" onClick={onReset} disabled={!hasActiveFilters(filters)}>
        Clear filters
      </Button>
    </div>
  )
}
