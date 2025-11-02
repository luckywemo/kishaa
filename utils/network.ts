import { mainnet, sepolia, hardhat } from 'wagmi/chains'

export const SUPPORTED_CHAINS = [hardhat, sepolia, mainnet]

/**
 * Get chain info by chain ID
 */
export function getChainById(chainId: number) {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId)
}

/**
 * Get chain name by chain ID
 */
export function getChainName(chainId: number): string {
  const chain = getChainById(chainId)
  return chain?.name || `Chain ${chainId}`
}

/**
 * Check if chain is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return SUPPORTED_CHAINS.some(chain => chain.id === chainId)
}

/**
 * Get block explorer URL for chain
 */
export function getExplorerUrl(chainId: number): string {
  const chain = getChainById(chainId)
  if (!chain) return 'https://etherscan.io'
  
  if (chainId === 1) return 'https://etherscan.io'
  if (chainId === 11155111) return 'https://sepolia.etherscan.io'
  if (chainId === 31337) return 'http://localhost:8545'
  
  return 'https://etherscan.io'
}

/**
 * Get RPC URL for chain
 */
export function getRpcUrl(chainId: number): string {
  const chain = getChainById(chainId)
  if (!chain) return ''
  
  if (chainId === 31337) return 'http://127.0.0.1:8545'
  // Add your RPC URLs for other chains
  return ''
}

/**
 * Format chain ID for display
 */
export function formatChainId(chainId: number): string {
  const chain = getChainById(chainId)
  return chain ? chain.name : `Chain ${chainId}`
}

