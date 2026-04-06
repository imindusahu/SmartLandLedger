import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function BuyerDashboard() {
    const [account, setAccount] = useState('');
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [allLands, setAllLands] = useState([]);
    const [myLands, setMyLands] = useState([]);
    const [tab, setTab] = useState('browse'); // 'browse' or 'owned'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        initializeWeb3();
    }, []);

    const initializeWeb3 = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_accounts',
                });
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    await loadContract(accounts[0]);
                }
            } catch (error) {
                console.error('Error initializing web3:', error);
            }
        }
    };

    const loadContract = async (userAccount) => {
        try {
            setError('');
            const prov = new ethers.BrowserProvider(window.ethereum);
            setProvider(prov);

            const signer = await prov.getSigner();
            const response = await fetch('/api/contract-address');
            const contractAddresses = await response.json();

            if (!response.ok || !contractAddresses.Land || contractAddresses.deployed === false) {
                setError(`⚠️ ${contractAddresses.message || 'Contracts not deployed. Please run: npm run hardhat:deploy'}`);
                return;
            }

            const LAND_ABI = [
                "function getAllLands() public view returns (tuple(uint256 id, string location, uint256 area, uint256 price, address seller, address buyer, bool verified, uint256 createdAt)[])",
                "function getLandsByOwner(address _owner) public view returns (tuple(uint256 id, string location, uint256 area, uint256 price, address seller, address buyer, bool verified, uint256 createdAt)[])",
                "function requestLand(uint256 _landId) public payable",
                "function makePayment(uint256 _landId) public payable",
            ];

            const landContract = new ethers.Contract(
                contractAddresses.Land,
                LAND_ABI,
                signer
            );
            setContract(landContract);

            // Fetch all lands
            const lands = await landContract.getAllLands();
            setAllLands(lands);

            // Fetch buyer's own lands
            const owned = await landContract.getLandsByOwner(userAccount);
            setMyLands(owned);
        } catch (error) {
            console.error('Error loading contract:', error);
            setError(`Error: ${error.message}`);
        }
    };

    const requestLand = async (landId, price) => {
        if (!contract) {
            alert('Please connect wallet first');
            return;
        }

        try {
            setLoading(true);
            const tx = await contract.requestLand(landId, { value: price });
            await tx.wait();
            alert('Land request sent successfully!');
            await loadContract(account);
        } catch (error) {
            console.error('Error requesting land:', error);
            alert('Error requesting land: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const LandCard = ({ land, isOwned }) => (
        <div className={styles.card} style={{ marginBottom: '15px' }}>
            <h3>{land.location}</h3>
            <p><strong>Area:</strong> {land.area.toString()} sq ft</p>
            <p><strong>Price:</strong> {ethers.formatEther(land.price)} ETH</p>
            <p><strong>Seller:</strong> {land.seller.substring(0, 6)}...{land.seller.substring(38)}</p>
            <p><strong>Status:</strong> {land.verified ? '✓ Verified' : '⏳ Pending'}</p>
            {!isOwned && land.verified && (
                <button
                    onClick={() => requestLand(land.id, land.price)}
                    disabled={loading}
                    className={styles.button}
                >
                    {loading ? 'Processing...' : 'Request to Buy'}
                </button>
            )}
        </div>
    );

    return (
        <div className={styles.container}>
            <nav style={{ marginBottom: '20px' }}>
                <Link href="/">← Back to Home</Link>
            </nav>
            <main className={styles.main}>
                <h1 className={styles.title}>Buyer Dashboard</h1>

                {account ? (
                    <>
                        <div className={styles.card}>
                            <h2>Connected Account</h2>
                            <p>{account.substring(0, 6)}...{account.substring(38)}</p>
                        </div>

                        {error && (
                            <div className={styles.card} style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ff9800' }}>
                                <p style={{ color: '#ff6f00', fontWeight: 'bold' }}>{error}</p>
                            </div>
                        )}

                        {contract ? (
                            <>
                                <div style={{ marginBottom: '20px' }}>
                                    <button
                                        onClick={() => setTab('browse')}
                                        className={styles.button}
                                        style={{ marginRight: '10px', opacity: tab === 'browse' ? 1 : 0.6 }}
                                    >
                                        Browse Lands
                                    </button>
                                    <button
                                        onClick={() => setTab('owned')}
                                        className={styles.button}
                                        style={{ opacity: tab === 'owned' ? 1 : 0.6 }}
                                    >
                                        My Lands ({myLands.length})
                                    </button>
                                </div>

                                {tab === 'browse' && (
                                    <div>
                                        <h2>Available Lands</h2>
                                        {allLands.length > 0 ? (
                                            allLands.map((land, idx) => (
                                                <LandCard key={idx} land={land} isOwned={false} />
                                            ))
                                        ) : (
                                            <p>No lands available</p>
                                        )}
                                    </div>
                                )}

                                {tab === 'owned' && (
                                    <div>
                                        <h2>Your Properties</h2>
                                        {myLands.length > 0 ? (
                                            myLands.map((land, idx) => (
                                                <LandCard key={idx} land={land} isOwned={true} />
                                            ))
                                        ) : (
                                            <p>You don't own any lands yet</p>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.card}>
                                <p style={{ color: '#ff6f00' }}>Contracts are not deployed yet. Complete setup first.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.card}>
                        <p>Please connect your wallet on the home page</p>
                        <Link href="/">Go to Home</Link>
                    </div>
                )}
            </main>
        </div>
    );
}