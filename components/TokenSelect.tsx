import { useState } from 'react'

interface Token {
  address: string
  symbol: string
  name: string
  logo?: string
}

interface TokenSelectProps {
  tokens: Token[]
  selectedToken?: Token
  onSelect: (token: Token) => void
  label?: string
  disabled?: boolean
}

export default function TokenSelect({
  tokens,
  selectedToken,
  onSelect,
  label,
  disabled,
}: TokenSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="token-select-wrapper">
      {label && <label className="token-select-label">{label}</label>}
      <div className="token-select-container">
        <button
          type="button"
          className="token-select-button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          {selectedToken ? (
            <div className="token-select-selected">
              {selectedToken.logo && (
                <img src={selectedToken.logo} alt={selectedToken.symbol} className="token-logo" />
              )}
              <span className="token-symbol">{selectedToken.symbol}</span>
            </div>
          ) : (
            <span className="token-select-placeholder">Select token</span>
          )}
          <span className="token-select-arrow">▼</span>
        </button>

        {isOpen && (
          <div className="token-select-dropdown">
            {tokens.map((token) => (
              <button
                key={token.address}
                type="button"
                className={`token-select-option ${
                  selectedToken?.address === token.address ? 'selected' : ''
                }`}
                onClick={() => {
                  onSelect(token)
                  setIsOpen(false)
                }}
              >
                {token.logo && (
                  <img src={token.logo} alt={token.symbol} className="token-logo" />
                )}
                <div className="token-info">
                  <span className="token-symbol">{token.symbol}</span>
                  <span className="token-name">{token.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

