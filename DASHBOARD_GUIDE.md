# Dashboard Pages Guide

This document explains each dashboard page and how to use them.

## Pages Created

### 1. Home Dashboard (`/`)
**File**: `app/pages/index.js`

**Purpose**: Main landing page for the application

**Features**:
- Wallet connection button (MetaMask)
- Display connected account address
- Navigation cards to different dashboards
- Welcome message and project description

**How to Use**:
1. Click "Connect Wallet" button
2. Approve MetaMask connection
3. Once connected, you'll see your account address
4. Click on any dashboard card to navigate there

---

### 2. Seller Dashboard (`/seller`)
**File**: `app/pages/seller.js`

**Purpose**: For land owners to register and manage their properties

**Features**:
- **Register New Land**: Form to add new land properties
  - Location (string)
  - Area (in square feet)
  - Price (in ETH)
- **Your Lands**: List of lands registered by the seller
  - Shows location, area, price
  - Shows verification status (✓ Verified or ⏳ Pending)

**How to Use**:
1. Connect wallet on home page
2. Go to Seller Dashboard
3. Fill in the land registration form
4. Click "Register Land"
5. Approve the transaction in MetaMask
6. View your registered lands in the list below

---

### 3. Buyer Dashboard (`/buyer`)
**File**: `app/pages/buyer.js`

**Purpose**: For buyers to search lands and purchase properties

**Features**:
- **Browse Lands Tab**: 
  - Shows all verified lands available for purchase
  - Each land card displays location, area, price, seller
  - "Request to Buy" button for interested lands
- **My Lands Tab**:
  - Shows lands owned by the buyer
  - Displays owned properties with details

**How to Use**:
1. Connect wallet on home page
2. Go to Buyer Dashboard
3. Click "Browse Lands" tab to see available properties
4. Find a land you want to purchase
5. Click "Request to Buy"
6. Approve the transaction in MetaMask (will transfer the land price)
7. Check "My Lands" tab to see your newly acquired property

---

### 4. Inspector Dashboard (`/inspector`)
**File**: `app/pages/inspector.js`

**Purpose**: For government land inspectors to verify land authenticity

**Features**:
- **Verification Stats**: 
  - Total lands in registry
  - Number of verified lands
  - Number of pending verifications
- **Lands Pending Verification**:
  - Shows only unverified lands
  - "Verify Land" button to approve each land
  - Color-coded status indicator
- **All Lands Registry**:
  - Complete list of all lands with verification status
  - Detailed information for audit purposes

**How to Use**:
1. Connect wallet on home page
2. Go to Inspector Dashboard
3. Review lands in "Lands Pending Verification" section
4. For each land, review the details:
   - Location
   - Area
   - Price
   - Seller information
5. Click "Verify Land" to approve the land
6. Approve the transaction in MetaMask
7. Land will move to verified status

---

### 5. All Lands Registry (`/lands`)
**File**: `app/pages/lands.js`

**Purpose**: Public registry to view all registered lands

**Features**:
- **Registry Stats**: Total lands, verified count, pending count
- **Search by Location**: Filter lands by location name
- **Filter by Status**: 
  - All Lands
  - Verified Only
  - Pending Only
- **Results Display**: All matching lands with full details

**How to Use**:
1. Visit `/lands` page (no wallet connection required for viewing)
2. Use the search box to find lands by location
3. Use the status filter dropdown to filter verified/pending/all
4. View detailed information about each land:
   - Land ID
   - Location
   - Area
   - Price
   - Owner address
   - Current buyer (if applicable)
   - Verification status

---

## API Endpoints

### GET `/api/contract-address`
**Purpose**: Retrieve deployed Land contract address

**Response**:
```json
{
  "Land": "0x..."
}
```

**Error Response**:
```json
{
  "error": "Contract not deployed yet. Please run: npm run hardhat:deploy"
}
```

---

## Page Flow Diagram

```
Home (/)
├── Seller Dashboard (/seller)
│   ├── Register Land
│   └── View Your Lands
├── Buyer Dashboard (/buyer)
│   ├── Browse Lands
│   └── View My Lands
├── Inspector Dashboard (/inspector)
│   ├── Verify Pending Lands
│   └── View All Lands Registry
└── All Lands Registry (/lands)
    ├── Search by Location
    └── Filter by Status
```

---

## Common Actions

### How to Register Land (Seller)
1. Go to Seller Dashboard
2. Fill form: Location, Area, Price
3. Click "Register Land"
4. Approve in MetaMask
5. Land appears in "Your Lands" (unverified)

### How to Purchase Land (Buyer)
1. Go to Buyer Dashboard → "Browse Lands" tab
2. Find a **verified** land
3. Click "Request to Buy"
4. Approve payment in MetaMask
5. Land transfers to your ownership
6. Appears in "My Lands" tab

### How to Verify Land (Inspector)
1. Go to Inspector Dashboard
2. Review lands in "Pending Verification" section
3. Click "Verify Land" for each land you approve
4. Approve in MetaMask
5. Land becomes verified and appears green

### How to Find Lands
1. Go to All Lands Registry page
2. Type location name in search box
3. Select status filter (Verified/Pending/All)
4. Results update in real-time

---

## Troubleshooting

### Pages Show 404 Error
- Ensure contracts are deployed: `npm run hardhat:deploy`
- Check that `contract-addresses.json` exists in project root
- Restart Next.js dev server: `npm run dev` (in app folder)

### "Please connect wallet first" Message
- Go to home page
- Click "Connect Wallet"
- Approve in MetaMask
- Return to dashboard

### MetaMask Transaction Fails
- Check account has enough ETH for gas
- Ensure you're on the correct network (Hardhat Local)
- Check contract has been deployed
- Review error message in MetaMask

### Form Not Submitting
- Check all required fields are filled
- Ensure wallet is connected
- Check browser console for errors
- Verify contract address is loaded (check API)

---

## Testing the Complete Flow

### Scenario 1: Simple Land Transaction
1. Install MetaMask and add Hardhat Local network
2. Import 3 test accounts from Hardhat
3. Account 1: Login as Seller → Register a land
4. Account 2: Login as Inspector → Verify the land
5. Account 3: Login as Buyer → Purchase the verified land
6. Check All Lands page to see transaction history

### Scenario 2: Multiple Lands
1. Register multiple lands as different sellers
2. Have inspector verify them
3. Have buyers request different lands
4. Use search to find specific lands by location

---

## Tech Stack for Pages

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Blockchain**: Ethers.js v6
- **Wallet**: MetaMask (via window.ethereum)
- **Styling**: CSS Modules

---

## File Structure

```
app/
├── pages/
│   ├── index.js              (Home)
│   ├── seller.js             (Seller Dashboard)
│   ├── buyer.js              (Buyer Dashboard)
│   ├── inspector.js          (Inspector Dashboard)
│   ├── lands.js              (All Lands Registry)
│   ├── _app.js               (App wrapper)
│   └── api/
│       └── contract-address.js (API endpoint)
├── styles/
│   ├── Home.module.css
│   └── globals.css
└── utils/
    └── getContract.js        (Contract helper)
```