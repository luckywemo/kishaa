import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'

interface WalletConnectProps {
  onConnect?: () => void
  onDisconnect?: () => void
}

export default function WalletConnectComponent({ onConnect, onDisconnect }: WalletConnectProps) {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })

  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const handleConnect = async (connectorToUse: any) => {
    try {
      setIsConnecting(true)
      setConnectionError(null)
      await connect({ connector: connectorToUse })
      onConnect?.()
    } catch (error: any) {
      setConnectionError(error.message || 'Failed to connect wallet')
      console.error('Connection error:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    try {
      disconnect()
      onDisconnect?.()
      setConnectionError(null)
    } catch (error: any) {
      console.error('Disconnect error:', error)
    }
  }

  const getWalletIcon = (connectorName: string) => {
    switch (connectorName.toLowerCase()) {
      case 'metamask':
        return '🦊'
      case 'walletconnect':
        return '🔗'
      case 'injected':
        return '💼'
      default:
        return '🔌'
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="wallet-connected">
        <div className="wallet-info">
          <div className="wallet-header">
            <span className="wallet-icon">{getWalletIcon(connector?.name || '')}</span>
            <div className="wallet-details">
              <h3>{connector?.name || 'Wallet'}</h3>
              <p className="wallet-address">{formatAddress(address)}</p>
            </div>
            <div className="wallet-balance">
              <p className="balance-amount">
                {balance?.formatted ? `${parseFloat(balance.formatted).toFixed(4)}` : '0.0000'}
              </p>
              <p className="balance-symbol">{balance?.symbol || 'ETH'}</p>
            </div>
          </div>
          <button 
            onClick={handleDisconnect}
            className="disconnect-btn"
            disabled={isPending}
          >
            {isPending ? 'Disconnecting...' : 'Disconnect'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wallet-connect">
      <div className="connect-header">
        <h2>Connect Your Wallet</h2>
        <p>Choose a wallet to connect to the Kisha dApp</p>
      </div>

      {connectionError && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{connectionError}</p>
          <button 
            onClick={() => setConnectionError(null)}
            className="error-close"
          >
            ✕
          </button>
        </div>
      )}

      <div className="wallet-options">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => handleConnect(connector)}
            disabled={isConnecting || isPending}
            className={`wallet-option ${isConnecting ? 'connecting' : ''}`}
          >
            <div className="wallet-option-content">
              <span className="wallet-icon-large">
                {getWalletIcon(connector.name)}
              </span>
              <div className="wallet-info">
                <h4>{connector.name}</h4>
                <p>
                  {connector.name === 'MetaMask' && 'Connect using your MetaMask wallet'}
                  {connector.name === 'WalletConnect' && 'Connect using WalletConnect protocol'}
                  {connector.name === 'Injected' && 'Connect using your browser wallet'}
                </p>
              </div>
              {(isConnecting || isPending) && (
                <div className="loading-spinner"></div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="connection-help">
        <p>Don't have a wallet? <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Get MetaMask</a></p>
      </div>
    </div>
  )
}
