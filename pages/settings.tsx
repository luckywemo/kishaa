import Head from 'next/head'
import Settings from '../components/Settings'
import Card from '../components/Card'

export default function SettingsPage() {
  return (
    <>
      <Head>
        <title>Settings | Kisha</title>
      </Head>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem' }}>
        <Card title="Settings">
          <Settings />
        </Card>
      </div>
    </>
  )
}
