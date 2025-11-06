import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import LoadingSpinner from './LoadingSpinner'
import AddressDisplay from './AddressDisplay'
import Badge from './Badge'
import { CONTRACT_ADDRESSES } from '../utils/constants'
import MultiSigWalletABI from '../abis/MultiSigWallet.json'
import { formatAddress } from '../utils/formatting'

interface Transaction {
  id: number
  destination: string
  value: bigint
  executed: boolean
  confirmations: number
  confirmed: boolean
}

export default function MultiSigWallet() {
  const { address, isConnected } = useAccount()
  const [walletAddress, setWalletAddress] = useState(CONTRACT_ADDRESSES.MULTISIG_WALLET || '')
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Read wallet balance
  const { data: walletBalance } = useBalance({
    address: walletAddress as `0x${string}`,
    enabled: !!walletAddress && walletAddress !== '',
  })

  // Read owners and required confirmations
  const { data: required } = useReadContract({
    address: walletAddress as `0x${string}`,
    abi: MultiSigWalletABI as any,
    functionName: 'required',
    enabled: !!walletAddress && walletAddress !== '',
  })

  const { data: transactionCount } = useReadContract({
    address: walletAddress as `0x${string}`,
    abi: MultiSigWalletABI as any,
    functionName: 'transactionCount',
    enabled: !!walletAddress && walletAddress !== '',
  })

  // Check if user is owner
  const { data: isOwner } = useReadContract({
    address: walletAddress as `0x${string}`,
    abi: MultiSigWalletABI as any,
    functionName: 'isOwner',
    args: [address || '0x'],
    enabled: !!walletAddress && !!address && walletAddress !== '',
  })

  const { writeContract, isPending } = useWriteContract()

  useEffect(() => {
    if (walletAddress && transactionCount) {
      loadTransactions()
    }
  }, [walletAddress, transactionCount])

  const loadTransactions = async () => {
    if (!transactionCount) return
    setIsLoading(true)
    // In production, fetch transactions from contract
    // For now, show mock data
    setTimeout(() => {
      setTransactions([])
      setIsLoading(false)
    }, 1000)
  }

  const handleSubmitTransaction = async () => {
    if (!destination || !amount) return

    try {
      await writeContract({
        address: walletAddress as `0x${string}`,
        abi: MultiSigWalletABI as any,
        functionName: 'submitTransaction',
        args: [destination as `0x${string}`, parseEther(amount), '0x'],
      })
      setDestination('')
      setAmount('')
      loadTransactions()
    } catch (error) {
      console.error('Error submitting transaction:', error)
    }
  }

  const handleConfirmTransaction = async (transactionId: number) => {
    try {
      await writeContract({
        address: walletAddress as `0x${string}`,
        abi: MultiSigWalletABI as any,
        functionName: 'confirmTransaction',
        args: [BigInt(transactionId)],
      })
      loadTransactions()
    } catch (error) {
      console.error('Error confirming transaction:', error)
    }
  }

  const handleExecuteTransaction = async (transactionId: number) => {
    try {
      await writeContract({
        address: walletAddress as `0x${string}`,
        abi: MultiSigWalletABI as any,
        functionName: 'executeTransaction',
        args: [BigInt(transactionId)],
      })
      loadTransactions()
    } catch (error) {
      console.error('Error executing transaction:', error)
    }
  }

  if (!isConnected) {
    return (
      <Card title="Multi-Signature Wallet">
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          Connect your wallet to use Multi-Sig Wallet
        </p>
      </Card>
    )
  }

  if (!walletAddress || walletAddress === '') {
    return (
      <Card title="Multi-Signature Wallet">
        <div style={{ marginBottom: '1rem' }}>
          <Input
            label="Multi-Sig Wallet Address"
            placeholder="0x..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>
        <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
          Enter a Multi-Sig Wallet address to get started
        </p>
      </Card>
    )
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Card title="Wallet Info">
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Wallet Address</div>
            <AddressDisplay address={walletAddress} showCopy />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Balance</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {walletBalance ? formatEther(walletBalance.value).slice(0, 8) : '0'} ETH
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Required Confirmations</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{required?.toString() || 'N/A'}</div>
          </div>
          {isOwner && (
            <Badge variant="success" size="medium">You are an owner</Badge>
          )}
        </Card>

        {isOwner && (
          <Card title="Submit Transaction">
            <div style={{ marginBottom: '1rem' }}>
              <Input
                label="Destination Address"
                placeholder="0x..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Input
                label="Amount (ETH)"
                type="number"
                step="0.001"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSubmitTransaction}
              fullWidth
              disabled={!destination || !amount || isPending}
            >
              {isPending ? 'Submitting...' : 'Submit Transaction'}
            </Button>
          </Card>
        )}
      </div>

      <Card title="Pending Transactions">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <LoadingSpinner size="medium" />
          </div>
        ) : transactions.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No pending transactions
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Transaction #{tx.id}</div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      To: {formatAddress(tx.destination)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      Amount: {formatEther(tx.value)} ETH
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <Badge variant={tx.executed ? 'success' : 'warning'}>
                      {tx.executed ? 'Executed' : 'Pending'}
                    </Badge>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      {tx.confirmations}/{required?.toString() || '?'} confirmations
                    </div>
                  </div>
                </div>
                {!tx.executed && isOwner && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {!tx.confirmed && (
                      <Button
                        onClick={() => handleConfirmTransaction(tx.id)}
                        variant="outline"
                        size="small"
                      >
                        Confirm
                      </Button>
                    )}
                    {tx.confirmations >= (required || 0) && (
                      <Button
                        onClick={() => handleExecuteTransaction(tx.id)}
                        size="small"
                      >
                        Execute
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {!isOwner && (
        <Card title="Access Denied">
          <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
            You are not an owner of this Multi-Sig Wallet
          </p>
        </Card>
      )}
    </div>
  )
}

