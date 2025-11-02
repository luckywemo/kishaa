import { useBalance, useAccount } from 'wagmi'
import { formatEth } from '../utils/formatting'

interface BalanceDisplayProps {
  address?: `0x${string}`
  showLabel?: boolean
  tokenAddress?: `0x${string}`
  symbol?: string
  decimals?: number
}

export default function BalanceDisplay({
  address,
  showLabel = true,
  tokenAddress,
  symbol = 'ETH',
  decimals,
}: BalanceDisplayProps) {
  const { address: connectedAddress } = useAccount()
  const targetAddress = address || connectedAddress

  const { data: balance, isLoading } = useBalance({
    address: targetAddress,
    token: tokenAddress,
  })

  if (!targetAddress) {
    return <div className="balance-display">Not connected</div>
  }

  if (isLoading) {
    return <div className="balance-display">Loading...</div>
  }

  const formattedBalance = balance
    ? tokenAddress && decimals
      ? parseFloat((Number(balance.value) / 10 ** decimals).toFixed(4))
      : formatEth(balance.value)
    : '0.0000'

  return (
    <div className="balance-display">
      {showLabel && <span className="balance-label">Balance:</span>}
      <span className="balance-value">
        {formattedBalance} {balance?.symbol || symbol}
      </span>
    </div>
  )
}

