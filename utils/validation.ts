/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validate amount (must be positive number)
 */
export function isValidAmount(amount: string | number): boolean {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return !isNaN(num) && num > 0 && isFinite(num)
}

/**
 * Validate that amount doesn't exceed balance
 */
export function validateAmount(amount: bigint, balance: bigint): {
  valid: boolean
  message?: string
} {
  if (amount <= 0n) {
    return { valid: false, message: 'Amount must be greater than zero' }
  }
  
  if (amount > balance) {
    return { valid: false, message: 'Insufficient balance' }
  }
  
  return { valid: true }
}

/**
 * Validate contract address format
 */
export function validateContractAddress(address: string): {
  valid: boolean
  message?: string
} {
  if (!address) {
    return { valid: false, message: 'Address is required' }
  }
  
  if (!isValidAddress(address)) {
    return { valid: false, message: 'Invalid address format' }
  }
  
  if (address === '0x0000000000000000000000000000000000000000') {
    return { valid: false, message: 'Cannot use zero address' }
  }
  
  return { valid: true }
}

/**
 * Sanitize input for numbers
 */
export function sanitizeNumberInput(value: string): string {
  // Remove any non-numeric characters except decimal point
  return value.replace(/[^0-9.]/g, '')
}

/**
 * Format number input (prevent multiple decimal points)
 */
export function formatNumberInput(value: string): string {
  const sanitized = sanitizeNumberInput(value)
  const parts = sanitized.split('.')
  
  if (parts.length > 2) {
    // If more than one decimal point, keep only the first
    return parts[0] + '.' + parts.slice(1).join('')
  }
  
  return sanitized
}

