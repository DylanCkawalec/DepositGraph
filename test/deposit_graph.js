const ethers = require("ethers");
require('dotenv').config();

const DepositGraph = artifacts.require("DepositGraph");

module.exports = async function(deployer, network, accounts) {
  const { PRIVATE_KEY, DRPC_API_KEY, ADMIN_ADDRESS } = process.env;

  console.log("Deploying DepositGraph with admin:", ADMIN_ADDRESS);
  console.log("Network:", network);

  let dRpcNetwork;
  switch(network) {
    case 'ethereumSepolia':
      dRpcNetwork = 'sepolia';
      break;
    case 'optimismSepolia':
      dRpcNetwork = 'optimism-sepolia';
      break;
    // Add other networks as needed
    default:
      throw new Error(`Unsupported network: ${network}`);
  }

  const rpcUrl = `https://lb.drpc.org/ogrpc?network=${dRpcNetwork}&dkey=${DRPC_API_KEY}`;

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deployer address:", await signer.getAddress());

  try {
    // Deploy the contract using web3 (Truffle's default)
    await deployer.deploy(DepositGraph, ADMIN_ADDRESS, { from: await signer.getAddress() });
    
    const deployedContract = await DepositGraph.deployed();
    console.log("DepositGraph deployed at address:", deployedContract.address);

    // Verify the admin using ethers.js
    const ethersContract = new ethers.Contract(deployedContract.address, DepositGraph.abi, signer);
    const contractAdmin = await ethersContract.admin();
    console.log("Contract admin set to:", contractAdmin);

  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
};