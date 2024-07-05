require('dotenv').config();
const { ethers } = require("ethers");

const { PRIVATE_KEY, DRPC_API_KEY } = process.env;

function createProvider(url) {
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  return wallet;
}

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    ethereumSepolia: {
      provider: () => createProvider(`https://lb.drpc.org/ogrpc?network=sepolia&dkey=${DRPC_API_KEY}`),
      network_id: 11155111,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gasPrice: 20000000000, // 20 Gwei
    },
    baseSepolia: {
      provider: () => createProvider(`https://lb.drpc.org/ogrpc?network=base-sepolia&dkey=${DRPC_API_KEY}`),
      network_id: 84532,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gasPrice: 20000000000,
    },
    optimismSepolia: {
      provider: () => createProvider(`https://lb.drpc.org/ogrpc?network=optimism-sepolia&dkey=${DRPC_API_KEY}`),
      network_id: 11155420,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gasPrice: 20000000000,
    },
    mantaPacificSepolia: {
      provider: () => createProvider(`https://lb.drpc.org/ogrpc?network=manta-pacific-sepolia&dkey=${DRPC_API_KEY}`),
      network_id: 3441005,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gasPrice: 20000000000,
    }
  },
  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  },
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};