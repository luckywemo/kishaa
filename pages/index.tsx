import { useState } from 'react'
import { useAccount, useBalance, useWriteContract, useReadContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import WalletConnectComponent from '../components/WalletConnect'
import MobileWalletConnect from '../components/MobileWalletConnect'
import TokenManager from '../components/TokenManager'
import DEXManager from '../components/DEXManager'
import NFTManager from '../components/NFTManager'
import TransactionHistory from '../components/TransactionHistory'
import SEO from '../components/SEO'
import Tabs from '../components/Tabs'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { CONTRACT_ADDRESSES } from '../utils/constants'
import SimpleStorageABI from '../abis/SimpleStorage.json'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()
  
  const [inputValue, setInputValue] = useState('')
  const [depositAmount, setDepositAmount] = useState('')

  // Read contract data
  const { data: storedData } = useReadContract({
    address: CONTRACT_ADDRESSES.SIMPLE_STORAGE as `0x${string}`,
    abi: SimpleStorageABI as any,
    functionName: 'retrieve',
  })

  const { data: contractBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.SIMPLE_STORAGE as `0x${string}`,
    abi: SimpleStorageABI as any,
    functionName: 'getBalance',
  })

  const handleStore = async () => {
    if (!inputValue) return
    try {
      await writeContract({
        address: CONTRACT_ADDRESSES.SIMPLE_STORAGE as `0x${string}`,
        abi: SimpleStorageABI as any,
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
        address: CONTRACT_ADDRESSES.SIMPLE_STORAGE as `0x${string}`,
        abi: SimpleStorageABI as any,
        functionName: 'deposit',
        value: parseEther(depositAmount),
      })
      setDepositAmount('')
    } catch (error) {
      console.error('Error depositing:', error)
    }
  }

  const tabs = [
    {
      id: 'storage',
      label: '📦 Storage',
      content: (
        <Card title="Simple Storage Contract">
          <div style={{ marginBottom: '1.5rem' }}>
            <p><strong>Contract Address:</strong> {CONTRACT_ADDRESSES.SIMPLE_STORAGE}</p>
            <p><strong>Stored Data:</strong> {storedData?.toString() || '0'}</p>
            <p><strong>Contract Balance:</strong> {contractBalance ? `${formatEther(contractBalance)} ETH` : '0 ETH'}</p>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <Input
                label="Store Data"
                type="number"
                placeholder="Enter a number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button onClick={handleStore} fullWidth style={{ marginTop: '0.5rem' }}>
                Store Data
              </Button>
            </div>

            <div>
              <Input
                label="Deposit ETH"
                type="number"
                step="0.001"
                placeholder="Amount in ETH"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <Button onClick={handleDeposit} fullWidth style={{ marginTop: '0.5rem' }}>
                Deposit ETH
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
    {
      id: 'tokens',
      label: '🪙 Tokens',
      content: (
        <TokenManager 
          tokenAddress={CONTRACT_ADDRESSES.KISHA_TOKEN}
          userAddress={address || ''}
        />
      ),
    },
    {
      id: 'dex',
      label: '🔄 DEX',
      content: (
        <DEXManager 
          ammAddress={CONTRACT_ADDRESSES.SIMPLE_AMM}
          tokenAAddress={CONTRACT_ADDRESSES.KISHA_TOKEN}
          tokenBAddress="0x0000000000000000000000000000000000000000"
          userAddress={address || ''}
        />
      ),
    },
    {
      id: 'nft',
      label: '🎨 NFTs',
      content: (
        <NFTManager 
          nftAddress={CONTRACT_ADDRESSES.KISHA_NFT}
          userAddress={address || ''}
        />
      ),
    },
    {
      id: 'history',
      label: '📊 History',
      content: <TransactionHistory />,
    },
  ]

  return (
    <>
      <SEO 
        title="Home" 
        description="Advanced Web3 dApp with WalletConnect integration, token management, DEX, and NFT support"
      />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔗 Kisha WalletConnect</h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Advanced Web3 dApp with multi-contract support</p>
        </div>

        {!isConnected ? (
          <Card title="Connect Your Wallet">
            <MobileWalletConnect />
          </Card>
        ) : (
          <>
            <WalletConnectComponent />
            <div style={{ marginTop: '2rem' }}>
              <Tabs tabs={tabs} variant="pills" />
            </div>
          </>
        )}
      </div>
    </>
  )
}
