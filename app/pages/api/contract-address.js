export default function handler(req, res) {
    try {
        const fs = require('fs');
        const path = require('path');

        // Try multiple possible paths for contract-addresses.json
        const possiblePaths = [
            // Path from app directory root
            path.join(process.cwd(), 'contract-addresses.json'),
            // Path if running from root
            path.join(process.cwd(), '..', 'contract-addresses.json'),
            // Path in public folder
            path.join(process.cwd(), 'public', 'contract-addresses.json'),
        ];

        let contractAddresses = null;

        for (const contractPath of possiblePaths) {
            if (fs.existsSync(contractPath)) {
                try {
                    const fileContent = fs.readFileSync(contractPath, 'utf8');
                    contractAddresses = JSON.parse(fileContent);

                    // Check if it's a valid deployed address
                    if (contractAddresses.Land && contractAddresses.Land !== '0x0000000000000000000000000000000000000000') {
                        res.status(200).json(contractAddresses);
                        return;
                    }
                } catch (e) {
                    console.error(`Error parsing ${contractPath}:`, e.message);
                }
            }
        }

        // If no valid contract found, return error
        res.status(404).json({
            error: 'Contract not deployed yet',
            message: 'Please run: npm run hardhat:deploy',
            deployed: false
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error reading contract address',
            details: error.message
        });
    }
}