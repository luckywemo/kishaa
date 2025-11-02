import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { formatAddress } from '../utils/formatting'

const SUPPORTED_CHAINS = [hardhat, sepolia, mainnet]

export default function NetworkSwitcher() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  if (!isConnected) return null

  const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId)

  return (
    <div className="network-switcher">
      <div className="network-info">
        <span className="network-label">Network:</span>
        <span className="network-name">
          {currentChain?.name || `Chain ${chainId}`}
        </span>
      </div>
      
      <div className="network-options">
        {SUPPORTED_CHAINS.map((chain) => (
          <button
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            disabled={chainId === chain.id || isPending}
            className={`network-btn ${chainId === chain.id ? 'active' : ''}`}
          >
            {chainId === chain.id ? '✓' : ''} {chain.name}
          </button>
        ))}
      </div>
    </div>
  )
}

