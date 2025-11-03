import { useState, useEffect, useRef } from 'react'

interface UsePollingOptions {
  interval?: number
  enabled?: boolean
  onError?: (error: Error) => void
}

/**
 * Hook for polling data at intervals
 */
export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: UsePollingOptions = {}
) {
  const { interval = 5000, enabled = true, onError } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Polling error')
      setError(error)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled) {
      return
    }

    // Fetch immediately
    fetchData()

    // Set up polling
    intervalRef.current = setInterval(fetchData, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, interval])

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startPolling = () => {
    if (!intervalRef.current) {
      fetchData()
      intervalRef.current = setInterval(fetchData, interval)
    }
  }

  return {
    data,
    isLoading,
    error,
    stopPolling,
    startPolling,
    refetch: fetchData,
  }
}

