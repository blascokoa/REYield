import { ReactElement, useState } from "react";
// import { useWeb3React } from "@web3-react/core";
import { Button } from "antd"; // , InputNumber, message
import AddressInput from "../../AddressInput";
import { Contract, ethers } from "ethers";
import { reyKYC } from "../../../abi/reyKYC";
import { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

export function MintNFT(): ReactElement {
  const [receiver, setReceiver] = useState<string>();

  function handleMintKYC(event: { preventDefault: () => void }): void {
    event.preventDefault();
    if (!window.ethereum) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const reyKYCInstance: Contract = new ethers.Contract("0x521689F730a63Ea9339bfd37E2912bbDb1fF9e40", reyKYC, signer);

    reyKYCInstance.mint(receiver).then((tx: TransactionResponse) => {
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
        <AddressInput onChange={setReceiver} />
        <Button type="primary" shape="round" onClick={handleMintKYC}>
          Mint KYC NFT
        </Button>
      </div>
    </div>
  );
}
