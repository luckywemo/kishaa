'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { formatEth } from '../utils/formatting'

interface Web3ContextType {
  address: `0x${string}` | undefined
  isConnected: boolean
  balance: string
  balanceBigInt: bigint | undefined
  chainId: number
  isReady: boolean
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balanceData } = useBalance({ address })

  const balance = balanceData ? formatEth(balanceData.value) : '0.0000'
  const isReady = isConnected && !!address

  const value: Web3ContextType = {
    address,
    isConnected: isConnected || false,
    balance,
    balanceBigInt: balanceData?.value,
    chainId,
    isReady,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

