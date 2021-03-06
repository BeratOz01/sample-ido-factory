// !! This contract is not audited. Do not use in production!!

//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Imports
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // ERC20 interface
import "@openzeppelin/contracts/access/Ownable.sol"; //  Ownable.sol
import "./Factory.sol"; // Factory Contract

import "./lib/IDO.sol";

// Portolio contract for tracking the token distribution
contract Portfolio is Ownable {
    // Mapping for user address to Component struct
    mapping(address => IDOLib.Investment[]) internal usersInvesments;

    // Mapping for created ERC20 tokens
    mapping(address => IDOLib.ERC20[]) internal userERC20s;

    // Factory contract
    Factory public factoryContract;

    // Token Creator Contract
    address public tokenCreator;

    constructor() {}

    // Setter function for factory contract
    function setFactoryContract(Factory _factory) external onlyOwner {
        factoryContract = _factory;
    }

    // Msg.sender must be valid sale for adding to portfolio
    modifier isSaleValid() {
        require(factoryContract.isSaleValid(msg.sender), "Sale is not valid");
        _;
    }

    // Msg.sender needs to be token creator account for ERC20 portfolio
    modifier isTokenCreator() {
        require(
            msg.sender == tokenCreator,
            "Only token creator can add to portfolio"
        );
        _;
    }

    // Getter function for msg.sender portfolio
    function getMyPortfolio()
        external
        view
        returns (IDOLib.Investment[] memory)
    {
        return usersInvesments[msg.sender];
    }

    // Getter function for msg.sender ERC20 tokens
    function getMyERC20s() external view returns (IDOLib.ERC20[] memory) {
        return userERC20s[msg.sender];
    }

    // Getter function for individual investment
    function getInvestment(uint256 _id)
        external
        view
        returns (IDOLib.Investment memory)
    {
        require(
            usersInvesments[msg.sender].length > 0,
            "User has no investments"
        );
        require(
            _id < usersInvesments[msg.sender].length,
            "Investment does not exist"
        );

        return usersInvesments[msg.sender][_id];
    }

    // Getter function for check if invesment already exists
    function isInvesmentExists(address user, uint256 _saleId)
        external
        view
        returns (bool)
    {
        uint256 length = usersInvesments[user].length;

        if (length == 0) return false;

        // Local variable for isHere
        bool isHere = false;

        // For gas optimization
        uint256 index;
        for (index; index < length; index++) {
            if (usersInvesments[user][index].saleId == _saleId) {
                isHere = true;
            }
        }

        return isHere;
    }

    // Setter function for set new sale
    function addPortfolio(IDOLib.Investment memory _invesment, address user)
        external
        isSaleValid
    {
        usersInvesments[user].push(_invesment);
    }

    // Update portolio for user
    function updatePortolio(
        address user,
        uint256 saleID,
        uint256 newWithdrawnAmount,
        bool[] memory newPortionArray
    ) external isSaleValid {
        uint256 length = usersInvesments[user].length;

        // Local variable for index
        uint256 index;
        for (index; index < length; index++) {
            if (usersInvesments[user][index].saleId == saleID) {
                usersInvesments[user][index]
                    .withdrawnAmount = newWithdrawnAmount;
                usersInvesments[user][index]
                    .isPortionWithdrawn = newPortionArray;
                if (isFinished(newPortionArray))
                    usersInvesments[user][index].isFinished = true;
            }
        }
    }

    // Internal function for set isFinished variable
    function isFinished(bool[] memory arr) internal pure returns (bool) {
        bool finished = true;

        uint256 length = arr.length;
        uint256 index;
        for (index; index < length; index++) {
            if (!arr[index]) {
                finished = false;
            }
        }

        return finished;
    }

    // External function for add new ERC20 token to portfolio
    function addERC20(
        address user,
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address tokenAddress
    ) external isTokenCreator {
        IDOLib.ERC20 memory newERC20 = IDOLib.ERC20(
            name,
            symbol,
            totalSupply,
            tokenAddress
        );

        userERC20s[user].push(newERC20);
    }

    // Setter function for set token creator
    function setTokenCreator(address _tokenCreator) external onlyOwner {
        tokenCreator = _tokenCreator;
    }
}
