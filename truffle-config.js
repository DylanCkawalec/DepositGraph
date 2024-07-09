require('dotenv').config();
const ethers = require("ethers");

const { PRIVATE_KEY, DRPC_API_KEY, ETHEREUM_SEPOLIA_RPC_URL, BASE_SEPOLIA_RPC_URL, OPTIMISM_SEPOLIA_RPC_URL, MANTA_PACIFIC_SEPOLIA_RPC_URL } = process.env;

function createProvider(url) {
  const provider = new ethers.JsonRpcProvider(url);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
 
  return {
    send: async (payload, callback) => {
      try {
        let result;
        if (payload.method === 'eth_sendTransaction') {
          const tx = await signer.sendTransaction(payload.params[0]);
          result = tx.hash;
        } else {
          result = await provider.send(payload.method, payload.params);
        }
        callback(null, { result });
      } catch (error) {
        callback(error);
      }
    },
    sendAsync: function(payload, callback) {
      this.send(payload, callback);
    }
  };
}

const wallet = new ethers.Wallet(PRIVATE_KEY);
const FROM_ADDRESS = wallet.address;

module.exports = {
  networks: {
    ethereumSepolia: {
      provider: () => createProvider(ETHEREUM_SEPOLIA_RPC_URL),
      network_id: 11155111,
      gas: 5000000,
      gasPrice: 20000000000, // 20 Gwei
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: FROM_ADDRESS,
    },
    baseSepolia: {
      provider: () => createProvider(BASE_SEPOLIA_RPC_URL),
      network_id: 84532,
      gas: 5000000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 400,
      skipDryRun: true,
      from: FROM_ADDRESS,
    },
    optimismSepolia: {
      provider: () => createProvider(OPTIMISM_SEPOLIA_RPC_URL),
      network_id: 11155420,
      gas: 5000000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 400,
      skipDryRun: true,
      from: FROM_ADDRESS,
    },
    mantaPacificSepolia: {
      provider: () => createProvider(MANTA_PACIFIC_SEPOLIA_RPC_URL),
      network_id: 3441005,
      gas: 5000000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      from: FROM_ADDRESS,
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