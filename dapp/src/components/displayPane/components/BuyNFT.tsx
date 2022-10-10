import { ReactElement, useState } from "react";
import { Button } from "antd"; // , InputNumber, message
import { Contract, ethers } from "ethers";
import AmountInput from "../../AmountInput";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/abstract-provider";
import { reyNFT } from "../../../abi/reyNFT";
// import { erc20 } from "../../../abi/erc20";

export function BuyNFT(): ReactElement {
  const [amount, setAmount] = useState<number>();

  function handleMintNFT(event: { preventDefault: () => void }): void {
    event.preventDefault();
    console.log("amount", amount);
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const reyNFTInstance: Contract = new ethers.Contract("0xDBC5214dd94A3d4be3A824fe890EebF0DB244D29", reyNFT, signer);
    // Mint the NFT
    reyNFTInstance.mint(Number(amount)).then((tx: TransactionResponse) => {
      console.log(`TransactionResponse TX hash: ${tx.hash}`);
      tx.wait()
        .then((receipt: TransactionReceipt) => {
          console.log("transfer receipt", receipt);
        })
        .catch((e: Error) => console.log(e));
    });
  }

  return (
    <div style={{ width: "80%" }}>
      <div style={{ display: "inline-flex", gap: "10px", width: "100%", margin: "10px" }}>
        <AmountInput setAmount={setAmount} amount={amount} />
        <Button type="primary" shape="round" onClick={handleMintNFT}>
          Buy REYield NFT
        </Button>
      </div>
    </div>
  );
}
