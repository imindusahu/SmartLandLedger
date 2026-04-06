const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
    console.log("Deploying Land contract...");

    const Land = await hre.ethers.getContractFactory("Land");
    const land = await Land.deploy();

    // Wait for deployment (Ethers.js v6)
    await land.waitForDeployment();
    const landAddress = await land.getAddress();

    console.log("Land contract deployed to:", landAddress);

    // Save deployment address to root directory
    const contractAddresses = {
        Land: landAddress,
    };

    const rootPath = "./contract-addresses.json";
    fs.writeFileSync(
        rootPath,
        JSON.stringify(contractAddresses, null, 2)
    );
    console.log("Contract address saved to contract-addresses.json");

    // Also copy to app/public for frontend
    const publicPath = "./app/public/contract-addresses.json";
    fs.writeFileSync(
        publicPath,
        JSON.stringify(contractAddresses, null, 2)
    );
    console.log("Contract address also saved to app/public/contract-addresses.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
