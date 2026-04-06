import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function AllLands() {
    const [account, setAccount] = useState('');
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [allLands, setAllLands] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'verified', 'pending'
    const [searchLocation, setSearchLocation] = useState('');
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
                }
                await loadContract();
            } catch (error) {
                console.error('Error initializing web3:', error);
            }
        }
    };

    const loadContract = async () => {
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
        } catch (error) {
            console.error('Error loading contract:', error);
            setError(`Error: ${error.message}`);
        }
    };

    const filteredLands = allLands.filter(land => {
        const statusMatch =
            filterStatus === 'all' ||
            (filterStatus === 'verified' && land.verified) ||
            (filterStatus === 'pending' && !land.verified);

        const locationMatch = land.location.toLowerCase().includes(searchLocation.toLowerCase());

        return statusMatch && locationMatch;
    });

    const LandCard = ({ land }) => (
        <div className={styles.card} style={{ marginBottom: '15px' }}>
            <h3>{land.location}</h3>
            <p><strong>Land ID:</strong> {land.id.toString()}</p>
            <p><strong>Area:</strong> {land.area.toString()} sq ft</p>
            <p><strong>Price:</strong> {ethers.formatEther(land.price)} ETH</p>
            <p><strong>Seller:</strong> {land.seller.substring(0, 6)}...{land.seller.substring(38)}</p>
            {land.buyer !== '0x0000000000000000000000000000000000000000' && (
                <p><strong>Current Buyer:</strong> {land.buyer.substring(0, 6)}...{land.buyer.substring(38)}</p>
            )}
            <p>
                <strong>Status:</strong> {' '}
                <span style={{
                    color: land.verified ? '#28a745' : '#ffc107',
                    fontWeight: 'bold'
                }}>
                    {land.verified ? '✓ Verified' : '⏳ Pending Verification'}
                </span>
            </p>
        </div>
    );

    return (
        <div className={styles.container}>
            <nav style={{ marginBottom: '20px' }}>
                <Link href="/">← Back to Home</Link>
            </nav>
            <main className={styles.main}>
                <h1 className={styles.title}>All Registered Lands</h1>

                {error && (
                    <div className={styles.card} style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ff9800' }}>
                        <p style={{ color: '#ff6f00', fontWeight: 'bold' }}>{error}</p>
                    </div>
                )}

                {contract ? (
                    <>
                        <div className={styles.card}>
                            <h2>Land Registry</h2>
                            <p>Total Lands: <strong>{allLands.length}</strong></p>
                            <p>Verified: <strong>{allLands.filter(l => l.verified).length}</strong></p>
                            <p>Pending: <strong>{allLands.filter(l => !l.verified).length}</strong></p>
                        </div>

                        <div className={styles.card}>
                            <h2>Filters</h2>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Search by Location: </label>
                                <input
                                    type="text"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    placeholder="e.g., New York"
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                />
                            </div>
                            <div>
                                <label>Filter by Status: </label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                                >
                                    <option value="all">All Lands</option>
                                    <option value="verified">Verified Only</option>
                                    <option value="pending">Pending Only</option>
                                </select>
                            </div>
                        </div>

                        <h2>Results: {filteredLands.length} land(s)</h2>
                        {filteredLands.length > 0 ? (
                            filteredLands.map((land, idx) => (
                                <LandCard key={idx} land={land} />
                            ))
                        ) : (
                            <p style={{ fontSize: '16px', color: '#666' }}>
                                No lands match your search criteria
                            </p>
                        )}
                    </>
                ) : (
                    <div className={styles.card}>
                        <p style={{ color: '#ff6f00' }}>Contracts are not deployed yet. Complete setup first.</p>
                    </div>
                )}
            </main>
        </div>
    );
}