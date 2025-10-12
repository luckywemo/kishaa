import { createConfig, http } from 'wagmi'
import { walletConnect, injected, metaMask } from 'wagmi/connectors'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'

// Get projectId from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id'

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId,
      metadata: {
        name: 'Kisha WalletConnect App',
        description: 'WalletConnect integration example',
        url: 'https://localhost:3000',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    })
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
