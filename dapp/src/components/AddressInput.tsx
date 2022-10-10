import { useCallback, useEffect, useRef, useState } from "react";
import { Input, InputRef } from "antd";
import { useWeb3React } from "@web3-react/core";

function AddressInput(props: any) {
  const { connector } = useWeb3React();
  const input = useRef<InputRef>(null);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    props.onChange(address);
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, address]);

  const updateAddress = useCallback(
    async (value: string) => {
      setAddress(value);
    },
    [connector]
  );

  return (
    <Input
      ref={input}
      placeholder={props.placeholder ? props.placeholder : "Public address"}
      autoFocus={props.autoFocus}
      value={address}
      onChange={(e) => {
        updateAddress(e.target.value);
      }}
      style={{ ...props?.style, border: "1px solid rgb(33, 191, 150)" }}
    />
  );
}

export default AddressInput;
