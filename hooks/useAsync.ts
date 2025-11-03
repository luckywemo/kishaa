import { useState, useCallback } from 'react'

interface UseAsyncOptions {
  immediate?: boolean
}

interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

/**
 * Hook for handling async operations
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({ data: null, isLoading: true, error: null })

    try {
      const data = await asyncFunction()
      setState({ data, isLoading: false, error: null })
      return { data, error: null }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, isLoading: false, error: err })
      return { data: null, error: err }
    }
  }, [asyncFunction])

  if (options.immediate) {
    execute()
  }

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, isLoading: false, error: null }),
  }
}

