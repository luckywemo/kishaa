import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'

// KishaToken ABI
const KISHA_TOKEN_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "_to", "type": "address"}, {"internalType": "uint256", "name": "_value", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "success", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_owner", "type": "address"}, {"internalType": "address", "name": "_spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_spender", "type": "address"}, {"internalType": "uint256", "name": "_value", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "success", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_account", "type": "address"}],
    "name": "getBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_value", "type": "uint256"}],
    "name": "burn",
    "outputs": [{"internalType": "bool", "name": "success", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

interface TokenManagerProps {
  tokenAddress: string
  userAddress: string
}

export default function TokenManager({ tokenAddress, userAddress }: TokenManagerProps) {
  const [transferTo, setTransferTo] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [approveSpender, setApproveSpender] = useState('')
  const [approveAmount, setApproveAmount] = useState('')
  const [burnAmount, setBurnAmount] = useState('')
  const [activeTab, setActiveTab] = useState('transfer')

  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Read user's token balance
  const { data: tokenBalance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: KISHA_TOKEN_ABI,
    functionName: 'getBalance',
    args: [userAddress as `0x${string}`],
  })

  const handleTransfer = async () => {
    if (!transferTo || !transferAmount) return
    
    try {
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: KISHA_TOKEN_ABI,
        functionName: 'transfer',
        args: [transferTo as `0x${string}`, parseEther(transferAmount)],
      })
      setTransferTo('')
      setTransferAmount('')
    } catch (error) {
      console.error('Transfer error:', error)
    }
  }

  const handleApprove = async () => {
    if (!approveSpender || !approveAmount) return
    
    try {
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: KISHA_TOKEN_ABI,
        functionName: 'approve',
        args: [approveSpender as `0x${string}`, parseEther(approveAmount)],
      })
      setApproveSpender('')
      setApproveAmount('')
    } catch (error) {
      console.error('Approve error:', error)
    }
  }

  const handleBurn = async () => {
    if (!burnAmount) return
    
    try {
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: KISHA_TOKEN_ABI,
        functionName: 'burn',
        args: [parseEther(burnAmount)],
      })
      setBurnAmount('')
    } catch (error) {
      console.error('Burn error:', error)
    }
  }

  const formatTokenBalance = (balance: bigint | undefined) => {
    if (!balance) return '0.0000'
    return parseFloat(formatEther(balance)).toFixed(4)
  }

  return (
    <div className="token-manager">
      <div className="token-header">
        <h3>🪙 Kisha Token Manager</h3>
        <div className="token-balance">
          <span className="balance-label">Your Balance:</span>
          <span className="balance-value">
            {formatTokenBalance(tokenBalance)} KISH
          </span>
        </div>
      </div>

      <div className="token-tabs">
        <button 
          className={`tab ${activeTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfer')}
        >
          Transfer
        </button>
        <button 
          className={`tab ${activeTab === 'approve' ? 'active' : ''}`}
          onClick={() => setActiveTab('approve')}
        >
          Approve
        </button>
        <button 
          className={`tab ${activeTab === 'burn' ? 'active' : ''}`}
          onClick={() => setActiveTab('burn')}
        >
          Burn
        </button>
      </div>

      <div className="token-content">
        {activeTab === 'transfer' && (
          <div className="token-form">
            <h4>Transfer Tokens</h4>
            <div className="form-group">
              <label>Recipient Address:</label>
              <input
                type="text"
                placeholder="0x..."
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="token-input"
              />
            </div>
            <div className="form-group">
              <label>Amount (KISH):</label>
              <input
                type="number"
                step="0.001"
                placeholder="0.0"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="token-input"
              />
            </div>
            <button 
              onClick={handleTransfer}
              disabled={isPending || !transferTo || !transferAmount}
              className="token-button"
            >
              {isPending ? 'Transferring...' : 'Transfer Tokens'}
            </button>
          </div>
        )}

        {activeTab === 'approve' && (
          <div className="token-form">
            <h4>Approve Spending</h4>
            <div className="form-group">
              <label>Spender Address:</label>
              <input
                type="text"
                placeholder="0x..."
                value={approveSpender}
                onChange={(e) => setApproveSpender(e.target.value)}
                className="token-input"
              />
            </div>
            <div className="form-group">
              <label>Amount (KISH):</label>
              <input
                type="number"
                step="0.001"
                placeholder="0.0"
                value={approveAmount}
                onChange={(e) => setApproveAmount(e.target.value)}
                className="token-input"
              />
            </div>
            <button 
              onClick={handleApprove}
              disabled={isPending || !approveSpender || !approveAmount}
              className="token-button"
            >
              {isPending ? 'Approving...' : 'Approve Spending'}
            </button>
          </div>
        )}

        {activeTab === 'burn' && (
          <div className="token-form">
            <h4>Burn Tokens</h4>
            <div className="warning">
              <span className="warning-icon">⚠️</span>
              <p>Burning tokens permanently removes them from circulation. This action cannot be undone.</p>
            </div>
            <div className="form-group">
              <label>Amount to Burn (KISH):</label>
              <input
                type="number"
                step="0.001"
                placeholder="0.0"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                className="token-input"
              />
            </div>
            <button 
              onClick={handleBurn}
              disabled={isPending || !burnAmount}
              className="token-button burn-button"
            >
              {isPending ? 'Burning...' : 'Burn Tokens'}
            </button>
          </div>
        )}
      </div>

      {hash && (
        <div className="transaction-status">
          <div className={`status ${isConfirmed ? 'success' : 'pending'}`}>
            {isConfirmed ? '✅ Transaction Confirmed' : '⏳ Transaction Pending'}
          </div>
          <div className="transaction-hash">
            <span>Hash:</span>
            <a 
              href={`https://etherscan.io/tx/${hash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hash-link"
            >
              {hash.slice(0, 10)}...{hash.slice(-8)}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
