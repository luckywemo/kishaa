import Head from 'next/head'
import { useState } from 'react'
import { Web3Example, TokenOperationsExample, ModalExample, ReadContractExample } from '../examples/ExampleUsage'
import Dropdown from '../components/Dropdown'
import Tabs from '../components/Tabs'
import Card from '../components/Card'
import Alert from '../components/Alert'
import Button from '../components/Button'

export default function ExamplesPage() {
  const [dropdownValue, setDropdownValue] = useState<string | undefined>()

  const tabs = [
    {
      id: 'wallet',
      label: 'Wallet',
      content: <Web3Example />,
    },
    {
      id: 'token',
      label: 'Token',
      content: <TokenOperationsExample />,
    },
    {
      id: 'modal',
      label: 'Modal',
      content: <ModalExample />,
    },
    {
      id: 'read',
      label: 'Read Contract',
      content: <ReadContractExample />,
    },
  ]

  return (
    <>
      <Head>
        <title>Examples | Kisha</title>
        <meta name="description" content="Examples of components and hooks" />
      </Head>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Component & Hook Examples</h1>
        <p style={{ marginBottom: '1.5rem', color: '#555' }}>
          This page showcases common UI components and Web3 hooks used across the app.
        </p>

        <Card title="Alerts">
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <Alert variant="info">Informational message</Alert>
            <Alert variant="success">Success message</Alert>
            <Alert variant="warning">Warning message</Alert>
            <Alert variant="error">Error message</Alert>
          </div>
        </Card>

        <Card title="Dropdown">
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <Dropdown
              label="Network"
              placeholder="Select a network"
              value={dropdownValue}
              onChange={setDropdownValue as (v: string) => void}
              options={[
                { value: '1', label: 'Ethereum', icon: '⛓️' },
                { value: '137', label: 'Polygon', icon: '🟣' },
                { value: '10', label: 'Optimism', icon: '🔴' },
                { value: '8453', label: 'Base', icon: '🟦' },
              ]}
            />
            <div>Selected: {dropdownValue || 'None'}</div>
          </div>
        </Card>

        <Card title="Tabs">
          <Tabs tabs={tabs} variant="underline" />
        </Card>

        <div style={{ marginTop: '2rem' }}>
          <Alert variant="info">
            Tip: Use your wallet to interact with the examples. If not connected, you'll see a prompt.
          </Alert>
          <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</Button>
        </div>
      </div>
    </>
  )
}
