require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20",
  networks: {
    ethereumSepolia: {
      url: `https://sepolia.drpc.org/v1/${process.env.DRPC_API_KEY}`,
      accounts: [PRIVATE_KEY]
    },
    optimismSepolia: {
      url: "https://sepolia.optimism.io",
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};