import { useContractRead } from './useContractRead'
import { Address } from 'viem'

interface UseAllowanceOptions {
  tokenAddress: Address | string
  ownerAddress: Address | string
  spenderAddress: Address | string
  enabled?: boolean
}

/**
 * Hook to check ERC20 token allowance
 */
export function useAllowance({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  enabled = true,
}: UseAllowanceOptions) {
  const { data: allowance, ...rest } = useContractRead({
    address: tokenAddress as Address,
    abi: [
      {
        inputs: [
          { internalType: 'address', name: '_owner', type: 'address' },
          { internalType: 'address', name: '_spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'allowance',
    args: [ownerAddress as Address, spenderAddress as Address],
    enabled: enabled && !!tokenAddress && !!ownerAddress && !!spenderAddress,
  })

  return {
    allowance: allowance || 0n,
    hasAllowance: allowance ? allowance > 0n : false,
    ...rest,
  }
}

