/**
 * API utility functions for fetching blockchain data
 */

interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

/**
 * Fetch transaction from block explorer API
 */
export async function fetchTransaction(
  hash: string,
  chainId: number
): Promise<ApiResponse<any>> {
  try {
    const explorerUrl = getExplorerApiUrl(chainId)
    if (!explorerUrl) {
      return { success: false, error: 'Explorer API not available for this chain' }
    }

    const response = await fetch(`${explorerUrl}/api?module=proxy&action=eth_getTransactionByHash&txhash=${hash}`)
    const data = await response.json()
    
    if (data.status === '1' && data.result) {
      return { success: true, data: data.result }
    }
    
    return { success: false, error: 'Transaction not found' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Fetch address transactions
 */
export async function fetchAddressTransactions(
  address: string,
  chainId: number,
  limit = 10
): Promise<ApiResponse<any[]>> {
  try {
    const explorerUrl = getExplorerApiUrl(chainId)
    if (!explorerUrl) {
      return { success: false, error: 'Explorer API not available for this chain' }
    }

    const response = await fetch(
      `${explorerUrl}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc`
    )
    const data = await response.json()
    
    if (data.status === '1' && data.result) {
      return { success: true, data: data.result }
    }
    
    return { success: false, error: 'Failed to fetch transactions' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get explorer API URL for chain
 */
function getExplorerApiUrl(chainId: number): string | null {
  const urls: Record<number, string> = {
    1: 'https://api.etherscan.io',
    11155111: 'https://api-sepolia.etherscan.io',
  }
  return urls[chainId] || null
}

/**
 * Fetch token price (example - would need actual API key)
 */
export async function fetchTokenPrice(
  tokenAddress: string,
  chainId: number
): Promise<ApiResponse<number>> {
  // This is a placeholder - you'd integrate with CoinGecko, CoinMarketCap, etc.
  return { success: false, error: 'Token price API not configured' }
}

/**
 * Fetch NFT metadata
 */
export async function fetchNFTMetadata(tokenURI: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(tokenURI)
    const data = await response.json()
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

