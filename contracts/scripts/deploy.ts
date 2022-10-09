import { ethers } from "hardhat";
import "dotenv/config";
// @ts-ignore
import * as REY_kyc from "../artifacts/contracts/erc721_KYC.sol/REY_KYC.json";
// @ts-ignore
import * as REY_nft from "../artifacts/contracts/erc721_collection.sol/REY_NFT.json";
// @ts-ignore
import * as REY_Staking from "../artifacts/contracts/staking_contract.sol/ERC721Staking.json";

async function main() {

  // Deploying the KYC contract
  const REYield_KYC = await ethers.getContractFactory("REY_KYC");
  const reyield_kyc = await REYield_KYC.deploy("REYield KYC", "REKYC");
  await reyield_kyc.deployed();

  const kycContract = reyield_kyc.address;
  console.log(`deployed to ${kycContract}`);

  // Deploying land NFT
  const REYield_NFT = await ethers.getContractFactory("REY_NFT");
  const reyield_nft = await REYield_NFT.deploy("RETield NFT", "RENFT");
  await reyield_nft.deployed();

  const nftContract = reyield_nft.address;
  console.log(`deployed to ${nftContract}`);

  // Deploying staking contract
  const REYield_Staking = await ethers.getContractFactory("REYieldStaking");
  const reyield_staking = await REYield_Staking.deploy(nftContract, "0xdFA46478F9e5EA86d57387849598dbFB2e964b02");
  await reyield_staking.deployed();

  const stakingContract = reyield_nft.address;
  console.log(`deployed to ${stakingContract}`);

  // Set staking contract address in NFT contract
  const nftContractDeployed = await REYield_NFT.attach(nftContract);
  const setStakingContract = await nftContractDeployed.setStakingContract(stakingContract);
  await setStakingContract.wait();

  console.log(`Staking contract address set in NFT contract, tx: ${setStakingContract.hash}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});