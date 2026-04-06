import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styles from '../styles/Home.module.css';

export default function Home() {
    const [account, setAccount] = useState('');
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
        return () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
            }
        };
    }, []);

    const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
            setAccount(accounts[0]);
        } else {
            setAccount('');
        }
    };

    const connectWallet = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                setAccount(accounts[0]);

                const prov = new ethers.BrowserProvider(window.ethereum);
                setProvider(prov);

                // Get signer and contract instance
                const signer = await prov.getSigner();
                // Contract address should come from deployed contracts
                const contractABI = []; // Add ABI from compiled contract
                // const contractAddress = '0x...'; // Add deployed contract address
                // const landContract = new ethers.Contract(contractAddress, contractABI, signer);
                // setContract(landContract);
            } catch (error) {
                console.error('Could not connect wallet:', error);
            }
        } else {
            alert('Please install MetaMask');
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>Decentralized Land Registration System</h1>
                <p className={styles.description}>
                    Welcome to the blockchain-based land registration platform
                </p>

                {account ? (
                    <div className={styles.card}>
                        <h2>Connected Account</h2>
                        <p>{account.substring(0, 6)}...{account.substring(38)}</p>
                    </div>
                ) : (
                    <button onClick={connectWallet} className={styles.button}>
                        Connect Wallet
                    </button>
                )}

                <div className={styles.grid}>
                    <a href="/seller" className={styles.card}>
                        <h2>Seller Dashboard</h2>
                        <p>Register and manage your lands</p>
                    </a>

                    <a href="/buyer" className={styles.card}>
                        <h2>Buyer Dashboard</h2>
                        <p>Browse and request lands</p>
                    </a>

                    <a href="/inspector" className={styles.card}>
                        <h2>Inspector Dashboard</h2>
                        <p>Verify users and transactions</p>
                    </a>

                    <a href="/lands" className={styles.card}>
                        <h2>View All Lands</h2>
                        <p>Browse available properties</p>
                    </a>
                </div>
            </main>
        </div>
    );
}
