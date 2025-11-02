/**
 * Network configurations
 */
export const NETWORKS = {
  mainnet: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_KEY',
    explorer: 'https://etherscan.io',
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    explorer: 'https://sepolia.etherscan.io',
  },
  hardhat: {
    id: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
    explorer: 'http://localhost:8545',
  },
} as const

/**
 * Contract addresses (update after deployment)
 */
export const CONTRACT_ADDRESSES = {
  SIMPLE_STORAGE: process.env.NEXT_PUBLIC_SIMPLE_STORAGE_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  KISHA_TOKEN: process.env.NEXT_PUBLIC_KISHA_TOKEN_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  KISHA_NFT: process.env.NEXT_PUBLIC_KISHA_NFT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  SIMPLE_AMM: process.env.NEXT_PUBLIC_AMM_ADDRESS || '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  MULTISIG_WALLET: process.env.NEXT_PUBLIC_MULTISIG_ADDRESS || '',
} as const

/**
 * Token information
 */
export const TOKEN_INFO = {
  KISH: {
    symbol: 'KISH',
    name: 'Kisha Token',
    decimals: 18,
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
  },
} as const

/**
 * Transaction status colors
 */
export const TX_STATUS = {
  pending: '#FFA500',
  success: '#28a745',
  failed: '#dc3545',
} as const

/**
 * Common gas limits
 */
export const GAS_LIMITS = {
  TRANSFER: 21000n,
  TOKEN_TRANSFER: 65000n,
  APPROVE: 46000n,
  SWAP: 150000n,
  MINT: 150000n,
} as const

/**
 * Default slippage tolerance (in basis points, 50 = 0.5%)
 */
export const DEFAULT_SLIPPAGE = 50

/**
 * Maximum gas price (in gwei)
 */
export const MAX_GAS_PRICE = 200n * 10n ** 9n // 200 gwei

