import { useState, useMemo } from 'react'
import { useAccount } from 'wagmi'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import LoadingSpinner from './LoadingSpinner'
import { useDebounce } from '../hooks/useDebounce'
import { isValidAddress } from '../utils/validation'
import { formatAddress } from '../utils/formatting'
import { CONTRACT_ADDRESSES, TOKEN_INFO } from '../utils/constants'

interface TokenInfo {
  address: string
  symbol: string
  name: string
  decimals: number
  balance?: string
}

// Mock token database - in production, this would come from an API
const POPULAR_TOKENS: TokenInfo[] = [
  {
    address: CONTRACT_ADDRESSES.KISHA_TOKEN,
    symbol: TOKEN_INFO.KISH.symbol,
    name: TOKEN_INFO.KISH.name,
    decimals: TOKEN_INFO.KISH.decimals,
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    decimals: 8,
  },
]

export default function TokenSearch() {
  const { address } = useAccount()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedToken, setSelectedToken] = useState<TokenInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 500)

  const filteredTokens = useMemo(() => {
    if (!debouncedSearch) return POPULAR_TOKENS

    const query = debouncedSearch.toLowerCase()
    return POPULAR_TOKENS.filter(
      token =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        token.address.toLowerCase().includes(query)
    )
  }, [debouncedSearch])

  const handleSearchByAddress = async () => {
    if (!isValidAddress(searchQuery)) {
      alert('Invalid address format')
      return
    }

    setIsLoading(true)
    // In production, fetch token info from blockchain or API
    setTimeout(() => {
      const foundToken = POPULAR_TOKENS.find(
        t => t.address.toLowerCase() === searchQuery.toLowerCase()
      )
      
      if (foundToken) {
        setSelectedToken(foundToken)
      } else {
        // Mock token info for unknown addresses
        setSelectedToken({
          address: searchQuery,
          symbol: 'UNKNOWN',
          name: 'Unknown Token',
          decimals: 18,
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleSelectToken = (token: TokenInfo) => {
    setSelectedToken(token)
    setSearchQuery(token.address)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
      <Card title="Token Search">
        <div style={{ marginBottom: '1rem' }}>
          <Input
            label="Search by name, symbol, or address"
            placeholder="e.g., USDC, 0xA0b8..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isValidAddress(searchQuery) && (
          <Button
            onClick={handleSearchByAddress}
            fullWidth
            disabled={isLoading}
            style={{ marginBottom: '1rem' }}
          >
            {isLoading ? 'Searching...' : 'Search by Address'}
          </Button>
        )}

        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
            Popular Tokens
          </h3>
          {filteredTokens.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
              No tokens found
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
              {filteredTokens.map((token) => (
                <div
                  key={token.address}
                  onClick={() => handleSelectToken(token)}
                  style={{
                    padding: '1rem',
                    border: selectedToken?.address === token.address ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: selectedToken?.address === token.address ? '#e3f2fd' : 'white',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedToken?.address !== token.address) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedToken?.address !== token.address) {
                      e.currentTarget.style.backgroundColor = 'white'
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1rem' }}>{token.symbol}</div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>{token.name}</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'monospace' }}>
                      {formatAddress(token.address)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {selectedToken && (
        <Card title="Token Details">
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <LoadingSpinner size="medium" />
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Symbol</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedToken.symbol}</div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Name</div>
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{selectedToken.name}</div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Decimals</div>
                <div style={{ fontSize: '1rem', fontFamily: 'monospace' }}>{selectedToken.decimals}</div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Contract Address</div>
                <div style={{ fontSize: '0.875rem', fontFamily: 'monospace', wordBreak: 'break-all', color: '#1976d2' }}>
                  {selectedToken.address}
                </div>
              </div>

              {address && selectedToken.balance && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Your Balance</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    {selectedToken.balance} {selectedToken.symbol}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedToken.address)
                    alert('Address copied to clipboard!')
                  }}
                  variant="outline"
                  fullWidth
                >
                  Copy Address
                </Button>
                <Button
                  onClick={() => {
                    window.open(`https://etherscan.io/address/${selectedToken.address}`, '_blank')
                  }}
                  variant="outline"
                  fullWidth
                >
                  View on Explorer
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

