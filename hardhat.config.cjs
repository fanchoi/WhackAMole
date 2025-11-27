require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Helper function to ensure private key has 0x prefix
const getPrivateKey = () => {
  const key = process.env.PRIVATE_KEY;
  if (!key) {
    console.warn("⚠️  No PRIVATE_KEY found in .env");
    return [];
  }
  return [key.startsWith("0x") ? key : `0x${key}`];
};

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    // Base Sepolia Testnet
    baseSepolia: {
      url: "https://base-sepolia-rpc.publicnode.com", // Tried alternative public RPC
      accounts: getPrivateKey(),
      chainId: 84532,
    },
    // Base Mainnet
    base: {
      url: "https://mainnet.base.org",
      accounts: getPrivateKey(),
      chainId: 8453,
    },
    // Localhost for testing
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
};
