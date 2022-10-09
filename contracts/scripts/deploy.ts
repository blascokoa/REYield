import { ethers } from "hardhat";
import "dotenv/config";
// @ts-ignore
import * as REY_kyc from "../artifacts/contracts/erc721_KYC.sol/REY_KYC.json";
// @ts-ignore
import * as REY_nft from "../artifacts/contracts/erc721_collection.sol/REY_NFT.json";
// @ts-ignore
import * as REY_Staking from "../artifacts/contracts/staking_contract.sol/ERC721Staking.json";

async function main() {
  const REYield_KYC = await ethers.getContractFactory("REY_KYC");
  const reyield_kyc = await REYield_KYC.deploy("hello", "ASD");

  await reyield_kyc.deployed();

  console.log(`deployed to ${reyield_kyc.address}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});