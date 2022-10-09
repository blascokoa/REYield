import { ethers } from "hardhat";
import "dotenv/config";
// @ts-ignore
import * as REY_kyc from "../artifacts/contracts/erc721_KYC.sol/REY_KYC.json";
// @ts-ignore
import * as REY_nft from "../artifacts/contracts/erc721_collection.sol/REY_NFT.json";
// @ts-ignore
import * as REY_Staking from "../artifacts/contracts/staking_contract.sol/ERC721Staking.json";

async function main() {
  // @ts-ignore
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as String);
  // console.log(`Using address ${wallet.address}`);

  // const provider = new ethers.providers.JsonRpcProvider("https://stardust.metis.io/?owner=588")
  // const signer = provider.getSigner(wallet.address);

  const Lock = await ethers.getContractFactory("REY_KYC");
  const lock = await Lock.deploy("hello", "ASD");

  await lock.deployed();

  console.log(`deployed to ${lock.address}`);

  // const NFTContractFactory = new ethers.ContractFactory(
  //   REY_kyc.abi,
  //   REY_kyc.bytecode,
  //   signer
  // );
  //
  // let NFTContract = await NFTContractFactory.deploy("REY_KYC", "REY_KYC");
  // await NFTContract.deployed();
  // console.log(`Contract deployed at ${NFTContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});