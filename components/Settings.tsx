import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_SLIPPAGE } from '../utils/constants'

interface SettingsProps {
  onClose?: () => void
}

export default function Settings({ onClose }: SettingsProps) {
  const [slippage, setSlippage] = useLocalStorage('slippageTolerance', DEFAULT_SLIPPAGE)
  const [transactionDeadline, setTransactionDeadline] = useLocalStorage('txDeadline', 20) // minutes
  const [autoConnect, setAutoConnect] = useLocalStorage('autoConnect', false)

  const handleSlippageChange = (value: string) => {
    const num = parseInt(value)
    if (!isNaN(num) && num >= 0 && num <= 5000) {
      setSlippage(num)
    }
  }

  return (
    <div className="settings-modal">
      <div className="settings-content">
        <div className="settings-header">
          <h3>⚙️ Settings</h3>
          {onClose && (
            <button onClick={onClose} className="close-button">
              ✕
            </button>
          )}
        </div>

        <div className="settings-section">
          <h4>Slippage Tolerance</h4>
          <p className="setting-description">
            Your transaction will revert if the price changes unfavorably by more than this percentage.
          </p>
          <div className="slippage-input-group">
            <input
              type="number"
              value={slippage / 100} // Convert from basis points to percentage
              onChange={(e) => handleSlippageChange((parseFloat(e.target.value) * 100).toString())}
              min="0"
              max="50"
              step="0.1"
              className="slippage-input"
            />
            <span className="slippage-unit">%</span>
          </div>
          <div className="slippage-presets">
            <button
              onClick={() => setSlippage(50)} // 0.5%
              className={`preset-btn ${slippage === 50 ? 'active' : ''}`}
            >
              0.5%
            </button>
            <button
              onClick={() => setSlippage(100)} // 1%
              className={`preset-btn ${slippage === 100 ? 'active' : ''}`}
            >
              1%
            </button>
            <button
              onClick={() => setSlippage(300)} // 3%
              className={`preset-btn ${slippage === 300 ? 'active' : ''}`}
            >
              3%
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h4>Transaction Deadline</h4>
          <p className="setting-description">
            Transactions that are pending longer than this time will be considered failed.
          </p>
          <div className="deadline-input-group">
            <input
              type="number"
              value={transactionDeadline}
              onChange={(e) => setTransactionDeadline(parseInt(e.target.value) || 20)}
              min="5"
              max="60"
              className="deadline-input"
            />
            <span className="deadline-unit">minutes</span>
          </div>
        </div>

        <div className="settings-section">
          <h4>Wallet Settings</h4>
          <label className="setting-checkbox">
            <input
              type="checkbox"
              checked={autoConnect}
              onChange={(e) => setAutoConnect(e.target.checked)}
            />
            <span>Auto-connect wallet on page load</span>
          </label>
        </div>

        <div className="settings-footer">
          <button onClick={onClose} className="save-button">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

