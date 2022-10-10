import { ReactElement, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Button } from "antd"; // , InputNumber, message
import { Contract, ethers } from "ethers";
import { useNativeBalance } from "../../../hooks/useNativeBalance";
import AmountInput from "../../AmountInput";
import { reyStaking } from "../../../abi/reyStaking";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/abstract-provider";
// import { parseBigNumberToFloat } from "../../../utils/formatters";

export function StakeNFT(): ReactElement {
  const { account, provider } = useWeb3React();
  const balance = useNativeBalance(provider, account);
  const [rewards, setRewards] = useState<string>("0");
  const [tokenId, setTokenId] = useState<string>();

  function handleStakeNFT(event: { preventDefault: () => void }): void {
    event.preventDefault();
    console.log(tokenId, balance);
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const reyStakingInstance: Contract = new ethers.Contract(
      "0xE7b6902f1e90654ec83e28C4997CAeeAEA177563",
      reyStaking,
      signer
    );

    reyStakingInstance.stake(tokenId).then((tx: TransactionResponse) => {
      console.log(`TransactionResponse TX hash: ${tx.hash}`);
      tx.wait()
        .then((receipt: TransactionReceipt) => {
          console.log("transfer receipt", receipt);
        })
        .catch((e: Error) => console.log(e));
    });
  }

  function handleUnstakeNFT(event: { preventDefault: () => void }): void {
    event.preventDefault();
    console.log(tokenId, balance);
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const reyStakingInstance: Contract = new ethers.Contract(
      "0xE7b6902f1e90654ec83e28C4997CAeeAEA177563",
      reyStaking,
      signer
    );
    reyStakingInstance.withdraw(tokenId).then((tx: TransactionResponse) => {
      console.log(`TransactionResponse TX hash: ${tx.hash}`);
      tx.wait()
        .then((receipt: TransactionReceipt) => {
          console.log("transfer receipt", receipt);
        })
        .catch((e: Error) => console.log(e));
    });
  }

  useEffect(() => {
    if (!window.ethereum) return;
    console.log("inside use effect from stakenfts.tsx");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const reyStakingInstance = new ethers.Contract("0xE7b6902f1e90654ec83e28C4997CAeeAEA177563", reyStaking, provider);
    reyStakingInstance.availableRewards("0x4FcB4b7Cf73C853FCF2f1be028782C95927B3fd1").then((res: any) => {
      console.log("res", res);
      const rew = ethers.utils.formatEther(res);
      setRewards(rew);
    });
  }, []);

  return (
    <div style={{ width: "80%" }}>
      <div style={{ display: "inline-flex", gap: "10px", width: "100%", margin: "10px" }}>
        <AmountInput setAmount={setTokenId} amount={tokenId} />

        <Button type="primary" shape="round" onClick={handleStakeNFT}>
          Stake REYield NFT
        </Button>
        <Button type="primary" shape="round" onClick={handleUnstakeNFT}>
          Withdraw REYield NFT
        </Button>
      </div>
      <div>Available Rewards: {rewards} MAI</div>
    </div>
  );
}
