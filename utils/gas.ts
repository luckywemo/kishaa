import { formatEther, formatGwei } from 'viem'

/**
 * Format gas price in Gwei
 */
export function formatGasPrice(gasPrice: bigint | undefined): string {
  if (!gasPrice) return '0'
  return formatGwei(gasPrice)
}

/**
 * Calculate total gas cost
 */
export function calculateGasCost(gasPrice: bigint, gasLimit: bigint): bigint {
  return gasPrice * gasLimit
}

/**
 * Format gas cost in ETH
 */
export function formatGasCost(gasPrice: bigint, gasLimit: bigint): string {
  const cost = calculateGasCost(gasPrice, gasLimit)
  return formatEther(cost)
}

/**
 * Estimate transaction cost including value
 */
export function estimateTotalCost(value: bigint, gasPrice: bigint, gasLimit: bigint): bigint {
  return value + calculateGasCost(gasPrice, gasLimit)
}

/**
 * Get recommended gas limit for transaction type
 */
export function getRecommendedGasLimit(type: 'transfer' | 'approve' | 'swap' | 'mint' | 'custom'): bigint {
  const limits: Record<string, bigint> = {
    transfer: 21000n,
    approve: 46000n,
    swap: 150000n,
    mint: 150000n,
    custom: 200000n,
  }
  return limits[type] || 200000n
}

/**
 * Calculate max gas fee (gasPrice * gasLimit)
 */
export function calculateMaxFee(gasPrice: bigint, gasLimit: bigint): bigint {
  return gasPrice * gasLimit
}

/**
 * Format max fee in readable format
 */
export function formatMaxFee(gasPrice: bigint, gasLimit: bigint): string {
  const maxFee = calculateMaxFee(gasPrice, gasLimit)
  const ethValue = parseFloat(formatEther(maxFee))
  
  if (ethValue < 0.0001) {
    return `< 0.0001 ETH`
  }
  
  return `${ethValue.toFixed(6)} ETH`
}

