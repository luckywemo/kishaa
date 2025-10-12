import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useBalance, useWriteContract, useReadContract } from 'wagmi'
import { parseEther } from 'viem'

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
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const { writeContract } = useWriteContract()
  
  const [inputValue, setInputValue] = useState('')
  const [depositAmount, setDepositAmount] = useState('')

  // Read contract data
  const { data: storedData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'retrieve',
  })

  const { data: contractBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_STORAGE_ABI,
    functionName: 'getBalance',
  })

  const handleStore = async () => {
    if (!inputValue) return
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
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
        address: CONTRACT_ADDRESS,
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
        <p>Connect your wallet and interact with smart contracts</p>
      </header>

      <main className="main">
        {!isConnected ? (
          <div className="connect-section">
            <h2>Connect Your Wallet</h2>
            <p>Choose a wallet to connect to the app:</p>
            <div className="wallet-buttons">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="wallet-button"
                >
                  {connector.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="connected-section">
            <div className="account-info">
              <h2>✅ Connected</h2>
              <p><strong>Address:</strong> {address}</p>
              <p><strong>Balance:</strong> {balance?.formatted} {balance?.symbol}</p>
              <button onClick={() => disconnect()} className="disconnect-button">
                Disconnect
              </button>
            </div>

            <div className="contract-section">
              <h3>Smart Contract Interaction</h3>
              <div className="contract-info">
                <p><strong>Contract Address:</strong> {CONTRACT_ADDRESS}</p>
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
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built with WalletConnect, Wagmi, and Hardhat</p>
      </footer>
    </div>
  )
}
