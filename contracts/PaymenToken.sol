// !! This contract is not audited. Do not use in production!!

//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// erc20 token
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; // ERC20.sol

contract PaymentToken is ERC20 {
    // Constant variable for cooldown time
    uint256 public constant COOLDOWN_TIME = 10 * 60;

    // Total requested token amount
    uint256 public totalRequestedTokenAmount;

    // Mapping for address to cooldown
    mapping(address => uint256) internal cooldowns;

    // Constructor
    constructor() ERC20("PaymentToken", "PTKN") {
        _mint(msg.sender, 1000 * 10**18);
    }

    // Modifier for checking cooldown
    modifier isNotOnCooldown() {
        require(
            cooldowns[msg.sender] <= block.timestamp,
            "User is on cooldown"
        );
        _;
    }

    // Function for requesting Payment Token
    function requestPaymentToken() public isNotOnCooldown {
        // Local variable for msg.sender
        address _user = msg.sender;
        // Check if user is not null
        require(_user != address(0));

        // Mint payment token to user (10 Ether Payment Token)
        _mint(_user, 10 * 10**18);

        // Update total requested token amount
        totalRequestedTokenAmount += 10 * 10**18;

        // Set cooldown for user
        cooldowns[_user] = block.timestamp + COOLDOWN_TIME;
    }

    // Getter function for remaining cooldown
    function getRemainingCooldown(address _user) public view returns (uint256) {
        uint256 cooldown = cooldowns[_user];

        if (cooldown == 0) return 0;

        return cooldown - block.timestamp;
    }

    // Getter remaining cooldown function for msg.sender
    function getRemainingCooldown__sender() external view returns (uint256) {
        return getRemainingCooldown(msg.sender);
    }
}
