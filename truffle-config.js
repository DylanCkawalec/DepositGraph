require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { MNEMONIC, DRPC_API_KEY } = process.env;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    ethereumSepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://lb.drpc.org/ogrpc?network=sepolia&dkey=${DRPC_API_KEY}`),
      network_id: 11155111,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    baseSepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://lb.drpc.org/ogrpc?network=base-sepolia&dkey=${DRPC_API_KEY}`),
      network_id: 84532,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    optimismSepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://lb.drpc.org/ogrpc?network=optimism-sepolia&dkey=${DRPC_API_KEY}`),
      network_id: 11155420,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    mantaPacificSepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://lb.drpc.org/ogrpc?network=manta-pacific-sepolia&dkey=${DRPC_API_KEY}`),
      network_id: 3441005,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
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