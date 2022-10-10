import { ethers } from "hardhat";
import "dotenv/config";
// @ts-ignore
import * as REY_kyc from "../artifacts/contracts/erc20_MAI.sol/MAIToken.json";

async function main() {
  // Deploying the MAI token contract
  const MAI_testnet = await ethers.getContractFactory("MAIToken");
  const MAI_Contract = await MAI_testnet.deploy("250000000000000000000000000");
  await MAI_Contract.deployed();

  const maiContract = MAI_Contract.address;
  console.log(`deployed to ${maiContract}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
