import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function InspectorDashboard() {
    const [account, setAccount] = useState('');
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [allLands, setAllLands] = useState([]);
    const [unverifiedLands, setUnverifiedLands] = useState([]);
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
                "function verifyLand(uint256 _landId) public",
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

            // Filter unverified lands
            const unverified = lands.filter(land => !land.verified);
            setUnverifiedLands(unverified);
        } catch (error) {
            console.error('Error loading contract:', error);
            setError(`Error: ${error.message}`);
        }
    };

    const verifyLand = async (landId) => {
        if (!contract) {
            alert('Please connect wallet first');
            return;
        }

        try {
            setLoading(true);
            const tx = await contract.verifyLand(landId);
            await tx.wait();
            alert('Land verified successfully!');
            await loadContract(account);
        } catch (error) {
            console.error('Error verifying land:', error);
            alert('Error verifying land: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const LandCard = ({ land, showVerifyBtn }) => (
        <div className={styles.card} style={{ marginBottom: '15px' }}>
            <h3>{land.location}</h3>
            <p><strong>Land ID:</strong> {land.id.toString()}</p>
            <p><strong>Area:</strong> {land.area.toString()} sq ft</p>
            <p><strong>Price:</strong> {ethers.formatEther(land.price)} ETH</p>
            <p><strong>Owner:</strong> {land.seller.substring(0, 6)}...{land.seller.substring(38)}</p>
            <p><strong>Status:</strong> {land.verified ? '✓ Verified' : '⏳ Pending Verification'}</p>
            {showVerifyBtn && !land.verified && (
                <button
                    onClick={() => verifyLand(land.id)}
                    disabled={loading}
                    className={styles.button}
                    style={{ backgroundColor: '#28a745' }}
                >
                    {loading ? 'Verifying...' : 'Verify Land'}
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
                <h1 className={styles.title}>Land Inspector Dashboard</h1>

                {account ? (
                    <>
                        <div className={styles.card}>
                            <h2>Inspector Account</h2>
                            <p>{account.substring(0, 6)}...{account.substring(38)}</p>
                        </div>

                        {error && (
                            <div className={styles.card} style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ff9800' }}>
                                <p style={{ color: '#ff6f00', fontWeight: 'bold' }}>{error}</p>
                            </div>
                        )}

                        {contract ? (
                            <>
                                <div className={styles.card}>
                                    <h2>Land Verification Stats</h2>
                                    <p><strong>Total Lands:</strong> {allLands.length}</p>
                                    <p><strong>Verified:</strong> {allLands.filter(l => l.verified).length}</p>
                                    <p><strong>Pending:</strong> {unverifiedLands.length}</p>
                                </div>

                                <div>
                                    <h2>Lands Pending Verification ({unverifiedLands.length})</h2>
                                    {unverifiedLands.length > 0 ? (
                                        unverifiedLands.map((land, idx) => (
                                            <LandCard key={idx} land={land} showVerifyBtn={true} />
                                        ))
                                    ) : (
                                        <p style={{ fontSize: '16px', color: '#28a745' }}>
                                            ✓ All lands have been verified!
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <h2>All Lands Registry</h2>
                                    {allLands.length > 0 ? (
                                        allLands.map((land, idx) => (
                                            <LandCard key={idx} land={land} showVerifyBtn={false} />
                                        ))
                                    ) : (
                                        <p>No lands registered yet</p>
                                    )}
                                </div>
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