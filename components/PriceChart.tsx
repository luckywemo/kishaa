import { useState, useEffect } from 'react'
import Card from './Card'
import Dropdown from './Dropdown'
import LoadingSpinner from './LoadingSpinner'
import { formatCurrency } from '../utils/formatting'
import { CONTRACT_ADDRESSES, TOKEN_INFO } from '../utils/constants'

interface PriceData {
  timestamp: number
  price: number
}

interface TokenPrice {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  history: PriceData[]
}

// Mock price data - in production, fetch from an API like CoinGecko, CoinMarketCap, etc.
const MOCK_PRICES: Record<string, TokenPrice> = {
  ETH: {
    symbol: 'ETH',
    price: 2000,
    change24h: 2.5,
    volume24h: 1000000000,
    history: Array.from({ length: 30 }, (_, i) => ({
      timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
      price: 2000 + Math.random() * 200 - 100,
    })),
  },
  KISH: {
    symbol: 'KISH',
    price: 0.5,
    change24h: -1.2,
    volume24h: 500000,
    history: Array.from({ length: 30 }, (_, i) => ({
      timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
      price: 0.5 + Math.random() * 0.1 - 0.05,
    })),
  },
  USDC: {
    symbol: 'USDC',
    price: 1.0,
    change24h: 0.01,
    volume24h: 2000000000,
    history: Array.from({ length: 30 }, (_, i) => ({
      timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
      price: 1.0 + Math.random() * 0.002 - 0.001,
    })),
  },
}

export default function PriceChart() {
  const [selectedToken, setSelectedToken] = useState<string>('ETH')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isLoading, setIsLoading] = useState(false)

  const tokenPrice = MOCK_PRICES[selectedToken] || MOCK_PRICES.ETH

  useEffect(() => {
    // In production, fetch price data based on timeRange
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [selectedToken, timeRange])

  const maxPrice = Math.max(...tokenPrice.history.map(d => d.price))
  const minPrice = Math.min(...tokenPrice.history.map(d => d.price))
  const priceRange = maxPrice - minPrice

  const tokenOptions = [
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'KISH', label: 'Kisha Token (KISH)' },
    { value: 'USDC', label: 'USD Coin (USDC)' },
  ]

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ]

  return (
    <Card title="Price Chart">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Dropdown
            label="Select Token"
            options={tokenOptions}
            value={selectedToken}
            onChange={(value) => setSelectedToken(value)}
          />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Dropdown
            label="Time Range"
            options={timeRangeOptions}
            value={timeRange}
            onChange={(value) => setTimeRange(value as typeof timeRange)}
          />
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>Current Price</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrency(tokenPrice.price)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>24h Change</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: tokenPrice.change24h >= 0 ? '#2e7d32' : '#c62828',
              }}>
                {tokenPrice.change24h >= 0 ? '+' : ''}{tokenPrice.change24h.toFixed(2)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>24h Volume</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatCurrency(tokenPrice.volume24h)}</div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              height: '300px',
              position: 'relative',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: '#fafafa',
            }}>
              <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1976d2" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#1976d2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Chart area */}
                <path
                  d={`M ${tokenPrice.history.map((point, index) => {
                    const x = (index / (tokenPrice.history.length - 1)) * 100
                    const y = 100 - ((point.price - minPrice) / priceRange) * 80 - 10
                    return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`
                  }).join(' ')}`}
                  fill="none"
                  stroke="#1976d2"
                  strokeWidth="2"
                />
                {/* Area under curve */}
                <path
                  d={`M ${tokenPrice.history.map((point, index) => {
                    const x = (index / (tokenPrice.history.length - 1)) * 100
                    const y = 100 - ((point.price - minPrice) / priceRange) * 80 - 10
                    return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`
                  }).join(' ')} L 100% 90% L 0% 90% Z`}
                  fill="url(#priceGradient)"
                />
              </svg>
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                fontSize: '0.75rem',
                color: '#666',
              }}>
                {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
              </div>
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
              💡 <strong>Note:</strong> This is mock price data. In production, integrate with a real price API like CoinGecko or CoinMarketCap.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}

