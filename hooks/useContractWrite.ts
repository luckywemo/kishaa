import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Address } from 'viem'
import { useTransactionToast } from './useTransactionToast'
import toast from 'react-hot-toast'

interface UseContractWriteOptions {
  address: Address | string | undefined
  abi: any[]
  functionName: string
  args?: any[]
  value?: bigint
  onSuccess?: () => void
  onError?: (error: any) => void
  showToast?: boolean
  description?: string
  chainId?: number
}

/**
 * Enhanced contract write hook with automatic toast notifications
 */
export function useContractWrite({
  address,
  abi,
  functionName,
  args,
  value,
  onSuccess,
  onError,
  showToast = true,
  description,
  chainId,
}: UseContractWriteOptions) {
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract()

  // Show transaction toast if enabled
  useTransactionToast({
    hash,
    description: description || `${functionName} transaction`,
    chainId,
  })

  const write = async () => {
    if (!address) {
      toast.error('Contract address not set')
      return
    }

    try {
      await writeContract({
        address: address as Address,
        abi,
        functionName,
        args,
        value,
      })
    } catch (error: any) {
      if (onError) {
        onError(error)
      }
      
      // Don't show toast if custom error handler is provided
      if (showToast && !onError) {
        toast.error(parseError(error))
      }
      
      throw error
    }
  }

  const { isLoading: isConfirming, isSuccess, isError, error: receiptError } = useWaitForTransactionReceipt({
    hash,
  })

  // Call success callback when transaction is confirmed
  if (isSuccess && onSuccess && hash) {
    setTimeout(() => onSuccess(), 100)
  }

  // Call error callback if transaction fails
  if (isError && onError && receiptError) {
    setTimeout(() => onError(receiptError), 100)
  }

  return {
    write,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError: isError || !!writeError,
    error: receiptError || writeError,
    reset,
  }
}

function parseError(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) {
    if (error.message.includes('user rejected')) return 'Transaction was rejected'
    if (error.message.includes('insufficient funds')) return 'Insufficient funds for transaction'
    return error.message
  }
  return 'An unknown error occurred'
}

