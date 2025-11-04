import Link from 'next/link'
import { ReactNode } from 'react'
import ChainIndicator from './ChainIndicator'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-root">
      <header className="app-header">
        <div className="container header-inner">
          <Link href="/" className="brand">
            Kisha
          </Link>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/examples">Examples</Link>
            <Link href="/status">Status</Link>
            <Link href="/settings">Settings</Link>
          </nav>
          <ChainIndicator />
        </div>
      </header>
      <main className="app-main container">{children}</main>
      <footer className="app-footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} Kisha</span>
          <span>
            <a href="https://walletconnect.com" target="_blank" rel="noreferrer">
              WalletConnect
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
