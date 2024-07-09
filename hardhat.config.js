require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2; // Add this line
const PRIVATE_KEY_3 = process.env.PRIVATE_KEY_3; // Add this line

module.exports = {
  solidity: "0.8.20",
  networks: {
    ethereumSepolia: {
      url: `https://sepolia.drpc.org/v1/${process.env.DRPC_API_KEY}`,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_2, PRIVATE_KEY_3] // Add PRIVATE_KEY_2 and PRIVATE_KEY_3
    },
    optimismSepolia: {
      url: "https://sepolia.optimism.io",
      accounts: [PRIVATE_KEY, PRIVATE_KEY_2, PRIVATE_KEY_3] // Add PRIVATE_KEY_2 and PRIVATE_KEY_3
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};