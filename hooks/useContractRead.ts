import { useReadContract } from 'wagmi'
import { Address } from 'viem'

interface UseContractReadOptions {
  address: Address | string | undefined
  abi: any[]
  functionName: string
  args?: any[]
  enabled?: boolean
}

/**
 * Enhanced contract read hook with better error handling
 */
export function useContractRead({
  address,
  abi,
  functionName,
  args,
  enabled = true,
}: UseContractReadOptions) {
  const result = useReadContract({
    address: address as Address | undefined,
    abi,
    functionName,
    args,
    query: {
      enabled: enabled && !!address,
    },
  })

  return {
    ...result,
    isReady: enabled && !!address,
  }
}

