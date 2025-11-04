import Link from 'next/link'
import Head from 'next/head'
import Button from '../components/Button'

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>404 | Page Not Found</title>
      </Head>
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          The page you are looking for does not exist or was moved.
        </p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </>
  )
}
