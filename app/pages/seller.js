import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function SellerDashboard() {
    const [account, setAccount] = useState('');
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [lands, setLands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        location: '',
        area: '',
        price: '',
    });

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

            // Check if contract is deployed
            if (!response.ok || !contractAddresses.Land || contractAddresses.deployed === false) {
                console.warn('Contract not deployed yet:', contractAddresses.message);
                setError(`⚠️ ${contractAddresses.message || 'Contracts not deployed. Please run: npm run hardhat:deploy'}`);
                return;
            }

            const LAND_ABI = [
                "function registerLand(string memory _location, uint256 _area, uint256 _price) public",
                "function getLandsByOwner(address _owner) public view returns (tuple(uint256 id, string location, uint256 area, uint256 price, address seller, address buyer, bool verified, uint256 createdAt)[])",
            ];

            const landContract = new ethers.Contract(
                contractAddresses.Land,
                LAND_ABI,
                signer
            );
            setContract(landContract);

            // Fetch seller's lands
            const userLands = await landContract.getLandsByOwner(userAccount);
            setLands(userLands);
        } catch (error) {
            console.error('Error loading contract:', error);
            setError(`Error: ${error.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const registerLand = async (e) => {
        e.preventDefault();
        if (!contract) {
            alert('Please connect wallet first');
            return;
        }

        try {
            setLoading(true);
            const tx = await contract.registerLand(
                formData.location,
                ethers.parseUnits(formData.area, 0),
                ethers.parseUnits(formData.price, 'ether')
            );
            await tx.wait();
            alert('Land registered successfully!');
            setFormData({ location: '', area: '', price: '' });
            await loadContract(account);
        } catch (error) {
            console.error('Error registering land:', error);
            alert('Error registering land: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <nav style={{ marginBottom: '20px' }}>
                <Link href="/">← Back to Home</Link>
            </nav>
            <main className={styles.main}>
                <h1 className={styles.title}>Seller Dashboard</h1>

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
                                <div className={styles.card}>
                                    <h2>Register New Land</h2>
                                    <form onSubmit={registerLand} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="Location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="area"
                                            placeholder="Area (sq ft)"
                                            value={formData.area}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="price"
                                            placeholder="Price (ETH)"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button type="submit" disabled={loading} className={styles.button}>
                                            {loading ? 'Registering...' : 'Register Land'}
                                        </button>
                                    </form>
                                </div>

                                <div className={styles.card}>
                                    <h2>Your Lands ({lands.length})</h2>
                                    {lands.length > 0 ? (
                                        <ul style={{ listStyle: 'none', padding: 0 }}>
                                            {lands.map((land, idx) => (
                                                <li key={idx} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                                    <strong>{land.location}</strong><br />
                                                    Area: {land.area.toString()} sq ft | Price: {ethers.formatEther(land.price)} ETH
                                                    <br />
                                                    Status: {land.verified ? '✓ Verified' : '⏳ Pending Verification'}
                                                </li>
                                            ))}
                                        </ul>
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