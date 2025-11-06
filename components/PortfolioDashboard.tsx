import { useMemo } from 'react'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import Card from './Card'
import StatsCard from './StatsCard'
import LoadingSpinner from './LoadingSpinner'
import { useTokenBalance } from '../hooks/useTokenBalance'
import { CONTRACT_ADDRESSES, TOKEN_INFO } from '../utils/constants'
import { formatCurrency, formatTokenAmount } from '../utils/formatting'

interface PortfolioAsset {
  symbol: string
  name: string
  balance: string
  value: number
  address?: string
  type: 'native' | 'token' | 'nft'
}

export default function PortfolioDashboard() {
  const { address, isConnected } = useAccount()
  
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

  const assets: PortfolioAsset[] = useMemo(() => {
    if (!address) return []
    
    const portfolio: PortfolioAsset[] = []
    
    // Add ETH
    if (ethBalance) {
      portfolio.push({
        symbol: 'ETH',
        name: 'Ethereum',
        balance: formatEther(ethBalance.value),
        value: parseFloat(formatEther(ethBalance.value)) * 2000, // Mock price
        type: 'native',
      })
    }
    
    // Add KISH token
    if (tokenBalance) {
      portfolio.push({
        symbol: TOKEN_INFO.KISH.symbol,
        name: TOKEN_INFO.KISH.name,
        balance: formatTokenAmount(tokenBalance, TOKEN_INFO.KISH.decimals),
        value: parseFloat(formatTokenAmount(tokenBalance, TOKEN_INFO.KISH.decimals)) * 0.5, // Mock price
        address: CONTRACT_ADDRESSES.KISHA_TOKEN,
        type: 'token',
      })
    }
    
    return portfolio
  }, [ethBalance, tokenBalance, address])

  const totalValue = useMemo(() => {
    return assets.reduce((sum, asset) => sum + asset.value, 0)
  }, [assets])

  const isLoading = ethLoading || tokenLoading

  if (!isConnected) {
    return (
      <Card title="Portfolio Dashboard">
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          Connect your wallet to view your portfolio
        </p>
      </Card>
    )
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatsCard
          title="Total Portfolio Value"
          value={formatCurrency(totalValue)}
          subtitle={`${assets.length} assets`}
          trend="up"
        />
        <StatsCard
          title="ETH Balance"
          value={ethBalance ? `${formatEther(ethBalance.value).slice(0, 8)} ETH` : '0 ETH'}
          subtitle={ethBalance ? `≈ ${formatCurrency(parseFloat(formatEther(ethBalance.value)) * 2000)}` : ''}
        />
        <StatsCard
          title="Token Balance"
          value={tokenBalance ? `${formatTokenAmount(tokenBalance, TOKEN_INFO.KISH.decimals).slice(0, 8)} ${TOKEN_INFO.KISH.symbol}` : '0'}
          subtitle={tokenBalance ? `≈ ${formatCurrency(parseFloat(formatTokenAmount(tokenBalance, TOKEN_INFO.KISH.decimals)) * 0.5)}` : ''}
        />
      </div>

      <Card title="Assets">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <LoadingSpinner size="medium" />
          </div>
        ) : assets.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No assets found
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Asset</th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Balance</th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Value</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{asset.symbol}</div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>{asset.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace' }}>
                      {parseFloat(asset.balance).toLocaleString(undefined, {
                        maximumFractionDigits: 6,
                      })}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>
                      {formatCurrency(asset.value)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: asset.type === 'native' ? '#e3f2fd' : '#f3e5f5',
                        color: asset.type === 'native' ? '#1976d2' : '#7b1fa2',
                      }}>
                        {asset.type.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

