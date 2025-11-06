import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import Card from './Card'
import Badge from './Badge'
import LoadingSpinner from './LoadingSpinner'
import AddressDisplay from './AddressDisplay'
import { formatRelativeTime, formatEther } from '../utils/formatting'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Activity {
  id: string
  type: 'transaction' | 'approval' | 'mint' | 'swap' | 'stake' | 'transfer'
  title: string
  description: string
  hash?: string
  amount?: string
  token?: string
  from?: string
  to?: string
  timestamp: number
  status: 'pending' | 'success' | 'failed'
}

export default function ActivityFeed() {
  const { address, isConnected } = useAccount()
  const [activities, setActivities] = useLocalStorage<Activity[]>('activities', [])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | Activity['type']>('all')

  useEffect(() => {
    if (isConnected && address) {
      loadActivities()
    }
  }, [isConnected, address])

  const loadActivities = async () => {
    setIsLoading(true)
    // In production, fetch from blockchain or API
    setTimeout(() => {
      // Mock activities
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'transaction',
          title: 'Token Transfer',
          description: 'Transferred tokens',
          hash: '0x1234...5678',
          amount: '100',
          token: 'KISH',
          to: '0xabcd...efgh',
          timestamp: Date.now() - 300000,
          status: 'success',
        },
        {
          id: '2',
          type: 'swap',
          title: 'Token Swap',
          description: 'Swapped ETH for KISH',
          hash: '0x5678...9012',
          amount: '1.5',
          token: 'ETH',
          timestamp: Date.now() - 600000,
          status: 'success',
        },
        {
          id: '3',
          type: 'mint',
          title: 'NFT Minted',
          description: 'Minted NFT #123',
          hash: '0x9012...3456',
          timestamp: Date.now() - 900000,
          status: 'success',
        },
      ]
      setActivities(mockActivities)
      setIsLoading(false)
    }, 1000)
  }

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    return activity.type === filter
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transaction': return '📤'
      case 'approval': return '✅'
      case 'mint': return '🎨'
      case 'swap': return '🔄'
      case 'stake': return '💰'
      case 'transfer': return '💸'
      default: return '📋'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'error'
      default: return 'info'
    }
  }

  if (!isConnected) {
    return (
      <Card title="Activity Feed">
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
          Connect your wallet to view activity
        </p>
      </Card>
    )
  }

  return (
    <Card title="Activity Feed">
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['all', 'transaction', 'approval', 'mint', 'swap', 'stake', 'transfer'] as const).map((f) => (
          <Badge
            key={f}
            variant={filter === f ? 'primary' : 'default'}
            style={{ cursor: 'pointer' }}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <LoadingSpinner size="medium" />
        </div>
      ) : filteredActivities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <p>No activity found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              style={{
                padding: '1rem',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                <div style={{ fontSize: '2rem' }}>{getActivityIcon(activity.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
                        {activity.title}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                        {activity.description}
                      </div>
                    </div>
                    <Badge variant={getStatusColor(activity.status)} size="small">
                      {activity.status}
                    </Badge>
                  </div>
                  
                  {activity.amount && (
                    <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                      Amount: {activity.amount} {activity.token || 'ETH'}
                    </div>
                  )}
                  
                  {activity.to && (
                    <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                      To: <AddressDisplay address={activity.to} showCopy={false} />
                    </div>
                  )}
                  
                  {activity.hash && (
                    <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                      Hash: <AddressDisplay address={activity.hash} showCopy={false} />
                    </div>
                  )}
                  
                  <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                    {formatRelativeTime(activity.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

