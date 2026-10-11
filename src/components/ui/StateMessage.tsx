import type { ReactNode } from 'react'

interface StateMessageProps {
  title: string
  description?: string
  action?: ReactNode
  /** Use "alert" for errors so screen readers announce them. */
  role?: 'status' | 'alert'
}

/** Shared layout for empty, no-results and error states. */
export function StateMessage({ title, description, action, role = 'status' }: StateMessageProps) {
  return (
    <div role={role} className="px-6 py-12 text-center">
      <p className="font-semibold">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
