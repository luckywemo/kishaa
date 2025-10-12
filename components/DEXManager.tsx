import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'

// SimpleAMM ABI
const AMM_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "amountA", "type": "uint256"}, {"internalType": "uint256", "name": "amountB", "type": "uint256"}],
    "name": "addLiquidity",
    "outputs": [{"internalType": "uint256", "name": "liquidity", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "liquidity", "type": "uint256"}],
    "name": "removeLiquidity",
    "outputs": [{"internalType": "uint256", "name": "amountA", "type": "uint256"}, {"internalType": "uint256", "name": "amountB", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "tokenIn", "type": "address"}, {"internalType": "uint256", "name": "amountIn", "type": "uint256"}],
    "name": "swap",
    "outputs": [{"internalType": "uint256", "name": "amountOut", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "tokenIn", "type": "address"}, {"internalType": "uint256", "name": "amountIn", "type": "uint256"}],
    "name": "getAmountOut",
    "outputs": [{"internalType": "uint256", "name": "amountOut", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReserves",
    "outputs": [{"internalType": "uint256", "name": "_reserveA", "type": "uint256"}, {"internalType": "uint256", "name": "_reserveB", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "liquidityProviders",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

interface DEXManagerProps {
  ammAddress: string
  tokenAAddress: string
  tokenBAddress: string
  userAddress: string
}

export default function DEXManager({ ammAddress, tokenAAddress, tokenBAddress, userAddress }: DEXManagerProps) {
  const [activeTab, setActiveTab] = useState('swap')
  const [swapTokenIn, setSwapTokenIn] = useState(tokenAAddress)
  const [swapAmountIn, setSwapAmountIn] = useState('')
  const [liquidityAmountA, setLiquidityAmountA] = useState('')
  const [liquidityAmountB, setLiquidityAmountB] = useState('')
  const [removeLiquidity, setRemoveLiquidity] = useState('')
  const [estimatedOutput, setEstimatedOutput] = useState('0')

  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Read AMM data
  const { data: reserves } = useReadContract({
    address: ammAddress as `0x${string}`,
    abi: AMM_ABI,
    functionName: 'getReserves',
  })

  const { data: userLiquidity } = useReadContract({
    address: ammAddress as `0x${string}`,
    abi: AMM_ABI,
    functionName: 'liquidityProviders',
    args: [userAddress as `0x${string}`],
  })

  // Calculate estimated output when amount changes
  useEffect(() => {
    if (swapAmountIn && parseFloat(swapAmountIn) > 0) {
      // This would normally call the getAmountOut function
      // For demo purposes, we'll calculate a simple estimate
      const amount = parseFloat(swapAmountIn)
      const reserveA = reserves?.[0] ? Number(formatEther(reserves[0])) : 1
      const reserveB = reserves?.[1] ? Number(formatEther(reserves[1])) : 1
      
      if (swapTokenIn === tokenAAddress) {
        const estimated = (amount * reserveB) / (reserveA + amount)
        setEstimatedOutput(estimated.toFixed(6))
      } else {
        const estimated = (amount * reserveA) / (reserveB + amount)
        setEstimatedOutput(estimated.toFixed(6))
      }
    } else {
      setEstimatedOutput('0')
    }
  }, [swapAmountIn, swapTokenIn, reserves, tokenAAddress, tokenBAddress])

  const handleSwap = async () => {
    if (!swapAmountIn || parseFloat(swapAmountIn) <= 0) return
    
    try {
      await writeContract({
        address: ammAddress as `0x${string}`,
        abi: AMM_ABI,
        functionName: 'swap',
        args: [swapTokenIn as `0x${string}`, parseEther(swapAmountIn)],
      })
      setSwapAmountIn('')
    } catch (error) {
      console.error('Swap error:', error)
    }
  }

  const handleAddLiquidity = async () => {
    if (!liquidityAmountA || !liquidityAmountB || parseFloat(liquidityAmountA) <= 0 || parseFloat(liquidityAmountB) <= 0) return
    
    try {
      await writeContract({
        address: ammAddress as `0x${string}`,
        abi: AMM_ABI,
        functionName: 'addLiquidity',
        args: [parseEther(liquidityAmountA), parseEther(liquidityAmountB)],
      })
      setLiquidityAmountA('')
      setLiquidityAmountB('')
    } catch (error) {
      console.error('Add liquidity error:', error)
    }
  }

  const handleRemoveLiquidity = async () => {
    if (!removeLiquidity || parseFloat(removeLiquidity) <= 0) return
    
    try {
      await writeContract({
        address: ammAddress as `0x${string}`,
        abi: AMM_ABI,
        functionName: 'removeLiquidity',
        args: [parseEther(removeLiquidity)],
      })
      setRemoveLiquidity('')
    } catch (error) {
      console.error('Remove liquidity error:', error)
    }
  }

  const formatTokenAmount = (amount: bigint | undefined) => {
    if (!amount) return '0.0000'
    return parseFloat(formatEther(amount)).toFixed(4)
  }

  const tokenASymbol = 'KISH'
  const tokenBSymbol = 'ETH'

  return (
    <div className="dex-manager">
      <div className="dex-header">
        <h3>🔄 Decentralized Exchange (DEX)</h3>
        <div className="pool-info">
          <div className="pool-stats">
            <div className="stat">
              <span className="stat-label">{tokenASymbol} Reserve:</span>
              <span className="stat-value">{formatTokenAmount(reserves?.[0])}</span>
            </div>
            <div className="stat">
              <span className="stat-label">{tokenBSymbol} Reserve:</span>
              <span className="stat-value">{formatTokenAmount(reserves?.[1])}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Your Liquidity:</span>
              <span className="stat-value">{formatTokenAmount(userLiquidity)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dex-tabs">
        <button 
          className={`tab ${activeTab === 'swap' ? 'active' : ''}`}
          onClick={() => setActiveTab('swap')}
        >
          🔄 Swap
        </button>
        <button 
          className={`tab ${activeTab === 'liquidity' ? 'active' : ''}`}
          onClick={() => setActiveTab('liquidity')}
        >
          💧 Add Liquidity
        </button>
        <button 
          className={`tab ${activeTab === 'remove' ? 'active' : ''}`}
          onClick={() => setActiveTab('remove')}
        >
          🚰 Remove Liquidity
        </button>
      </div>

      <div className="dex-content">
        {activeTab === 'swap' && (
          <div className="swap-form">
            <h4>Token Swap</h4>
            <div className="swap-inputs">
              <div className="input-group">
                <label>From:</label>
                <div className="token-input-container">
                  <select 
                    value={swapTokenIn}
                    onChange={(e) => setSwapTokenIn(e.target.value)}
                    className="token-select"
                  >
                    <option value={tokenAAddress}>{tokenASymbol}</option>
                    <option value={tokenBAddress}>{tokenBSymbol}</option>
                  </select>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="0.0"
                    value={swapAmountIn}
                    onChange={(e) => setSwapAmountIn(e.target.value)}
                    className="amount-input"
                  />
                </div>
              </div>
              
              <div className="swap-arrow">⬇️</div>
              
              <div className="input-group">
                <label>To:</label>
                <div className="token-input-container">
                  <div className="token-display">
                    {swapTokenIn === tokenAAddress ? tokenBSymbol : tokenASymbol}
                  </div>
                  <div className="amount-display">
                    {estimatedOutput}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="swap-info">
              <p>Estimated Output: {estimatedOutput} {swapTokenIn === tokenAAddress ? tokenBSymbol : tokenASymbol}</p>
              <p>Slippage: ~0.1%</p>
            </div>
            
            <button 
              onClick={handleSwap}
              disabled={isPending || !swapAmountIn || parseFloat(swapAmountIn) <= 0}
              className="dex-button"
            >
              {isPending ? 'Swapping...' : 'Swap Tokens'}
            </button>
          </div>
        )}

        {activeTab === 'liquidity' && (
          <div className="liquidity-form">
            <h4>Add Liquidity</h4>
            <div className="liquidity-inputs">
              <div className="input-group">
                <label>{tokenASymbol} Amount:</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={liquidityAmountA}
                  onChange={(e) => setLiquidityAmountA(e.target.value)}
                  className="liquidity-input"
                />
              </div>
              
              <div className="input-group">
                <label>{tokenBSymbol} Amount:</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={liquidityAmountB}
                  onChange={(e) => setLiquidityAmountB(e.target.value)}
                  className="liquidity-input"
                />
              </div>
            </div>
            
            <div className="liquidity-info">
              <p>⚠️ You will receive liquidity tokens representing your share of the pool</p>
              <p>⚠️ Impermanent loss may occur if token prices change</p>
            </div>
            
            <button 
              onClick={handleAddLiquidity}
              disabled={isPending || !liquidityAmountA || !liquidityAmountB}
              className="dex-button"
            >
              {isPending ? 'Adding...' : 'Add Liquidity'}
            </button>
          </div>
        )}

        {activeTab === 'remove' && (
          <div className="remove-form">
            <h4>Remove Liquidity</h4>
            <div className="remove-inputs">
              <div className="input-group">
                <label>Liquidity Tokens to Remove:</label>
                <input
                  type="number"
                  step="0.001"
                  placeholder="0.0"
                  value={removeLiquidity}
                  onChange={(e) => setRemoveLiquidity(e.target.value)}
                  className="remove-input"
                />
                <small>Max: {formatTokenAmount(userLiquidity)}</small>
              </div>
            </div>
            
            <div className="remove-info">
              <p>You will receive both {tokenASymbol} and {tokenBSymbol} tokens</p>
              <p>Based on current reserves: ~{formatTokenAmount(reserves?.[0])} {tokenASymbol} + ~{formatTokenAmount(reserves?.[1])} {tokenBSymbol}</p>
            </div>
            
            <button 
              onClick={handleRemoveLiquidity}
              disabled={isPending || !removeLiquidity || parseFloat(removeLiquidity) <= 0}
              className="dex-button remove-button"
            >
              {isPending ? 'Removing...' : 'Remove Liquidity'}
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
