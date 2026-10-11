import { Badge, type BadgeTone } from '../../components/ui/Badge'
import type { TransactionStatus } from '../../types'

const config: Record<TransactionStatus, { label: string; tone: BadgeTone }> = {
  completed: { label: 'Completed', tone: 'success' },
  pending: { label: 'Pending', tone: 'warning' },
  declined: { label: 'Declined', tone: 'danger' },
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const { label, tone } = config[status]
  return <Badge tone={tone}>{label}</Badge>
}
