// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

interface IERC20 {
    function balanceOf(address owner) external view returns (uint256 balance);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IKycContract {
    function kycStatus(address _user) external view returns (bool status);
}

// Simple NFT Collection Smart Contract
contract REY_NFT is ERC721, ERC721Enumerable, Ownable {

    using Counters for Counters.Counter;

    uint256 public maxSupply = 10;
    address public paymentToken = 0x0000000000000000000000000000000000000000;
    address public kycTokenContract = 0x0000000000000000000000000000000000000000;
    address public stakingContract = 0x0000000000000000000000000000000000000000;
    uint256 public mintPrice = 1 * 10**18;
    Counters.Counter private _tokenIdCounter;

    constructor(string memory _name, string memory _symbol, address _kycTokenContract, address _paymentToken) ERC721(_name, _symbol) {
        kycTokenContract = _kycTokenContract;
        paymentToken = _paymentToken;
    }

    modifier ownKyc(address _user) {
        if (_user != stakingContract){
            require(IERC721(kycTokenContract).balanceOf(_user) > 0 && IKycContract(kycTokenContract).kycStatus(_user), "You are not authorized for mint");
            _;
        }
        _;
    }

    function setStakingContract(address _stakingContract) public onlyOwner {
        stakingContract = _stakingContract;
    }

    function setPaymentToken(address _paymentToken) public onlyOwner {
        paymentToken = _paymentToken;
    }

    function setKycTokenContract(address _kycTokenContract) public onlyOwner {
        kycTokenContract = _kycTokenContract;
    }

    function setMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price;
    }

    function mint(uint256 _amount) public payable ownKyc(msg.sender) {
        // check if can mint that amount
        require(_tokenIdCounter.current() + _amount <= maxSupply, "Mint limit exceeded");
        // check if there are enough funds
        // require(IERC20(paymentToken).balanceOf(msg.sender) >= _amount * mintPrice * 10**18, "Incorrect amount sent");
        // mint the tokens
        for (uint256 i; i < _amount; i++) {
            (bool success) = IERC20(paymentToken).transferFrom(msg.sender, address(this), mintPrice);
            require(success);
            _tokenIdCounter.increment();
            uint256 tokenId = _tokenIdCounter.current();
            _safeMint(msg.sender, tokenId);
        }
    }

    // Withdraw funds from contract to deployer
    function withdraw() public onlyOwner {
        (bool success) = IERC20(paymentToken).transfer(msg.sender, IERC20(paymentToken).balanceOf(address(this)));
        require(success);
    }

    function tokensOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; ++i) {
            ownedTokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return ownedTokenIds;
    }

    // Transfer Functions
    function transferFrom(address from, address to, uint256 tokenId) public override ownKyc(to) {
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override ownKyc(to) {
        super.safeTransferFrom(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        //require(IERC721(kycTokenContract).balanceOf(from) > 0 && IERC721(kycTokenContract).balanceOf(to) > 0, "You cannot transfer tokens");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}