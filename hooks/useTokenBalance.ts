import { useReadContract, useAccount } from 'wagmi'
import { Address } from 'viem'
import { formatUnits } from 'viem'

interface UseTokenBalanceOptions {
  tokenAddress: Address | string
  address?: Address | string
  enabled?: boolean
}

/**
 * Hook to get ERC20 token balance with formatted value
 */
export function useTokenBalance({
  tokenAddress,
  address,
  enabled = true,
}: UseTokenBalanceOptions) {
  const { address: connectedAddress } = useAccount()
  const targetAddress = (address || connectedAddress) as Address | undefined

  const { data: balance, ...rest } = useReadContract({
    address: tokenAddress as Address,
    abi: [
      {
        inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'balanceOf',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: enabled && !!targetAddress && !!tokenAddress,
    },
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
    query: {
      enabled: enabled && !!tokenAddress,
    },
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
    query: {
      enabled: enabled && !!tokenAddress,
    },
  })

  const formatted = balance && decimals
    ? formatUnits(balance, decimals)
    : '0'

  return {
    balance,
    formatted,
    decimals: decimals || 18,
    symbol: symbol || 'TOKEN',
    ...rest,
  }
}

