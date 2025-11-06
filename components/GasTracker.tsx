import { useState, useEffect } from 'react'
import { useFeeData } from 'wagmi'
import Card from './Card'
import StatsCard from './StatsCard'
import LoadingSpinner from './LoadingSpinner'
import Badge from './Badge'
import { formatGasPrice, calculateGasCost } from '../utils/gas'
import { GAS_LIMITS } from '../utils/constants'
import { useInterval } from '../hooks/useInterval'

interface GasEstimate {
  type: string
  gasLimit: bigint
  estimatedCost: string
}

export default function GasTracker() {
  const { data: feeData, isLoading, refetch } = useFeeData()
  const [gasEstimates, setGasEstimates] = useState<GasEstimate[]>([])

  // Refresh gas data every 30 seconds
  useInterval(() => {
    refetch()
  }, 30000)

  useEffect(() => {
    if (!feeData?.gasPrice) return

    const estimates: GasEstimate[] = [
      {
        type: 'Simple Transfer',
        gasLimit: GAS_LIMITS.TRANSFER,
        estimatedCost: calculateGasCost(feeData.gasPrice, GAS_LIMITS.TRANSFER),
      },
      {
        type: 'Token Transfer',
        gasLimit: GAS_LIMITS.TOKEN_TRANSFER,
        estimatedCost: calculateGasCost(feeData.gasPrice, GAS_LIMITS.TOKEN_TRANSFER),
      },
      {
        type: 'Token Approval',
        gasLimit: GAS_LIMITS.APPROVE,
        estimatedCost: calculateGasCost(feeData.gasPrice, GAS_LIMITS.APPROVE),
      },
      {
        type: 'DEX Swap',
        gasLimit: GAS_LIMITS.SWAP,
        estimatedCost: calculateGasCost(feeData.gasPrice, GAS_LIMITS.SWAP),
      },
      {
        type: 'NFT Mint',
        gasLimit: GAS_LIMITS.MINT,
        estimatedCost: calculateGasCost(feeData.gasPrice, GAS_LIMITS.MINT),
      },
    ]

    setGasEstimates(estimates)
  }, [feeData])

  const getGasStatus = (gasPrice?: bigint): 'low' | 'medium' | 'high' => {
    if (!gasPrice) return 'medium'
    const gwei = Number(gasPrice) / 1e9
    if (gwei < 20) return 'low'
    if (gwei < 50) return 'medium'
    return 'high'
  }

  const gasStatus = getGasStatus(feeData?.gasPrice)
  const statusColors = {
    low: { bg: '#e8f5e9', color: '#2e7d32' },
    medium: { bg: '#fff3e0', color: '#e65100' },
    high: { bg: '#ffebee', color: '#c62828' },
  }

  return (
    <Card title="Gas Tracker">
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatsCard
              title="Current Gas Price"
              value={feeData?.gasPrice ? formatGasPrice(feeData.gasPrice) : 'N/A'}
              subtitle="Updated every 30s"
            />
            <StatsCard
              title="Max Fee Per Gas"
              value={feeData?.maxFeePerGas ? formatGasPrice(feeData.maxFeePerGas) : 'N/A'}
              subtitle="EIP-1559"
            />
            <StatsCard
              title="Priority Fee"
              value={feeData?.maxPriorityFeePerGas ? formatGasPrice(feeData.maxPriorityFeePerGas) : 'N/A'}
              subtitle="Tip to miners"
            />
          </div>

          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600 }}>Network Status:</span>
            <Badge
              variant={gasStatus === 'low' ? 'success' : gasStatus === 'medium' ? 'warning' : 'error'}
              size="medium"
            >
              {gasStatus.toUpperCase()} - {gasStatus === 'low' ? 'Good time to transact' : gasStatus === 'medium' ? 'Moderate fees' : 'High fees, consider waiting'}
            </Badge>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
              Estimated Transaction Costs
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Transaction Type</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Gas Limit</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Estimated Cost (ETH)</th>
                  </tr>
                </thead>
                <tbody>
                  {gasEstimates.map((estimate, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '1rem' }}>{estimate.type}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace' }}>
                        {estimate.gasLimit.toString()}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                        {estimate.estimatedCost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
              💡 <strong>Tip:</strong> Gas prices fluctuate based on network congestion. 
              Lower gas prices mean slower confirmation times but lower costs.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}

