import { useReadContract } from 'wagmi'
import { Address } from 'viem'

interface UseTokenInfoOptions {
  tokenAddress: Address | string
  enabled?: boolean
}

/**
 * Hook to get ERC20 token information (name, symbol, decimals, totalSupply)
 */
export function useTokenInfo({ tokenAddress, enabled = true }: UseTokenInfoOptions) {
  const { data: name } = useReadContract({
    address: tokenAddress as Address,
    abi: [
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'name',
    query: { enabled: enabled && !!tokenAddress },
  })

  const { data: symbol } = useReadContract({
    address: tokenAddress as Address,
    abi: [
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'symbol',
    query: { enabled: enabled && !!tokenAddress },
  })

  const { data: decimals } = useReadContract({
    address: tokenAddress as Address,
    abi: [
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'decimals',
    query: { enabled: enabled && !!tokenAddress },
  })

  const { data: totalSupply } = useReadContract({
    address: tokenAddress as Address,
    abi: [
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'totalSupply',
    query: { enabled: enabled && !!tokenAddress },
  })

  return {
    name: name || '',
    symbol: symbol || '',
    decimals: decimals || 18,
    totalSupply,
    isLoading: !name || !symbol || !decimals,
  }
}

