/**
 * Application-wide constants
 */

export const APP_NAME = 'Kisha WalletConnect'
export const APP_DESCRIPTION = 'Advanced Web3 dApp with WalletConnect integration'
export const APP_VERSION = '1.0.0'

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  WALLET_CONNECTED: 'walletConnected',
  LAST_CONNECTED_WALLET: 'lastConnectedWallet',
  SLIPPAGE_TOLERANCE: 'slippageTolerance',
  TX_DEADLINE: 'txDeadline',
  AUTO_CONNECT: 'autoConnect',
  THEME: 'theme',
} as const

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const

/**
 * Default values
 */
export const DEFAULTS = {
  SLIPPAGE: 50, // 0.5% in basis points
  TX_DEADLINE: 20, // minutes
  REFETCH_INTERVAL: 5000, // ms
  POLLING_INTERVAL: 10000, // ms
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  TRANSACTION_REJECTED: 'Transaction was rejected',
  NETWORK_ERROR: 'Network error. Please try again',
  INVALID_ADDRESS: 'Invalid address format',
  INVALID_AMOUNT: 'Invalid amount',
} as const

