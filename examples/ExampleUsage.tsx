/**
 * Example usage of hooks and components
 * This file demonstrates common patterns and best practices
 */

import { useState } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { useContractWrite, useContractRead, useTokenBalance } from '../hooks'
import { formatEth, formatAddress } from '../utils'
import Button from '../components/Button'
import Input from '../components/Input'
import Alert from '../components/Alert'
import Modal from '../components/Modal'
import Card from '../components/Card'
import { CONTRACT_ADDRESSES } from '../utils/constants'

// Example: Using Web3 Context
export function Web3Example() {
  const { address, balance, isConnected, chainId } = useWeb3()

  if (!isConnected) {
    return <Alert variant="info">Please connect your wallet</Alert>
  }

  return (
    <Card title="Wallet Info">
      <p>Address: {formatAddress(address || '')}</p>
      <p>Balance: {balance} ETH</p>
      <p>Chain: {chainId}</p>
    </Card>
  )
}

// Example: Token Operations
export function TokenOperationsExample() {
  const { address } = useWeb3()
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')

  // Get token balance
  const { balance, formatted } = useTokenBalance({
    tokenAddress: CONTRACT_ADDRESSES.KISHA_TOKEN,
    address,
  })

  // Write contract
  const { write, isPending, hash } = useContractWrite({
    address: CONTRACT_ADDRESSES.KISHA_TOKEN,
    abi: [
      {
        inputs: [
          { internalType: 'address', name: '_to', type: 'address' },
          { internalType: 'uint256', name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'transfer',
    args: [recipient as `0x${string}`, BigInt(amount || '0')],
    description: 'Transfer tokens',
  })

  return (
    <Card title="Token Transfer">
      <p>Your Balance: {formatted} KISH</p>
      <Input
        label="Recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="0x..."
      />
      <Input
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.0"
      />
      <Button onClick={write} isLoading={isPending} fullWidth>
        Transfer
      </Button>
    </Card>
  )
}

// Example: Modal Usage
export function ModalExample() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Example Modal">
        <p>This is modal content</p>
      </Modal>
    </>
  )
}

// Example: Reading Contract Data
export function ReadContractExample() {
  const { data: storedData } = useContractRead({
    address: CONTRACT_ADDRESSES.SIMPLE_STORAGE,
    abi: [
      {
        inputs: [],
        name: 'retrieve',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'retrieve',
  })

  return (
    <Card>
      <p>Stored Data: {storedData?.toString() || 'Loading...'}</p>
    </Card>
  )
}

