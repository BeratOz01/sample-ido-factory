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

    // Factory contract
    Factory public factoryContract;

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

    // Getter function for msg.sender portfolio
    function getMyPortfolio()
        external
        view
        returns (IDOLib.Investment[] memory)
    {
        return usersInvesments[msg.sender];
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
            }
        }
    }
}
