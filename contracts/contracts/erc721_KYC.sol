// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// Simple NFT Collection Smart Contract

contract REY_KYC is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    uint256 maxSupply = 100;
    mapping(address => bool) public isEnabled;
    Counters.Counter private _tokenIdCounter;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol)  // REYield_KYC, KYC
    {}

    modifier onlyNew (address _user) {
        require(balanceOf(_user) == 0, "You already have a token");
        _;
    }

    function disableKYC(address _user) public onlyOwner {
        isEnabled[_user] = false;
    }

    function enableKYC(address _user) public onlyOwner {
        isEnabled[_user] = true;
    }

    function kycStatus(address _user) public view returns (bool) {
        return isEnabled[_user];
    }

    function modifyMaxSupply(uint256 _maxSupply) public onlyOwner {
        maxSupply = _maxSupply;
    }

    function mint(address _user) public onlyOwner onlyNew(_user) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        isEnabled[_user] = true;
        _safeMint(_user, tokenId);
    }

    // Disable transfers
    function transferFrom(address from, address to, uint256 tokenId) public override {
        revert("transferFrom: cannot transfer NFT");
    }


    function safeTransferFrom(address from, address to, uint256 tokenId) public override {
        revert("safeTransferFrom: cannot transfer NFT");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override {
        revert("safeTransferFrom: cannot transfer NFT");
    }

    // The following functions are overrides required by Solidity.
    // Hook that is called before any token transfer. This includes minting and burning.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
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