import { useWeb3React, Web3ReactHooks } from "@web3-react/core";
// import { formatEther } from "ethers/lib/utils";
import { useNativeBalance } from "../../../hooks/useNativeBalance";
import { parseBigNumberToFloat } from "../../../utils/formatters";

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
  const { account, provider } = useWeb3React();
  const balance = useNativeBalance(provider, account);

  if (chainId === undefined) return null;

  return (
    <div style={styles.display}>
      Address: <span style={styles.statusText}>{account}</span>
      <br></br>
      <br></br>
      Balance: <span style={styles.statusText}>Ξ {parseBigNumberToFloat(balance!).toFixed(4)}</span>
    </div>
  );
}
