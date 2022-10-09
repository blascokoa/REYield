import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  paths: {
    artifacts: './artifacts'
  },
  networks: {
    hardhat: {
      chainId: 588
    },
    metis: {
      url: "https://stardust.metis.io/?owner=588",
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  }
};

export default config;
