import { ethers } from "hardhat";
import "dotenv/config";
// @ts-ignore
import * as REY_kyc from "../artifacts/contracts/erc20_MAI.sol/MAIToken.json";

async function main() {
  // Deploying the MAI token contract
  const MAI_testnet = await ethers.getContractFactory("MAIToken");
  const maiTokenInstance = await MAI_testnet.attach(
    "0xd8661dB858e3dC929483cf9Ef043F59a99D6F4D4"
  );

  const fillTx = await maiTokenInstance.transfer(
    "0xDBC5214dd94A3d4be3A824fe890EebF0DB244D29",
    "25000"
  );
  await fillTx.wait();
  console.log(`MAI tokens transferred to staking contract, tx: ${fillTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
