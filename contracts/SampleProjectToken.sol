// !! This contract is not audited. Do not use in production!!

//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// erc20 token
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // ERC20.sol

contract ProjectToken is ERC20 {
    // Constructor
    constructor() ERC20("ProjectToken", "PTKN") {
        _mint(msg.sender, 1000 * 10**18);
    }
}
