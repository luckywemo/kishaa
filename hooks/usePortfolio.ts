import { useMemo } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { useTokenBalance } from './useTokenBalance'
import { CONTRACT_ADDRESSES, TOKEN_INFO } from '../utils/constants'
import { formatTokenAmount } from '../utils/formatting'

export interface PortfolioAsset {
  symbol: string
  name: string
  balance: string
  value: number
  address?: string
  type: 'native' | 'token' | 'nft'
}

export interface PortfolioData {
  assets: PortfolioAsset[]
  totalValue: number
  isLoading: boolean
}

/**
 * Hook to get user's portfolio data
 */
export function usePortfolio(tokenPrices?: Record<string, number>): PortfolioData {
  const { address } = useAccount()
  
  // Get ETH balance
  const { data: ethBalance, isLoading: ethLoading } = useBalance({
    address: address as `0x${string}`,
    enabled: !!address,
  })

  // Get token balance
  const { balance: tokenBalance, isLoading: tokenLoading } = useTokenBalance({
    tokenAddress: CONTRACT_ADDRESSES.KISHA_TOKEN,
    userAddress: address || '',
    enabled: !!address,
  })

  const portfolio = useMemo(() => {
    if (!address) return { assets: [], totalValue: 0, isLoading: ethLoading || tokenLoading }

    const assets: PortfolioAsset[] = []
    
    // Add ETH
    if (ethBalance) {
      const ethPrice = tokenPrices?.ETH || 2000 // Default mock price
      const balance = parseFloat(formatEther(ethBalance.value))
      assets.push({
        symbol: 'ETH',
        name: 'Ethereum',
        balance: formatEther(ethBalance.value),
        value: balance * ethPrice,
        type: 'native',
      })
    }
    
    // Add KISH token
    if (tokenBalance) {
      const tokenPrice = tokenPrices?.KISH || 0.5 // Default mock price
      const balance = parseFloat(formatTokenAmount(tokenBalance, TOKEN_INFO.KISH.decimals))
      assets.push({
        symbol: TOKEN_INFO.KISH.symbol,
        name: TOKEN_INFO.KISH.name,
        balance: formatTokenAmount(tokenBalance, TOKEN_INFO.KISH.decimals),
        value: balance * tokenPrice,
        address: CONTRACT_ADDRESSES.KISHA_TOKEN,
        type: 'token',
      })
    }
    
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)
    
    return {
      assets,
      totalValue,
      isLoading: ethLoading || tokenLoading,
    }
  }, [ethBalance, tokenBalance, address, ethLoading, tokenLoading, tokenPrices])

  return portfolio
}

