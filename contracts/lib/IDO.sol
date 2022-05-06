// !! This contract is not audited. Do not use in production!!

//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library IDOLib {
    struct Investment {
        uint256 saleId;
        string saleName;
        uint256 vestedAmount;
        uint256 withdrawnAmount;
        uint256 price;
        uint256[] distributionDates;
        bool[] isPortionWithdrawn;
        bool isFinished;
        address tokenAddress;
    }

    struct ERC20 {
        string name;
        string symbol;
        uint256 totalSupply;
        address tokenAddress;
    }
}
