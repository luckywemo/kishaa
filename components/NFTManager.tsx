import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

// KishaNFT ABI
const NFT_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "quantity", "type": "uint256"}],
    "name": "mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "quantity", "type": "uint256"}],
    "name": "transfer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintPrice",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintingActive",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

interface NFTManagerProps {
  nftAddress: string
  userAddress: string
}

interface NFT {
  id: string
  uri: string
  owner: string
}

export default function NFTManager({ nftAddress, userAddress }: NFTManagerProps) {
  const [activeTab, setActiveTab] = useState('mint')
  const [mintQuantity, setMintQuantity] = useState('1')
  const [transferTo, setTransferTo] = useState('')
  const [transferTokenId, setTransferTokenId] = useState('')
  const [userNFTs, setUserNFTs] = useState<NFT[]>([])

  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Read NFT contract data
  const { data: userBalance } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'balanceOf',
    args: [userAddress as `0x${string}`],
  })

  const { data: totalSupply } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'totalSupply',
  })

  const { data: mintPrice } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'mintPrice',
  })

  const { data: mintingActive } = useReadContract({
    address: nftAddress as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'mintingActive',
  })

  // Load user's NFTs
  useEffect(() => {
    if (userBalance && userBalance > 0) {
      loadUserNFTs()
    } else {
      setUserNFTs([])
    }
  }, [userBalance])

  const loadUserNFTs = async () => {
    // In a real implementation, you'd fetch the user's NFTs
    // For demo purposes, we'll create mock NFTs
    const mockNFTs: NFT[] = []
    if (userBalance) {
      for (let i = 1; i <= Number(userBalance); i++) {
        mockNFTs.push({
          id: i.toString(),
          uri: `https://api.kisha.com/nft/${i}`,
          owner: userAddress
        })
      }
    }
    setUserNFTs(mockNFTs)
  }

  const handleMint = async () => {
    if (!mintQuantity || parseInt(mintQuantity) <= 0) return
    
    try {
      const quantity = parseInt(mintQuantity)
      const totalCost = mintPrice ? Number(mintPrice) * quantity : 0
      
      await writeContract({
        address: nftAddress as `0x${string}`,
        abi: NFT_ABI,
        functionName: 'mint',
        args: [quantity],
        value: totalCost > 0 ? parseEther(totalCost.toString()) : undefined,
      })
      setMintQuantity('1')
    } catch (error) {
      console.error('Mint error:', error)
    }
  }

  const handleTransfer = async () => {
    if (!transferTo || !transferTokenId) return
    
    try {
      await writeContract({
        address: nftAddress as `0x${string}`,
        abi: NFT_ABI,
        functionName: 'transfer',
        args: [transferTo as `0x${string}`, transferTokenId],
      })
      setTransferTo('')
      setTransferTokenId('')
    } catch (error) {
      console.error('Transfer error:', error)
    }
  }

  const formatPrice = (price: bigint | undefined) => {
    if (!price) return '0'
    return (Number(price) / 1e18).toFixed(4)
  }

  const formatTokenId = (id: string) => {
    return `#${id.padStart(4, '0')}`
  }

  return (
    <div className="nft-manager">
      <div className="nft-header">
        <h3>🎨 Kisha NFT Collection</h3>
        <div className="nft-stats">
          <div className="stat">
            <span className="stat-label">Your NFTs:</span>
            <span className="stat-value">{userBalance?.toString() || '0'}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Supply:</span>
            <span className="stat-value">{totalSupply?.toString() || '0'}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Mint Price:</span>
            <span className="stat-value">{formatPrice(mintPrice)} ETH</span>
          </div>
        </div>
      </div>

      <div className="nft-tabs">
        <button 
          className={`tab ${activeTab === 'mint' ? 'active' : ''}`}
          onClick={() => setActiveTab('mint')}
        >
          🎨 Mint NFTs
        </button>
        <button 
          className={`tab ${activeTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfer')}
        >
          📤 Transfer
        </button>
        <button 
          className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          🖼️ My Gallery
        </button>
      </div>

      <div className="nft-content">
        {activeTab === 'mint' && (
          <div className="mint-form">
            <h4>Mint NFTs</h4>
            {!mintingActive && (
              <div className="minting-disabled">
                <span className="warning-icon">⚠️</span>
                <p>Minting is currently disabled</p>
              </div>
            )}
            
            <div className="mint-inputs">
              <div className="input-group">
                <label>Quantity (Max 10 per transaction):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={mintQuantity}
                  onChange={(e) => setMintQuantity(e.target.value)}
                  className="mint-input"
                  disabled={!mintingActive}
                />
              </div>
              
              <div className="mint-cost">
                <p>
                  <strong>Cost:</strong> {formatPrice(mintPrice)} ETH × {mintQuantity} = {formatPrice(mintPrice ? BigInt(Number(mintPrice) * parseInt(mintQuantity || '0')) : undefined)} ETH
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleMint}
              disabled={isPending || !mintingActive || !mintQuantity || parseInt(mintQuantity) <= 0}
              className="nft-button mint-button"
            >
              {isPending ? 'Minting...' : `Mint ${mintQuantity} NFT${parseInt(mintQuantity || '1') > 1 ? 's' : ''}`}
            </button>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="transfer-form">
            <h4>Transfer NFT</h4>
            <div className="transfer-inputs">
              <div className="input-group">
                <label>Token ID:</label>
                <input
                  type="number"
                  placeholder="Enter token ID"
                  value={transferTokenId}
                  onChange={(e) => setTransferTokenId(e.target.value)}
                  className="transfer-input"
                />
              </div>
              
              <div className="input-group">
                <label>Recipient Address:</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="transfer-input"
                />
              </div>
            </div>
            
            <button 
              onClick={handleTransfer}
              disabled={isPending || !transferTo || !transferTokenId}
              className="nft-button transfer-button"
            >
              {isPending ? 'Transferring...' : 'Transfer NFT'}
            </button>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="nft-gallery">
            <h4>My NFT Collection</h4>
            {userNFTs.length === 0 ? (
              <div className="no-nfts">
                <div className="no-nfts-icon">🎨</div>
                <p>You don't own any NFTs yet</p>
                <p>Mint your first NFT to get started!</p>
              </div>
            ) : (
              <div className="nft-grid">
                {userNFTs.map((nft) => (
                  <div key={nft.id} className="nft-card">
                    <div className="nft-image">
                      <div className="nft-placeholder">
                        <span className="nft-icon">🎨</span>
                      </div>
                    </div>
                    <div className="nft-info">
                      <h5>{formatTokenId(nft.id)}</h5>
                      <p className="nft-owner">Owner: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
                    </div>
                    <div className="nft-actions">
                      <button className="nft-action-btn">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
