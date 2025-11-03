/**
 * Common TypeScript types for the application
 */

export type Address = `0x${string}`

export interface Transaction {
  hash: string
  from: Address
  to: Address
  value: bigint
  gasLimit: bigint
  gasPrice: bigint
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
  blockNumber?: number
}

export interface TokenBalance {
  tokenAddress: Address
  symbol: string
  name: string
  decimals: number
  balance: bigint
  formatted: string
}

export interface NetworkInfo {
  chainId: number
  name: string
  rpcUrl: string
  explorer: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export interface ContractConfig {
  address: Address
  abi: any[]
  name: string
}

export interface GasEstimate {
  gasLimit: bigint
  gasPrice: bigint
  maxFee: bigint
  formattedFee: string
}

export interface ApprovalState {
  allowance: bigint
  needsApproval: boolean
  isApproved: boolean
  isPending: boolean
}

