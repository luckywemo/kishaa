# 🔗 Kisha WalletConnect Integration

A production-ready full-stack Web3 application featuring WalletConnect integration, multiple smart contracts, and a comprehensive component library built with Hardhat, Next.js, Wagmi, and TypeScript.

## 🚀 Features

### Core Features
- **WalletConnect v2 Integration**: Connect with multiple wallets (MetaMask, WalletConnect, Coinbase, etc.)
- **Multiple Smart Contracts**: 
  - SimpleStorage (basic storage & ETH deposits)
  - KishaToken (ERC20 token)
  - KishaNFT (ERC721 NFT collection)
  - SimpleAMM (Decentralized exchange)
  - MultiSigWallet (Multi-signature wallet)
- **Modern UI Components**: 35+ reusable components with beautiful styling
- **Custom Hooks**: 37+ React hooks for Web3 interactions
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Comprehensive error boundaries and user-friendly messages

### Advanced Features
- **Network Switching**: Support for multiple chains with automatic switching
- **Transaction History**: Track and display transaction history
- **Token Management**: Transfer, approve, and manage ERC20 tokens
- **DEX Operations**: Swap tokens and manage liquidity
- **NFT Management**: Mint, view, and transfer NFTs
- **Settings**: Configurable slippage, transaction deadlines, and auto-connect
- **SEO Optimized**: Built-in SEO components and metadata management
- **Performance**: Optimized with throttling, debouncing, and memoization

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Git
- WalletConnect Project ID ([Get one here](https://cloud.walletconnect.com))

## 🛠️ Installation

1. **Clone and setup the project:**
   ```bash
   cd Kisha
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   # Or manually create .env.local with:
   ```
   
   Edit `.env.local` and add your WalletConnect Project ID:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```
   
   **Check your environment setup:**
   ```bash
   npm run check-env
   ```

3. **Get a WalletConnect Project ID:**
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
   - Create a new project
   - Copy the Project ID to your `.env.local` file

## 🏃‍♂️ Quick Start

### 1. Start the Hardhat Local Network
```bash
npm run node
```
This starts a local Hardhat network on `http://127.0.0.1:8545`

### 2. Deploy the Smart Contract (in a new terminal)
```bash
npm run deploy:local
```
This deploys the SimpleStorage contract to the local network.

### 3. Update Contract Address
Copy the deployed contract address from the terminal output and update it in `pages/index.tsx`:
```typescript
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'
```

### 4. Start the Frontend
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### Connecting Your Wallet
1. Click on any wallet button (MetaMask, WalletConnect, etc.)
2. Follow the connection prompts in your wallet
3. Once connected, you'll see your account information

### Interacting with the Smart Contract
- **Store Data**: Enter a number and click "Store Data" to save it to the contract
- **Deposit ETH**: Send ETH to the contract by entering an amount and clicking "Deposit ETH"
- **View Data**: The stored data and contract balance are automatically displayed

## 🏗️ Project Structure

```
Kisha/
├── contracts/              # Smart contracts (Solidity 0.8.19)
│   ├── SimpleStorage.sol
│   ├── KishaToken.sol
│   ├── KishaNFT.sol
│   ├── SimpleAMM.sol
│   └── MultiSigWallet.sol
├── scripts/                # Deployment & utility scripts
│   ├── deploy.js
│   ├── deploy-tokens.js
│   ├── deploy-all.js
│   ├── update-contracts.js
│   └── check-env.js
├── test/                   # Contract tests
│   └── *.test.js
├── pages/                  # Next.js pages
│   ├── _app.tsx           # App wrapper with providers
│   ├── _document.tsx      # Custom document
│   ├── index.tsx          # Homepage
│   ├── examples.tsx       # Component examples
│   ├── status.tsx         # Status page
│   ├── settings.tsx       # Settings page
│   ├── 404.tsx            # Custom 404
│   ├── sitemap.xml.tsx    # Sitemap
│   └── api/               # API routes
│       └── health.ts
├── components/             # React components (35+)
│   ├── WalletConnect.tsx
│   ├── TokenManager.tsx
│   ├── DEXManager.tsx
│   ├── NFTManager.tsx
│   ├── Layout.tsx
│   ├── SEO.tsx
│   └── ... (30+ more)
├── hooks/                  # Custom React hooks (37+)
│   ├── useContractRead.ts
│   ├── useContractWrite.ts
│   ├── useTokenBalance.ts
│   └── ... (30+ more)
├── utils/                  # Utility functions
│   ├── formatting.ts
│   ├── constants.ts
│   ├── contracts.ts
│   └── ... (15+ more)
├── abis/                   # Contract ABIs
├── config/                 # Configuration
│   ├── wagmi.ts
│   └── env.ts
├── context/                # React context
│   └── Web3Context.tsx
├── lib/                    # Library utilities
│   └── utils.ts
├── styles/
│   └── globals.css        # Global styles
├── public/                 # Static assets
│   └── robots.txt
├── examples/               # Example code
│   └── ExampleUsage.tsx
├── hardhat.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run check-env` - Verify environment variables

### Smart Contracts
- `npm run compile` - Compile contracts
- `npm run test` - Run contract tests
- `npm run test:coverage` - Run tests with coverage
- `npm run deploy:local` - Deploy SimpleStorage to local network
- `npm run deploy:tokens` - Deploy tokens to local network
- `npm run deploy:all` - Deploy all contracts to local network
- `npm run deploy:sepolia` - Deploy to Sepolia testnet
- `npm run deploy:all:sepolia` - Deploy all contracts to Sepolia
- `npm run node` - Start local Hardhat node
- `npm run clean` - Clean build artifacts
- `npm run verify:sepolia` - Verify contracts on Etherscan

## 🌐 Network Configuration

The app is configured to work with:
- **Hardhat Local Network** (Chain ID: 31337)
- **Ethereum Mainnet** (Chain ID: 1)
- **Sepolia Testnet** (Chain ID: 11155111)

### Adding More Networks
Edit `config/wagmi.ts` to add more networks:

```typescript
import { polygon, arbitrum } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia, hardhat, polygon, arbitrum],
  // ... rest of config
})
```

## 🚀 Deployment

### Deploy to Sepolia Testnet

1. **Get Sepolia ETH:**
   - Use [Sepolia Faucet](https://sepoliafaucet.com/)
   - Or [Alchemy Faucet](https://sepoliafaucet.com/)

2. **Update environment variables:**
   ```env
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   PRIVATE_KEY=your_private_key_here
   ```

3. **Deploy:**
   ```bash
   npm run deploy:sepolia
   ```

### Deploy Frontend

Deploy to Vercel, Netlify, or any static hosting service:

```bash
npm run build
npm run start
```

## 🧪 Testing

Run the smart contract tests:
```bash
npm run test
```

Run frontend tests (if you add them):
```bash
npm run test:frontend
```

## 🔐 Security Notes

- Never commit private keys to version control
- Use environment variables for sensitive data
- Test thoroughly on testnets before mainnet deployment
- Consider using hardware wallets for production

## 🐛 Troubleshooting

### Common Issues

1. **"Project ID not found" error:**
   - Make sure you've set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local`
   - Restart the development server after adding environment variables

2. **Contract not found:**
   - Make sure you've deployed the contract and updated the address
   - Check that you're on the correct network

3. **Transaction fails:**
   - Ensure you have enough ETH for gas fees
   - Check that the contract address is correct
   - Verify you're connected to the right network

### Getting Help

- Check the [WalletConnect Documentation](https://docs.walletconnect.com/)
- Review [Wagmi Documentation](https://wagmi.sh/)
- Consult [Hardhat Documentation](https://hardhat.org/docs)

## 📚 Learn More

- [WalletConnect Cloud](https://cloud.walletconnect.com/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Building! 🚀**
