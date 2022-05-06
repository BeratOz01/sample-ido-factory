// !! This contract is not audited. Do not use in production!!

//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// erc20 token
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // ERC20.sol

contract ProjectToken is ERC20 {
    // Constructor
    constructor(
        string memory name,
        string memory symbol,
        uint256 _supply
    ) ERC20(name, symbol) {
        _mint(msg.sender, _supply * 10**18);
    }
}
