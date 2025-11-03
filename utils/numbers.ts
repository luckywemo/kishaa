import { formatEther, formatUnits } from 'viem'

/**
 * Format number with commas
 */
export function formatNumber(num: number | string | bigint): string {
  const n = typeof num === 'bigint' ? Number(num) : typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(n)) return '0'
  return n.toLocaleString('en-US')
}

/**
 * Format number with decimals
 */
export function formatNumberWithDecimals(num: number | string | bigint, decimals = 2): string {
  const n = typeof num === 'bigint' ? Number(num) : typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(n)) return '0.00'
  return n.toFixed(decimals)
}

/**
 * Truncate number to specified decimals
 */
export function truncateDecimals(value: number | string, decimals = 4): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'
  
  const factor = Math.pow(10, decimals)
  return (Math.floor(num * factor) / factor).toString()
}

/**
 * Parse number safely
 */
export function parseNumber(value: string | number | bigint): number {
  if (typeof value === 'number') return value
  if (typeof value === 'bigint') return Number(value)
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Check if number is valid
 */
export function isValidNumber(value: any): boolean {
  if (typeof value === 'number') return !isNaN(value) && isFinite(value)
  if (typeof value === 'bigint') return true
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return !isNaN(parsed) && isFinite(parsed)
  }
  return false
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format currency (USD-like)
 */
export function formatCurrency(value: number | string, symbol = '$'): string {
  const num = parseNumber(value)
  return `${symbol}${formatNumber(num)}`
}

/**
 * Calculate percentage
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0
  return (part / total) * 100
}

