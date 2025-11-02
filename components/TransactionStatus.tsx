import { useWaitForTransactionReceipt } from 'wagmi'
import { getExplorerUrl } from '../utils/formatting'
import LoadingSpinner from './LoadingSpinner'

interface TransactionStatusProps {
  hash: `0x${string}` | undefined
  description?: string
  chainId?: number
  onSuccess?: () => void
  onError?: (error: any) => void
}

export default function TransactionStatus({
  hash,
  description = 'Transaction',
  chainId,
  onSuccess,
  onError,
}: TransactionStatusProps) {
  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({
    hash,
  })

  // Call callbacks
  if (isSuccess && onSuccess) {
    setTimeout(() => onSuccess(), 100)
  }
  if (isError && onError) {
    setTimeout(() => onError(error), 100)
  }

  if (!hash) return null

  return (
    <div className="transaction-status-container">
      {isLoading && (
        <div className="tx-status pending">
          <LoadingSpinner size="small" />
          <span>{description} pending...</span>
          <a
            href={getExplorerUrl(hash, chainId)}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View on Explorer →
          </a>
        </div>
      )}
      {isSuccess && (
        <div className="tx-status success">
          <span>✅ {description} confirmed!</span>
          <a
            href={getExplorerUrl(hash, chainId)}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View on Explorer →
          </a>
        </div>
      )}
      {isError && (
        <div className="tx-status error">
          <span>❌ {description} failed</span>
          <small>{error?.message || 'Unknown error'}</small>
        </div>
      )}
    </div>
  )
}

