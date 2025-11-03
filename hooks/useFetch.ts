import { useState, useEffect } from 'react'

interface UseFetchOptions {
  skip?: boolean
}

/**
 * Generic fetch hook with loading and error states
 */
export function useFetch<T>(
  url: string | null,
  options?: UseFetchOptions
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url || options?.skip) {
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const json = await response.json()
        setData(json)
      } catch (err: any) {
        setError(err.message || 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [url, options?.skip])

  return { data, isLoading, error, refetch: () => {} }
}

