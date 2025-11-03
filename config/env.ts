/**
 * Environment configuration
 */
export const env = {
  // WalletConnect
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  
  // Contract Addresses
  simpleStorageAddress: process.env.NEXT_PUBLIC_SIMPLE_STORAGE_ADDRESS || '',
  kishaTokenAddress: process.env.NEXT_PUBLIC_KISHA_TOKEN_ADDRESS || '',
  kishaNFTAddress: process.env.NEXT_PUBLIC_KISHA_NFT_ADDRESS || '',
  ammAddress: process.env.NEXT_PUBLIC_AMM_ADDRESS || '',
  multisigAddress: process.env.NEXT_PUBLIC_MULTISIG_ADDRESS || '',
  
  // API URLs
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  
  // Feature Flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Analytics (if needed)
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
} as const

/**
 * Validate required environment variables
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const required = [
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
  ]
  
  const missing: string[] = []
  
  required.forEach(key => {
    if (!process.env[key]) {
      missing.push(key)
    }
  })
  
  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * Get environment info for debugging
 */
export function getEnvInfo() {
  return {
    nodeEnv: process.env.NODE_ENV,
    hasWalletConnect: !!env.walletConnectProjectId,
    contractAddresses: {
      simpleStorage: env.simpleStorageAddress || 'Not set',
      kishaToken: env.kishaTokenAddress || 'Not set',
      kishaNFT: env.kishaNFTAddress || 'Not set',
      amm: env.ammAddress || 'Not set',
    },
  }
}

