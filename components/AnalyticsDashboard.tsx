import { useState, useMemo } from 'react'
import { useAccount } from 'wagmi'
import Card from './Card'
import StatsCard from './StatsCard'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatCurrency, formatDate } from '../utils/formatting'

interface Transaction {
  hash: string
  type: string
  amount?: string
  timestamp: number
  status: 'success' | 'failed' | 'pending'
}

export default function AnalyticsDashboard() {
  const { address, isConnected } = useAccount()
  const [transactions] = useLocalStorage<Transaction[]>('transactions', [])

  const userTransactions = useMemo(() => {
    if (!address) return []
    // Filter transactions for current user (in a real app, you'd filter by address)
    return transactions.filter(tx => tx.status === 'success')
  }, [transactions, address])

  const analytics = useMemo(() => {
    const totalTransactions = userTransactions.length
    const successfulTransactions = userTransactions.filter(tx => tx.status === 'success').length
    const failedTransactions = userTransactions.filter(tx => tx.status === 'failed').length
    const pendingTransactions = userTransactions.filter(tx => tx.status === 'pending').length

    const transactionTypes = userTransactions.reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const totalVolume = userTransactions.reduce((sum, tx) => {
      return sum + (parseFloat(tx.amount || '0'))
    }, 0)

    // Calculate transactions by day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toISOString().split('T')[0],
        count: 0,
      }
    })

    userTransactions.forEach(tx => {
      const txDate = new Date(tx.timestamp).toISOString().split('T')[0]
      const dayData = last7Days.find(d => d.date === txDate)
      if (dayData) {
        dayData.count++
      }
    })

    return {
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      pendingTransactions,
      successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0,
      transactionTypes,
      totalVolume,
      last7Days,
    }
  }, [userTransactions])

  if (!isConnected) {
    return (
      <Card title="Analytics Dashboard">
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          Connect your wallet to view analytics
        </p>
      </Card>
    )
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatsCard
          title="Total Transactions"
          value={analytics.totalTransactions.toString()}
          subtitle={`${analytics.successfulTransactions} successful`}
        />
        <StatsCard
          title="Success Rate"
          value={`${analytics.successRate.toFixed(1)}%`}
          subtitle={`${analytics.failedTransactions} failed`}
          trend={analytics.successRate > 90 ? 'up' : analytics.successRate > 70 ? 'neutral' : 'down'}
        />
        <StatsCard
          title="Total Volume"
          value={formatCurrency(analytics.totalVolume)}
          subtitle="All transactions"
        />
        <StatsCard
          title="Pending"
          value={analytics.pendingTransactions.toString()}
          subtitle="Awaiting confirmation"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Card title="Transaction Types">
          {Object.keys(analytics.transactionTypes).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
              No transaction data available
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(analytics.transactionTypes).map(([type, count]) => (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{type}</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1976d2' }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Activity (Last 7 Days)">
          {analytics.last7Days.every(day => day.count === 0) ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
              No activity in the last 7 days
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {analytics.last7Days.map((day, index) => {
                const maxCount = Math.max(...analytics.last7Days.map(d => d.count), 1)
                const percentage = (day.count / maxCount) * 100
                const date = new Date(day.date)
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#666' }}>
                        {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span style={{ fontWeight: 600 }}>{day.count}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: '#1976d2',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      <Card title="Recent Transactions">
        {userTransactions.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No transactions found
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {userTransactions.slice(0, 10).map((tx, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{tx.type}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace' }}>
                      {tx.amount ? formatCurrency(parseFloat(tx.amount)) : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>{formatDate(new Date(tx.timestamp))}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: tx.status === 'success' ? '#e8f5e9' : tx.status === 'failed' ? '#ffebee' : '#fff3e0',
                        color: tx.status === 'success' ? '#2e7d32' : tx.status === 'failed' ? '#c62828' : '#e65100',
                      }}>
                        {tx.status.toUpperCase()}
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

