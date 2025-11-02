import { formatAddress, getExplorerAddressUrl } from '../utils/formatting'
import CopyButton from './CopyButton'

interface AddressDisplayProps {
  address: string
  chainId?: number
  showCopy?: boolean
  showExplorer?: boolean
  chars?: number
  className?: string
}

export default function AddressDisplay({
  address,
  chainId,
  showCopy = true,
  showExplorer = true,
  chars = 4,
  className = '',
}: AddressDisplayProps) {
  if (!address) return null

  return (
    <div className={`address-display ${className}`}>
      <span className="address-text">{formatAddress(address, chars)}</span>
      {showCopy && <CopyButton text={address} />}
      {showExplorer && (
        <a
          href={getExplorerAddressUrl(address, chainId)}
          target="_blank"
          rel="noopener noreferrer"
          className="explorer-link"
          title="View on block explorer"
        >
          🔗
        </a>
      )}
    </div>
  )
}

