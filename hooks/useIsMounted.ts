import { useEffect, useState } from 'react'

/**
 * Hook to check if component is mounted (prevents hydration errors)
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}

