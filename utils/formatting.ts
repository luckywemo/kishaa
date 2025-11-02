import { formatEther, formatUnits } from 'viem'
import { format, formatDistanceToNow } from 'date-fns'

/**
 * Format Ethereum address to shortened version
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

/**
 * Format ETH value with appropriate decimals
 */
export function formatEth(value: bigint | undefined | null, decimals = 4): string {
  if (!value || value === 0n) return '0.0000'
  return parseFloat(formatEther(value)).toFixed(decimals)
}

/**
 * Format token value with custom decimals
 */
export function formatToken(value: bigint | undefined | null, decimals = 18, displayDecimals = 4): string {
  if (!value || value === 0n) return '0.0000'
  return parseFloat(formatUnits(value, decimals)).toFixed(displayDecimals)
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompact(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'
  
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toFixed(2)
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: number | Date): string {
  try {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'Unknown'
  }
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number | Date, formatStr = 'PPp'): string {
  try {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp
    return format(date, formatStr)
  } catch {
    return 'Invalid Date'
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch {
    return false
  }
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Get block explorer URL for transaction
 */
export function getExplorerUrl(hash: string, chainId?: number): string {
  const explorerUrls: Record<number, string> = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    31337: 'https://localhost:8545',
  }
  
  const baseUrl = explorerUrls[chainId || 1] || explorerUrls[1]
  return `${baseUrl}/tx/${hash}`
}

/**
 * Get block explorer URL for address
 */
export function getExplorerAddressUrl(address: string, chainId?: number): string {
  const explorerUrls: Record<number, string> = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    31337: 'https://localhost:8545',
  }
  
  const baseUrl = explorerUrls[chainId || 1] || explorerUrls[1]
  return `${baseUrl}/address/${address}`
}

/**
 * Parse error message from transaction
 */
export function parseError(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) {
    // Parse common error patterns
    const message = error.message
    if (message.includes('user rejected')) return 'Transaction was rejected'
    if (message.includes('insufficient funds')) return 'Insufficient funds for transaction'
    if (message.includes('execution reverted')) {
      const reason = message.match(/execution reverted: (.*)/)?.[1]
      return reason || 'Transaction reverted'
    }
    return message
  }
  return 'An unknown error occurred'
}

