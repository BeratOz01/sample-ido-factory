// !! This contract is not audited. Do not use in production!!

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Imports
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // ERC20 interface
import "@openzeppelin/contracts/access/Ownable.sol"; //  Ownable.sol
import "./Sale.sol"; // Sale Contract

// Errors
error WrongValue();

contract Factory is Ownable {
    // Sale Counters
    uint256 public saleCounter;

    // Users to sale mapping
    mapping(address => uint256[]) internal userToSales;

    // Id to sale mapping
    mapping(uint256 => address) internal saleIdToAddress;

    // Array of sales
    address[] internal sales;

    // Payment Token Will Be Always the same
    IERC20 public paymentToken;

    // Events
    event SaleCreated(uint256 index, address saleAddress);

    constructor(IERC20 _paymentToken) Ownable() {
        paymentToken = _paymentToken;
    }

    // Create a new sale
    function createSale(
        string memory _name,
        uint256 _numberOfPortions,
        uint256 _timeBetweenPortions,
        uint256 _price,
        IERC20 _projectToken
    ) public {
        // Check if the user is the owner

        // Create a new sale
        Sale newSale = new Sale(
            _name,
            _numberOfPortions,
            _timeBetweenPortions,
            _price,
            msg.sender,
            _projectToken,
            paymentToken
        );

        address saleAddress = address(newSale);

        // Add the sale to the array
        sales.push(address(saleAddress));

        // Add the sale to the mapping
        saleIdToAddress[saleCounter] = saleAddress;

        // Add the sale to the mapping
        userToSales[msg.sender].push(saleCounter);

        // Increase the sale counter
        saleCounter++;

        // Emit the event
        emit SaleCreated(saleCounter - 1, saleAddress);
    }

    // Getter function for users' sales
    function getUserSales(address _user)
        public
        view
        returns (uint256[] memory)
    {
        return userToSales[_user];
    }

    // Getter function for msg.sender's sales
    function getMySales() external view returns (uint256[] memory) {
        return getUserSales(msg.sender);
    }

    // Getter function for sale with id
    function getSale(uint256 _saleId)
        public
        view
        returns (address saleAddress)
    {
        return saleIdToAddress[_saleId];
    }

    // Getter function for sales length
    function getSalesLength() public view returns (uint256 length) {
        return sales.length;
    }

    // External function for pagination for sales
    function getSales(uint256 start, uint256 end)
        external
        view
        returns (address[] memory saleAddresses)
    {
        require(end > start, "End index must be greater than start index");
        require(
            end < sales.length,
            "End index must be less than or equal to sales length"
        );

        saleAddresses = new address[](end - start);

        uint256 index;
        for (index = start; index < end; index++) {
            saleAddresses[index - start] = sales[index];
        }

        return saleAddresses;
    }
}
