// !! This contract is not audited. Do not use in production!!

//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol"; //  Ownable.sol
import "./SampleProjectToken.sol"; // Sample project token
import "./lib/IDO.sol"; // IDO library
import "./Portfolio.sol"; // Portfolio.sol

contract TokenCreator is Ownable {
    // Portfolio contract
    Portfolio public portfolioContract;

    // Cooldowns for creating tokens
    uint256 public constant COOLDOWN_TIME = 10 minutes;

    // Maximum amount for creating ERC-20 token
    uint256 public constant MAX_AMOUNT = 5;

    // Users to tokens mapping
    mapping(address => IDOLib.ERC20[]) internal userCollections;

    // Cooldowns
    mapping(address => uint256) internal cooldowns;

    // Events
    event TokenCreated(IDOLib.ERC20 infoToken);

    // Modifier
    modifier canCreateERC20() {
        // Check for cooldown
        require(
            block.timestamp >= cooldowns[msg.sender],
            "Token creation is on cooldown"
        );

        // Check for max amount
        require(
            userCollections[msg.sender].length < MAX_AMOUNT,
            "You can't create more than 5 tokens"
        );
        _;
    }

    // Default constructor
    constructor(Portfolio _contract) Ownable() {
        portfolioContract = _contract;
    }

    // Get msg.sender's tokens
    function getMyTokens() external view returns (IDOLib.ERC20[] memory) {
        return userCollections[msg.sender];
    }

    function createToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply
    ) public canCreateERC20 {
        // Create new token
        ProjectToken token = new ProjectToken(name, symbol, totalSupply);

        // Generated token address
        address tokenAddress = address(token);

        // Temp data for mapping
        IDOLib.ERC20 memory newERC20 = IDOLib.ERC20(
            name,
            symbol,
            totalSupply,
            tokenAddress
        );

        // Add token to mapping
        userCollections[msg.sender].push(newERC20);

        // Add token to portfolio
        portfolioContract.addERC20(
            msg.sender,
            name,
            symbol,
            totalSupply,
            tokenAddress
        );

        // Add cooldown
        cooldowns[msg.sender] = block.timestamp + COOLDOWN_TIME;

        // Emit event
        emit TokenCreated(newERC20);
    }

    function getMyCooldown() external view returns (uint256) {
        uint256 cooldown = cooldowns[msg.sender];

        if (cooldown == 0) return 0;

        return cooldown - block.timestamp;
    }

    // Setter function for set portfolio contract
    function setPortfolioContract(Portfolio _contract) public onlyOwner {
        portfolioContract = _contract;
    }
}
