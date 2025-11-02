import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useWaitForTransactionReceipt } from 'wagmi'
import { parseError, getExplorerUrl } from '../utils/formatting'

interface UseTransactionToastProps {
  hash: `0x${string}` | undefined
  description?: string
  chainId?: number
}

export function useTransactionToast({ hash, description, chainId }: UseTransactionToastProps) {
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (!hash) return

    if (isLoading) {
      toast.loading(
        <div>
          <div>{description || 'Transaction pending...'}</div>
          <a
            href={getExplorerUrl(hash, chainId)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: '12px', color: '#4A90E2' }}
          >
            View on Explorer →
          </a>
        </div>,
        { id: hash }
      )
    }

    if (isSuccess) {
      toast.success(
        <div>
          <div>{description || 'Transaction confirmed!'}</div>
          <a
            href={getExplorerUrl(hash, chainId)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: '12px', color: '#4A90E2' }}
          >
            View on Explorer →
          </a>
        </div>,
        { id: hash, duration: 5000 }
      )
    }

    if (isError) {
      toast.error(parseError(error) || 'Transaction failed', {
        id: hash,
        duration: 6000,
      })
    }
  }, [hash, isLoading, isSuccess, isError, error, description, chainId])

  return { isLoading, isSuccess, isError }
}

