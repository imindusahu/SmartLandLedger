const hre = require("hardhat");

async function main() {
    console.log("Deploying Land contract...");

    const Land = await hre.ethers.getContractFactory("Land");
    const land = await Land.deploy();

    await land.deployed();

    console.log("Land contract deployed to:", land.address);

    // Save deployment address
    const fs = require("fs");
    const contractAddresses = {
        Land: land.address,
    };

    fs.writeFileSync(
        "./contract-addresses.json",
        JSON.stringify(contractAddresses, null, 2)
    );

    console.log("Contract address saved to contract-addresses.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
