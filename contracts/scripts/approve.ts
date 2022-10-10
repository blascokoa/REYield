import { ethers } from "hardhat";
import "dotenv/config";
// @ts-ignore
import * as REY_nft from "../artifacts/contracts/erc721_collection.sol/REY_NFT.json";

async function main() {
  // Deploying the MAI token contract
  const REYnft = await ethers.getContractFactory("REY_NFT");
  const reyNFTInstance = await REYnft.attach(
    "0xDBC5214dd94A3d4be3A824fe890EebF0DB244D29"
  );

  const approveTx = await reyNFTInstance.approve(
    "0xE7b6902f1e90654ec83e28C4997CAeeAEA177563",
    "2"
  );
  await approveTx.wait();
  console.log(`NFT spend approved, tx: ${approveTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
