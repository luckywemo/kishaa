# 🔗 Kisha WalletConnect Integration

A full-stack Web3 application that demonstrates WalletConnect integration with smart contracts using Hardhat, Next.js, and Wagmi.

## 🚀 Features

- **WalletConnect v2 Integration**: Connect with multiple wallets including MetaMask, WalletConnect, and injected wallets
- **Smart Contract Interaction**: Deploy and interact with a SimpleStorage contract
- **Modern UI**: Beautiful, responsive interface built with Next.js
- **Hardhat Integration**: Complete smart contract development environment
- **TypeScript Support**: Full TypeScript support for better development experience

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone and setup the project:**
   ```bash
   cd Kisha
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your WalletConnect Project ID:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
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
├── contracts/              # Smart contracts
│   └── SimpleStorage.sol   # Main contract
├── scripts/                # Deployment scripts
│   └── deploy.js          # Contract deployment
├── test/                   # Contract tests
│   └── SimpleStorage.test.js
├── pages/                  # Next.js pages
│   ├── _app.tsx           # App wrapper with providers
│   └── index.tsx          # Main application page
├── config/                 # Configuration files
│   └── wagmi.ts           # Wagmi configuration
├── styles/                 # CSS styles
│   └── globals.css        # Global styles
├── hardhat.config.js      # Hardhat configuration
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Smart Contracts
- `npm run compile` - Compile contracts
- `npm run test` - Run contract tests
- `npm run deploy:local` - Deploy to local network
- `npm run deploy:sepolia` - Deploy to Sepolia testnet
- `npm run node` - Start local Hardhat node

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
