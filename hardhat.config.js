require('dotenv').config()
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/0515aba21c304b4ca6b5ddce338220ec"
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
}

//get contract address after deployment
//find testing faucet for eth!!! 
//provider>signer>contract>etc
