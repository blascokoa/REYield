import { ethers } from "hardhat";
import "dotenv/config";
// @ts-ignore
import * as MAIToken from "../artifacts/contracts/erc20_MAI.sol/MAIToken.json";
// @ts-ignore
import * as REYieldStaking from "../artifacts/contracts/staking_contract.sol/REYieldStaking.json";

async function main() {
  // Deploying the MAI token contract
  const MAI_testnet = await ethers.getContractFactory("MAIToken");
  const maiTokenInstance = await MAI_testnet.attach(
    "0xd8661dB858e3dC929483cf9Ef043F59a99D6F4D4"
  );

  const fillTx = await maiTokenInstance.transfer(
    "0xE7b6902f1e90654ec83e28C4997CAeeAEA177563",
    "2500000"
  );
  await fillTx.wait();
  console.log(`MAI tokens transferred to staking contract, tx: ${fillTx.hash}`);

  const REYieldStaking = await ethers.getContractFactory("REYieldStaking");
  const stakingContractInstance = await REYieldStaking.attach(
    "0xE7b6902f1e90654ec83e28C4997CAeeAEA177563"
  );
  const updateRewardsTx = await stakingContractInstance.updateRewardsPerHour();
  await updateRewardsTx.wait();
  console.log("Rewards per hour updated: ", updateRewardsTx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
