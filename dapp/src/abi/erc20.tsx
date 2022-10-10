export const erc20 = [
  // READ Only functions
  "function balanceOf(address owner) view returns (uint256)",

  // WRITE functions
  "function mint(address user) nonpayable returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) nonpayable returns (bool)"
];
