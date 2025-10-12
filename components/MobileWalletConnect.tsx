import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

interface MobileWalletConnectProps {
  onConnect?: () => void
  onDisconnect?: () => void
}

export default function MobileWalletConnect({ onConnect, onDisconnect }: MobileWalletConnectProps) {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  
  const [isMobile, setIsMobile] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      setIsMobile(isMobileDevice)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleConnect = async (connectorToUse: any) => {
    try {
      setConnectionError(null)
      
      // For mobile devices, prioritize WalletConnect for better UX
      if (isMobile && connectorToUse.name === 'WalletConnect') {
        setShowQRCode(true)
      }
      
      await connect({ connector: connectorToUse })
      setShowQRCode(false)
      onConnect?.()
    } catch (error: any) {
      setConnectionError(error.message || 'Failed to connect wallet')
      setShowQRCode(false)
      console.error('Connection error:', error)
    }
  }

  const handleDisconnect = () => {
    try {
      disconnect()
      setShowQRCode(false)
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

  const getMobileRecommendations = () => {
    if (!isMobile) return null
    
    return (
      <div className="mobile-recommendations">
        <h4>📱 Mobile Recommendations</h4>
        <div className="recommendation-cards">
          <div className="recommendation-card">
            <div className="recommendation-icon">🔗</div>
            <div className="recommendation-content">
              <h5>WalletConnect</h5>
              <p>Best for mobile - works with 300+ wallets</p>
            </div>
          </div>
          <div className="recommendation-card">
            <div className="recommendation-icon">🦊</div>
            <div className="recommendation-content">
              <h5>MetaMask Mobile</h5>
              <p>If you have MetaMask app installed</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <div className="mobile-wallet-connected">
        <div className="mobile-wallet-header">
          <div className="wallet-info-mobile">
            <span className="wallet-icon-mobile">{getWalletIcon(connector?.name || '')}</span>
            <div className="wallet-details-mobile">
              <h3>{connector?.name || 'Wallet'}</h3>
              <p className="wallet-address-mobile">{formatAddress(address)}</p>
            </div>
          </div>
          <button 
            onClick={handleDisconnect}
            className="disconnect-btn-mobile"
            disabled={isPending}
          >
            {isPending ? '...' : '✕'}
          </button>
        </div>
        
        {isMobile && (
          <div className="mobile-actions">
            <button className="action-btn-mobile">
              📊 View Portfolio
            </button>
            <button className="action-btn-mobile">
              ⚙️ Settings
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mobile-wallet-connect">
      <div className="mobile-connect-header">
        <h2>Connect Wallet</h2>
        <p>{isMobile ? 'Choose your preferred wallet' : 'Connect to get started'}</p>
      </div>

      {connectionError && (
        <div className="mobile-error-message">
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

      {showQRCode && (
        <div className="qr-modal">
          <div className="qr-content">
            <h3>Scan QR Code</h3>
            <div className="qr-placeholder">
              <div className="qr-code">📱</div>
              <p>Scan with your wallet app</p>
            </div>
            <button 
              onClick={() => setShowQRCode(false)}
              className="close-qr"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {getMobileRecommendations()}

      <div className="mobile-wallet-options">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => handleConnect(connector)}
            disabled={isPending}
            className={`mobile-wallet-option ${isMobile && connector.name === 'WalletConnect' ? 'recommended' : ''}`}
          >
            <div className="mobile-wallet-content">
              <span className="wallet-icon-large-mobile">
                {getWalletIcon(connector.name)}
              </span>
              <div className="wallet-info-mobile-option">
                <h4>{connector.name}</h4>
                <p>
                  {connector.name === 'MetaMask' && 'Connect using MetaMask'}
                  {connector.name === 'WalletConnect' && 'Connect using WalletConnect'}
                  {connector.name === 'Injected' && 'Connect using browser wallet'}
                </p>
                {isMobile && connector.name === 'WalletConnect' && (
                  <span className="recommended-badge">Recommended</span>
                )}
              </div>
              {(isPending) && (
                <div className="loading-spinner-mobile"></div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mobile-connection-help">
        <details>
          <summary>Need Help?</summary>
          <div className="help-content">
            <h4>Popular Mobile Wallets:</h4>
            <ul>
              <li><strong>MetaMask:</strong> Download from App Store/Google Play</li>
              <li><strong>Trust Wallet:</strong> Multi-chain wallet with DApp browser</li>
              <li><strong>Coinbase Wallet:</strong> Easy-to-use with social recovery</li>
              <li><strong>Rainbow:</strong> Beautiful interface with NFT support</li>
            </ul>
            <h4>Desktop Wallets:</h4>
            <ul>
              <li><strong>MetaMask:</strong> Browser extension</li>
              <li><strong>WalletConnect:</strong> Works with any WalletConnect-compatible wallet</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  )
}
