import { useState } from 'react'
import { useAccount, useBalance, useWriteContract, useReadContract } from 'wagmi'
import { parseEther } from 'viem'
import WalletConnectComponent from '../components/WalletConnect'
import TokenManager from '../components/TokenManager'
import TransactionHistory from '../components/TransactionHistory'

// Contract ABI - you'll need to update this with your deployed contract address
const SIMPLE_STORAGE_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "_data", "type": "uint256"}],
    "name": "store",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "retrieve",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Update this with your deployed contract address
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' // Default Hardhat local address

export default function Home() {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  
  const [inputValue, setInputValue] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [activeTab, setActiveTab] = useState('storage')

  // Contract addresses - update these with your deployed addresses
  const SIMPLE_STORAGE_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const KISHA_TOKEN_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' // Update with deployed token address

  // Read contract data
  const { data: storedData } = useReadContract({
    address: SIMPLE_STORAGE_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'retrieve',
  })

  const { data: contractBalance } = useReadContract({
    address: SIMPLE_STORAGE_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getBalance',
  })

  const handleStore = async () => {
    if (!inputValue) return
    try {
      await writeContract({
        address: SIMPLE_STORAGE_ADDRESS,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'store',
        args: [BigInt(inputValue)],
      })
      setInputValue('')
    } catch (error) {
      console.error('Error storing data:', error)
    }
  }

  const handleDeposit = async () => {
    if (!depositAmount) return
    try {
      await writeContract({
        address: SIMPLE_STORAGE_ADDRESS,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'deposit',
        value: parseEther(depositAmount),
      })
      setDepositAmount('')
    } catch (error) {
      console.error('Error depositing:', error)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🔗 Kisha WalletConnect Integration</h1>
        <p>Advanced Web3 dApp with multi-contract support</p>
      </header>

      <main className="main">
        {!isConnected ? (
          <WalletConnectComponent />
        ) : (
          <div className="connected-section">
            <WalletConnectComponent />
            
            <div className="app-tabs">
              <button 
                className={`tab ${activeTab === 'storage' ? 'active' : ''}`}
                onClick={() => setActiveTab('storage')}
              >
                📦 Storage Contract
              </button>
              <button 
                className={`tab ${activeTab === 'tokens' ? 'active' : ''}`}
                onClick={() => setActiveTab('tokens')}
              >
                🪙 Token Manager
              </button>
              <button 
                className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                📊 Transaction History
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'storage' && (
                <div className="contract-section">
                  <h3>📦 Simple Storage Contract</h3>
                  <div className="contract-info">
                    <p><strong>Contract Address:</strong> {SIMPLE_STORAGE_ADDRESS}</p>
                    <p><strong>Stored Data:</strong> {storedData?.toString() || '0'}</p>
                    <p><strong>Contract Balance:</strong> {contractBalance ? `${(Number(contractBalance) / 1e18).toFixed(4)} ETH` : '0 ETH'}</p>
                  </div>

                  <div className="interaction-forms">
                    <div className="form-group">
                      <h4>Store Data</h4>
                      <input
                        type="number"
                        placeholder="Enter a number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="input"
                      />
                      <button onClick={handleStore} className="action-button">
                        Store Data
                      </button>
                    </div>

                    <div className="form-group">
                      <h4>Deposit ETH</h4>
                      <input
                        type="number"
                        step="0.001"
                        placeholder="Amount in ETH"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="input"
                      />
                      <button onClick={handleDeposit} className="action-button">
                        Deposit ETH
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tokens' && (
                <TokenManager 
                  tokenAddress={KISHA_TOKEN_ADDRESS}
                  userAddress={address || ''}
                />
              )}

              {activeTab === 'history' && (
                <TransactionHistory />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built with WalletConnect, Wagmi, and Hardhat</p>
        <div className="footer-links">
          <a href="https://github.com/luckywemo/kishaa" target="_blank" rel="noopener noreferrer">
            📁 GitHub Repository
          </a>
          <a href="https://docs.walletconnect.com/" target="_blank" rel="noopener noreferrer">
            📚 WalletConnect Docs
          </a>
        </div>
      </footer>
    </div>
  )
}
