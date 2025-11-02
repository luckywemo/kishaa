import { useChainId } from 'wagmi'
import { getChainName, isSupportedChain } from '../utils/network'

export default function ChainIndicator() {
  const chainId = useChainId()
  const chainName = getChainName(chainId)
  const supported = isSupportedChain(chainId)

  if (!supported) {
    return (
      <div className="chain-indicator unsupported">
        <span className="chain-status">⚠️</span>
        <span>Unsupported Network</span>
      </div>
    )
  }

  return (
    <div className="chain-indicator">
      <span className="chain-dot"></span>
      <span className="chain-name">{chainName}</span>
    </div>
  )
}

