const ethers = require("ethers");
require('dotenv').config();

async function testConnection() {
  const provider = new ethers.JsonRpcProvider(`https://sepolia.drpc.org/v1/${process.env.DRPC_API_KEY}`);
  
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("Current block number:", blockNumber);
  } catch (error) {
    console.error("Error connecting to the network:", error);
  }
}

testConnection();