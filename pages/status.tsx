import Head from 'next/head'
import { useEffect, useState } from 'react'
import Card from '../components/Card'
import Alert from '../components/Alert'
import { useWeb3 } from '../context/Web3Context'
import Button from '../components/Button'

export default function StatusPage() {
  const { chainId, address, isConnected } = useWeb3()
  const [health, setHealth] = useState<{ status: string; timestamp: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchHealth = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/health')
      if (!res.ok) throw new Error('Health check failed')
      const data = await res.json()
      setHealth(data)
    } catch (e: any) {
      setError(e?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  return (
    <>
      <Head>
        <title>Status | Kisha</title>
      </Head>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Application Status</h1>

        <Card title="Health">
          {error && <Alert variant="error">{error}</Alert>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <div>Status: {health?.status || (loading ? 'Loading...' : 'Unknown')}</div>
              <div>Timestamp: {health?.timestamp ? new Date(health.timestamp).toLocaleString() : '-'}</div>
            </div>
            <Button onClick={fetchHealth} isLoading={loading}>Refresh</Button>
          </div>
        </Card>

        <Card title="Web3">
          <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
          <div>Address: {address || '-'}</div>
          <div>Chain ID: {chainId ?? '-'}</div>
        </Card>
      </div>
    </>
  )
}
