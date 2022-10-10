import { ethers } from "hardhat";
import "dotenv/config";
// @ts-ignore
import * as REY_kyc from "../artifacts/contracts/erc721_KYC.sol/REY_KYC.json";
// @ts-ignore
import * as REY_nft from "../artifacts/contracts/erc721_collection.sol/REY_NFT.json";
// @ts-ignore
import * as REY_Staking from "../artifacts/contracts/staking_contract.sol/ERC721Staking.json";
// @ts-ignore
import * as MAIToken from "../artifacts/contracts/erc20_MAI.sol/MAIToken.json";

async function main() {
  // Deploying the KYC contract
  // const REYield_KYC = await ethers.getContractFactory("REY_KYC");
  // const reyield_kyc = await REYield_KYC.deploy("REYield KYC", "REKYC");
  // await reyield_kyc.deployed();
  //
  // const kycContract = reyield_kyc.address;
  // console.log(`KYC NFT deployed to ${kycContract}`);

  // Deploying land NFT
  const REYield_NFT = await ethers.getContractFactory("REY_NFT");
  const reyield_nft = await REYield_NFT.deploy("RETield NFT", "RENFT");
  await reyield_nft.deployed();

  const nftContract = reyield_nft.address;
  console.log(`Real Estate NFT deployed to ${nftContract}`);

  // Deploying staking contract
  const REYield_Staking = await ethers.getContractFactory("REYieldStaking");
  const reyield_staking = await REYield_Staking.deploy(
    nftContract,
    "0xd8661dB858e3dC929483cf9Ef043F59a99D6F4D4"
  );
  await reyield_staking.deployed();

  const stakingContract = reyield_nft.address;
  console.log(`Staking Contract deployed to ${stakingContract}`);

  // Set Initial Params in Real Estate NFT contract
  const nftContractDeployed = await REYield_NFT.attach(nftContract);
  const setStakingContract = await nftContractDeployed.setStakingContract(
    stakingContract
  );
  await setStakingContract.wait();
  console.log(
    `Staking contract address set in NFT contract, tx: ${setStakingContract.hash}`
  );

  const setMintingPrice = await nftContractDeployed.setMintPrice(1);
  await setMintingPrice.wait();
  console.log(`Minting update with tx: ${setStakingContract.hash}`);

  const setPaymentToken = await nftContractDeployed.setAcceptedToken(
    "0xd8661dB858e3dC929483cf9Ef043F59a99D6F4D4"
  );
  await setPaymentToken.wait();
  console.log(`Accepted token updated with tx: ${setPaymentToken.hash}`);

  const setKYCtoken = await nftContractDeployed.setKycTokenContract(
    "0x521689F730a63Ea9339bfd37E2912bbDb1fF9e40"
  );
  await setKYCtoken.wait();
  console.log(`Accepted KYC updated with tx: ${setKYCtoken.hash}`);

  // Allow spend of ERC20 token
  const erc20MaiToken = await ethers.getContractFactory("MAIToken");
  const erc20MAITokenDeployed = await erc20MaiToken.attach(
    "0xd8661dB858e3dC929483cf9Ef043F59a99D6F4D4"
  );
  const increaseAllowance = await erc20MAITokenDeployed.approve(
    nftContract,
    "25000000000000000"
  );
  await increaseAllowance.wait();

  console.log(
    `Added allowance for ERC20 payment token: ${increaseAllowance.hash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
