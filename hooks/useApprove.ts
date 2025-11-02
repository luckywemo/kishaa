import { useContractWrite } from './useContractWrite'
import { useContractRead } from './useContractRead'
import { parseEther } from 'viem'
import { Address } from 'viem'
import toast from 'react-hot-toast'

interface UseApproveOptions {
  tokenAddress: Address | string
  spenderAddress: Address | string
  amount: string
  enabled?: boolean
  onSuccess?: () => void
}

/**
 * Hook for ERC20 token approval with automatic checking
 */
export function useApprove({
  tokenAddress,
  spenderAddress,
  amount,
  enabled = true,
  onSuccess,
}: UseApproveOptions) {
  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useContractRead({
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
    enabled,
  })

  // Write approval
  const {
    write: approve,
    isPending,
    isSuccess,
    hash,
  } = useContractWrite({
    address: tokenAddress as Address,
    abi: [
      {
        inputs: [
          { internalType: 'address', name: '_spender', type: 'address' },
          { internalType: 'uint256', name: '_value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'approve',
    args: [spenderAddress as Address, parseEther(amount)],
    description: 'Approve token spending',
    onSuccess: () => {
      refetchAllowance()
      if (onSuccess) onSuccess()
      toast.success('Token approval successful!')
    },
  })

  const amountBigInt = parseEther(amount)
  const needsApproval = !allowance || allowance < amountBigInt
  const isApproved = allowance && allowance >= amountBigInt

  return {
    approve,
    allowance,
    needsApproval,
    isApproved,
    isPending,
    isSuccess,
    hash,
    refetchAllowance,
  }
}

