import { useWeb3React, Web3ReactHooks } from "@web3-react/core";
// import { formatEther } from "ethers/lib/utils";
import { useNativeBalance } from "../../../hooks/useNativeBalance";
import { parseBigNumberToFloat } from "../../../utils/formatters";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { reyKYC } from "../../../abi/reyKYC";
import { reyNFT } from "../../../abi/reyNFT";

const styles = {
  display: {
    paddingBlock: "15px"
  },
  statusText: {
    color: "rgb(46, 46, 46)",
    fontWeight: 800
  }
} as const;

export function Infos({ chainId }: { chainId: ReturnType<Web3ReactHooks["useChainId"]> }) {
  const [kycBalance, setKycBalance] = useState<string | undefined>();
  const [nftBalance, setNftBalance] = useState<string | undefined>();
  const { account, provider } = useWeb3React();
  const balance = useNativeBalance(provider, account);

  useEffect(() => {
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const reyKYCInstance = new ethers.Contract("0x521689F730a63Ea9339bfd37E2912bbDb1fF9e40", reyKYC, provider);
    const reyNFTInstance = new ethers.Contract("0xDBC5214dd94A3d4be3A824fe890EebF0DB244D29", reyNFT, provider);

    reyKYCInstance.balanceOf(account).then((balance: any) => {
      setKycBalance(ethers.utils.formatEther(balance));
      console.log("KYC balance of the user", ethers.utils.formatEther(balance));
    });

    reyNFTInstance.balanceOf(account).then((balance: any) => {
      setNftBalance(ethers.utils.formatUnits(balance, "wei"));
      console.log("NFT balance of the user", ethers.utils.formatEther(balance));
    });
  }, [provider, account]);

  if (chainId === undefined) return null;

  return (
    <div style={styles.display}>
      Address: <span style={styles.statusText}>{account}</span>
      <br></br>
      <br></br>
      <div>
        Balance: <span style={styles.statusText}> {parseBigNumberToFloat(balance!).toFixed(4)} Metis</span>
        <span> | </span>
        REYield KYC: <span style={styles.statusText}> {kycBalance !== "0.0" ? "Yes" : "No"}</span>
        <span> | </span>
        REYield NFTs: <span style={styles.statusText}> {nftBalance}</span>
      </div>
    </div>
  );
}
