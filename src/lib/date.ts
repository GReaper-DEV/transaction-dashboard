const LOCALE = 'en-IE'

/** "8 Oct 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' })
}

/** "Thursday 8 October 2026 at 22:42" */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(LOCALE, { dateStyle: 'full', timeStyle: 'short' })
}