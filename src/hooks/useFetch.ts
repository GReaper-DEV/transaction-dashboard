import { useCallback, useEffect, useState } from 'react'

/**
 * Loads data once on mount and exposes loading / error / data, plus a
 * `retry` function for error states. `fetcher` must be a stable function
 * (e.g. imported from the API module), otherwise it would refetch on every render.
 */
export function useFetch<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Ignore the response if the component unmounted or a newer request started.
    let ignore = false

    fetcher()
      .then((result) => {
        if (!ignore) setData(result)
      })
      .catch((err: unknown) => {
        if (!ignore) setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [fetcher, attempt])

  const retry = useCallback(() => {
    setError(null)
    setLoading(true)
    setAttempt((n) => n + 1)
  }, [])

  return { data, error, loading, retry }
}
