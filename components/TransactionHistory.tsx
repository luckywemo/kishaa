import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

interface Transaction {
  hash: string
  type: 'transfer' | 'deposit' | 'withdraw' | 'approve' | 'burn'
  amount?: string
  to?: string
  from?: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
  gasUsed?: string
}

export default function TransactionHistory() {
  const { address } = useAccount()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock transaction data - in a real app, you'd fetch from a blockchain explorer API
  useEffect(() => {
    if (address) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const mockTransactions: Transaction[] = [
          {
            hash: '0x1234567890abcdef1234567890abcdef12345678',
            type: 'transfer',
            amount: '100.0',
            to: '0xabcdef1234567890abcdef1234567890abcdef12',
            from: address,
            timestamp: Date.now() - 300000, // 5 minutes ago
            status: 'confirmed',
            gasUsed: '21000'
          },
          {
            hash: '0xabcdef1234567890abcdef1234567890abcdef12',
            type: 'deposit',
            amount: '1.5',
            timestamp: Date.now() - 600000, // 10 minutes ago
            status: 'confirmed',
            gasUsed: '45000'
          },
          {
            hash: '0x9876543210fedcba9876543210fedcba98765432',
            type: 'approve',
            amount: '500.0',
            to: '0x1234567890abcdef1234567890abcdef12345678',
            from: address,
            timestamp: Date.now() - 900000, // 15 minutes ago
            status: 'confirmed',
            gasUsed: '46000'
          },
          {
            hash: '0xfedcba0987654321fedcba0987654321fedcba09',
            type: 'burn',
            amount: '50.0',
            from: address,
            timestamp: Date.now() - 1200000, // 20 minutes ago
            status: 'confirmed',
            gasUsed: '38000'
          }
        ]
        setTransactions(mockTransactions)
        setIsLoading(false)
      }, 1000)
    }
  }, [address])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'transfer': return '📤'
      case 'deposit': return '💰'
      case 'withdraw': return '💸'
      case 'approve': return '✅'
      case 'burn': return '🔥'
      default: return '📋'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'error'
      default: return 'info'
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!address) {
    return (
      <div className="transaction-history">
        <div className="history-header">
          <h3>📊 Transaction History</h3>
        </div>
        <div className="no-connection">
          <p>Connect your wallet to view transaction history</p>
        </div>
      </div>
    )
  }

  return (
    <div className="transaction-history">
      <div className="history-header">
        <h3>📊 Transaction History</h3>
        <div className="history-stats">
          <span className="stat">
            Total: {transactions.length}
          </span>
          <span className="stat">
            Confirmed: {transactions.filter(tx => tx.status === 'confirmed').length}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map((tx, index) => (
            <div key={index} className="transaction-item">
              <div className="transaction-main">
                <div className="transaction-icon">
                  {getTransactionIcon(tx.type)}
                </div>
                <div className="transaction-details">
                  <div className="transaction-type">
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    {tx.amount && (
                      <span className="transaction-amount">
                        {tx.amount} {tx.type === 'deposit' || tx.type === 'withdraw' ? 'ETH' : 'KISH'}
                      </span>
                    )}
                  </div>
                  <div className="transaction-meta">
                    {tx.to && tx.type === 'transfer' && (
                      <span className="transaction-to">
                        To: {formatAddress(tx.to)}
                      </span>
                    )}
                    {tx.to && tx.type === 'approve' && (
                      <span className="transaction-to">
                        Spender: {formatAddress(tx.to)}
                      </span>
                    )}
                    <span className="transaction-time">
                      {formatTimestamp(tx.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="transaction-status">
                  <span className={`status-badge ${getStatusColor(tx.status)}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
              <div className="transaction-footer">
                <div className="transaction-hash">
                  <span>Hash:</span>
                  <a 
                    href={`https://etherscan.io/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hash-link"
                  >
                    {formatAddress(tx.hash)}
                  </a>
                </div>
                {tx.gasUsed && (
                  <div className="gas-used">
                    Gas: {parseInt(tx.gasUsed).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="history-footer">
        <button className="refresh-button">
          🔄 Refresh
        </button>
        <a 
          href={`https://etherscan.io/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="view-all-link"
        >
          View All on Etherscan →
        </a>
      </div>
    </div>
  )
}
