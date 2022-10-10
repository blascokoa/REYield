import { useRef } from "react";
import { Input, InputRef } from "antd";

function AddressInput(props: any) {
  const input = useRef<InputRef>(null);

  return (
    <Input
      ref={input}
      placeholder={"Set Amount"}
      autoFocus={props.autoFocus}
      value={props.amount}
      onChange={(e) => {
        props.setAmount(e.target.value);
      }}
      style={{ ...props?.style, border: "1px solid rgb(33, 191, 150)" }}
    />
  );
}

export default AddressInput;
