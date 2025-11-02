import { parseError } from './formatting'

export class Web3Error extends Error {
  constructor(
    message: string,
    public code?: string | number,
    public data?: any
  ) {
    super(message)
    this.name = 'Web3Error'
  }
}

export function handleTransactionError(error: any): string {
  const message = parseError(error)
  
  // Add user-friendly messages for common errors
  if (message.includes('insufficient funds')) {
    return 'Insufficient balance. Please check your account balance and gas fees.'
  }
  
  if (message.includes('user rejected')) {
    return 'Transaction was rejected. Please try again.'
  }
  
  if (message.includes('execution reverted')) {
    return `Transaction failed: ${message}`
  }
  
  if (message.includes('network')) {
    return 'Network error. Please check your connection and try again.'
  }
  
  return message || 'An unexpected error occurred. Please try again.'
}

export function isRevertedError(error: any): boolean {
  const message = typeof error === 'string' ? error : error?.message || ''
  return message.includes('reverted') || message.includes('revert')
}

export function isInsufficientFundsError(error: any): boolean {
  const message = typeof error === 'string' ? error : error?.message || ''
  return message.includes('insufficient') || message.includes('funds')
}

export function isUserRejectedError(error: any): boolean {
  const message = typeof error === 'string' ? error : error?.message || ''
  return message.includes('rejected') || message.includes('User denied')
}

