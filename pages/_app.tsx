import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../config/wagmi'
import Toast from '../components/Toast'
import { Web3Provider } from '../context/Web3Context'
import ErrorBoundary from '../components/ErrorBoundary'
import Layout from '../components/Layout'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Web3Provider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <Toast />
          </Web3Provider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  )
}
