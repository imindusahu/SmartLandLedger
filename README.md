# SmartLandLedger - Blockchain Land Registration System

A modern, decentralized land registration system built on Ethereum blockchain. Eliminate fraud, improve transparency, and streamline property transfers.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install && cd app && npm install && cd ..

# 2. Start Hardhat network
npm run hardhat:node

# 3. Deploy contracts (in another terminal)
npm run hardhat:deploy

# 4. Start frontend (in another terminal, from app folder)
cd app && npm run dev
```

Visit `http://localhost:3000`

## 🛠 Tech Stack

| Layer | Technology |
|-------|----------|
| **Smart Contracts** | Solidity 0.8.19 |
| **Blockchain Dev** | Hardhat |
| **Frontend** | Next.js 14 + React 18 |
| **Web3 Library** | Ethers.js v6 |
| **Local Network** | Hardhat Network |
| **Wallet** | MetaMask |

## 📋 Features

### Seller Dashboard
- Register new land properties
- Manage owned lands
- Approve buyer requests
- Track transaction history

### Buyer Dashboard
- Browse available verified lands
- Request land purchases
- Make secure payments
- View owned properties

### Inspector Dashboard
- Verify land authenticity
- Approve land registrations
- Review pending transactions
- Maintain registry integrity

### Public Land Registry
- Search lands by location
- Filter by verification status
- View full land details
- Transparent transaction history

## 📁 Project Structure

```
SmartLandLedger/
├── contracts/              # Smart contracts (Solidity)
│   ├── Land.sol           # Main land registry contract
│   └── Migrations.sol
├── app/                   # Next.js frontend
│   ├── pages/            # Dashboard pages
│   ├── public/           # Static assets & contract ABIs
│   └── styles/           # CSS modules
├── scripts/              # Deployment scripts
├── test/                 # Contract tests
├── hardhat.config.js     # Hardhat configuration
└── package.json          # Dependencies
```

## 🔧 Available Commands

```bash
# Hardhat
npm run hardhat:compile    # Compile contracts
npm run hardhat:test       # Run tests
npm run hardhat:node       # Start local network
npm run hardhat:deploy     # Deploy contracts

# Frontend
cd app && npm run dev      # Start development server
cd app && npm run build    # Build for production
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Detailed setup guide
- **[DEMONSTRATION_GUIDE.md](DEMONSTRATION_GUIDE.md)** - How to demonstrate the system
- **[DASHBOARD_GUIDE.md](DASHBOARD_GUIDE.md)** - Dashboard user guide

## 🎯 How It Works

1. **Land Registration**: Sellers register property details on the blockchain
2. **Verification**: Inspectors verify land authenticity
3. **Purchase Request**: Buyers request to purchase verified lands
4. **Payment**: Buyers transfer ETH to the smart contract
5. **Ownership Transfer**: Smart contract automatically transfers ownership
6. **All transactions recorded immutably on blockchain**

## 🔐 Key Benefits

- ✅ **Immutable Records**: All transactions permanently recorded
- ✅ **Transparent**: Complete transaction history visible
- ✅ **Secure**: Cryptographic security prevents fraud
- ✅ **Efficient**: Eliminates intermediaries
- ✅ **Accessible**: Anyone can verify ownership anytime

## 🧪 Testing

Run the test suite:
```bash
npm run hardhat:test
```

## 🌐 Blockchain Details

- **Network**: Hardhat Local (for development)
- **Chain ID**: 31337
- **RPC URL**: http://127.0.0.1:8545
- **Currency**: ETH

### Test Accounts
The Hardhat network provides 20 test accounts with pre-loaded ETH. When running `npm run hardhat:node`, the accounts and private keys are displayed in the console.

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

This project is open for contributions. Feel free to submit issues and pull requests.

## 📖 References

- [Hardhat Documentation](https://hardhat.org/)
- [Next.js Documentation](https://nextjs.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [MetaMask Documentation](https://docs.metamask.io/)

---

**SmartLandLedger**: Making land registration transparent, secure, and accessible.

