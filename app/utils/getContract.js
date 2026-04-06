import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

const LAND_ABI = [
    "function registerLand(string memory _location, uint256 _area, uint256 _price) public",
    "function requestLand(uint256 _landId) public payable",
    "function verifyLand(uint256 _landId) public",
    "function makePayment(uint256 _landId) public payable",
    "function transferOwnership(uint256 _landId, address _buyer) public",
    "function getLandDetails(uint256 _landId) public view returns (tuple(uint256 id, string location, uint256 area, uint256 price, address seller, address buyer, bool verified, uint256 createdAt))",
    "function getAllLands() public view returns (tuple(uint256 id, string location, uint256 area, uint256 price, address seller, address buyer, bool verified, uint256 createdAt)[])",
    "function getLandsByOwner(address _owner) public view returns (tuple(uint256 id, string location, uint256 area, uint256 price, address seller, address buyer, bool verified, uint256 createdAt)[])",
];

export async function getContract(signer) {
    try {
        const contractAddresses = require('../../contract-addresses.json');
        const contractAddress = contractAddresses.Land;

        if (!contractAddress) {
            throw new Error('Land contract address not found. Please deploy contracts first.');
        }

        const contract = new ethers.Contract(contractAddress, LAND_ABI, signer);
        return contract;
    } catch (error) {
        console.error('Error loading contract:', error);
        return null;
    }
}

export async function getContractAddress() {
    try {
        const contractAddresses = require('../../contract-addresses.json');
        return contractAddresses.Land;
    } catch (error) {
        console.error('Error loading contract address:', error);
        return null;
    }
}