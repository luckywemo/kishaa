import { useAccount } from 'wagmi'
import MobileWalletConnect from './MobileWalletConnect'

interface ConnectWalletPromptProps {
  message?: string
  showConnectComponent?: boolean
}

export default function ConnectWalletPrompt({
  message = 'Please connect your wallet to continue',
  showConnectComponent = true,
}: ConnectWalletPromptProps) {
  const { isConnected } = useAccount()

  if (isConnected) return null

  return (
    <div className="connect-prompt">
      <div className="connect-prompt-content">
        <div className="connect-prompt-icon">🔗</div>
        <h3>Connect Your Wallet</h3>
        <p>{message}</p>
        {showConnectComponent && (
          <div className="connect-prompt-component">
            <MobileWalletConnect />
          </div>
        )}
      </div>
    </div>
  )
}

