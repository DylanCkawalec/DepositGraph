require('dotenv').config();
const ethers = require("ethers");

const { PRIVATE_KEY, DRPC_API_KEY } = process.env;

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
    sendAsync: (payload, callback) => {
      this.send(payload, callback);
    }
  };
}

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    ethereumSepolia: {
      provider: () => createProvider(`https://sepolia.drpc.org/v1/${DRPC_API_KEY}`),
      network_id: 11155111,
      gas: 5000000,
      gasPrice: 20000000000, // 20 Gwei
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    baseSepolia: {
      provider: () => createProvider(`https://base-sepolia.drpc.org/v1/${DRPC_API_KEY}`),
      network_id: 84532,
      gas: 5000000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    optimismSepolia: {
      provider: () => createProvider(`https://optimism-sepolia.drpc.org/v1/${DRPC_API_KEY}`),
      network_id: 11155420,
      gas: 5000000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    mantaPacificSepolia: {
      provider: () => createProvider(`https://manta-pacific-sepolia.drpc.org/v1/${DRPC_API_KEY}`),
      network_id: 3441005,
      gas: 5000000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
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