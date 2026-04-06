# Land Registration System - Quick Start Guide

## 🚀 Project Successfully Modernized!

This project has been upgraded to a modern blockchain stack:
- **Smart Contracts:** Hardhat + Solidity 0.8.19
- **Frontend:** Next.js 14 + React 18
- **Blockchain Library:** Ethers.js v6

See `MODERNIZATION.md` for detailed upgrade information.

---

## ⚙️ Prerequisites

- Node.js v18+ (`nvm use 18.20.8`)
- MetaMask browser extension (for frontend)

---

## 🏃 Quick Start (5 minutes)

### 1. **Compile Smart Contracts**
```bash
npm run hardhat:compile
```
✅ Contracts compile successfully with only minor warnings (safe to ignore)

### 2. **Start Local Blockchain**
Open a terminal and run:
```bash
npm run hardhat:node
```
This starts a local Ethereum network at `http://127.0.0.1:8545`

### 3. **Deploy Contracts** (in another terminal)
```bash
npm run hardhat:deploy
```
Contracts deploy and address is saved to `contract-addresses.json`

### 4. **Start Frontend** (in another terminal)
```bash
npm run app:dev
```
Open http://localhost:3000 in your browser

---

## 🔗 Or Run Everything Together
```bash
npm run dev
```
Runs Hardhat node + Next.js frontend simultaneously

---

## 📝 Project Files

### Smart Contracts
- `contracts/Land.sol` - Main land registration contract
- `contracts/Migrations.sol` - Deployment helper
- `scripts/deploy.js` - Deployment script
- `test/land.js` - Smart contract tests

### Frontend
- `app/pages/index.js` - Home page (dashboard)
- `app/styles/` - CSS modules
- `app/pages/_app.js` - App wrapper

### Configuration
- `hardhat.config.js` - Hardhat settings
- `app/next.config.js` - Next.js settings
- `package.json` - Root dependencies (Hardhat)
- `app/package.json` - Frontend dependencies

---

## ✅ What Works Now

- ✅ Compile Solidity contracts with Hardhat
- ✅ Run local blockchain for testing
- ✅ Deploy contracts automatically
- ✅ Modern React 18 frontend with Next.js
- ✅ Responsive UI with CSS modules
- ✅ MetaMask wallet connection ready

---

## 📋 Available Commands

```bash
# Hardhat/Smart Contracts
npm run hardhat:compile    # Compile contracts
npm run hardhat:node       # Start local blockchain
npm run hardhat:deploy     # Deploy to local network
npm run hardhat:test       # Run contract tests

# Frontend
npm run app:dev            # Start Next.js dev server
npm run app:build          # Build for production
npm run app:start          # Run production build

# Combined
npm run dev                # Run both simultaneously
```

---

## 🎯 Next Steps

1. **Test Contracts:**
   ```bash
   npm run hardhat:test
   ```

2. **Connect Wallet in Frontend:**
   - Update `app/pages/index.js` with your contract address from `contract-addresses.json`
   - Import contract ABI from `artifacts/contracts/Land.sol/Land.json`
   - MetaMask connection button is ready to click

3. **Add Frontend Pages:**
   Create pages for:
   - Seller Dashboard (`app/pages/seller.js`)
   - Buyer Dashboard (`app/pages/buyer.js`)
   - Inspector Dashboard (`app/pages/inspector.js`)

4. **Implement Contract Interaction:**
   - Create `app/hooks/useContract.js` for contract calls
   - Use Ethers.js to call contract functions

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8545 in use | `pkill -f "hardhat node"` then restart |
| Cannot compile | Run `npm run hardhat:compile` explicitly |
| Module not found | Run `npm install` and `cd app && npm install` |
| MetaMask not connecting | Make sure Hardhat network is running on `127.0.0.1:8545` |

---

## 📚 Documentation

- See `MODERNIZATION.md` for detailed upgrade information
- [Hardhat Documentation](https://hardhat.org)
- [Next.js Documentation](https://nextjs.org)
- [Ethers.js Documentation](https://docs.ethers.org)
- [Solidity 0.8.19 Release Notes](https://github.com/ethereum/solidity/releases/tag/v0.8.19)

---

## 🎉 You're Ready!

Your modern Land Registration System is ready to develop on.

```bash
npm run dev  # Start everything!
```

Visit http://localhost:3000 to see the app.

---

**Modernized:** April 2026 | **Stack:** Hardhat + Next.js + Ethers.js
