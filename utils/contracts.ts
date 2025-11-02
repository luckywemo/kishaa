import { CONTRACT_ADDRESSES } from './constants'

/**
 * Get contract address by name
 */
export function getContractAddress(name: keyof typeof CONTRACT_ADDRESSES): string {
  return CONTRACT_ADDRESSES[name] || ''
}

/**
 * Validate contract addresses
 */
export function validateContractAddresses(): {
  valid: boolean
  missing: string[]
} {
  const missing: string[] = []
  
  Object.entries(CONTRACT_ADDRESSES).forEach(([name, address]) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      missing.push(name)
    }
  })

  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * Get ABI file path (if storing ABIs in files)
 */
export function getABIPath(contractName: string): string {
  return `/abis/${contractName}.json`
}

