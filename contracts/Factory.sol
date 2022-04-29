// !! This contract is not audited. Do not use in production!!

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Imports
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // ERC20 interface
import "@openzeppelin/contracts/access/Ownable.sol"; //  Ownable.sol
import "./Sale.sol"; // Sale Contract
import "./Portfolio.sol";

contract Factory is Ownable {
    // Sale Counters
    uint256 public saleCounter;

    // Maximum amount for creating IDO
    uint256 public constant maxAmount = 5;

    // Users to sale mapping
    mapping(address => uint256[]) internal userToSales;

    // Id to sale mapping
    mapping(uint256 => InfoSale) internal saleIdToSale;

    // Is Sale mapping for checking if sale is valid for add to portfolio
    mapping(address => bool) internal isSale;

    // Array of sales
    address[] internal sales;

    // Payment Token Will Be Always the same
    IERC20 public paymentToken;

    // Portfolio Contract
    Portfolio public portfolioContract;

    // Sale Struct
    struct InfoSale {
        uint256 id;
        address saleAddress;
        uint256 price;
        uint256 numberOfPortions;
        uint256 timeBetweenPortions;
        address projectToken;
    }

    // Events
    event SaleCreated(uint256 index, InfoSale infoSale);

    constructor(IERC20 _paymentToken, Portfolio _portfolio) Ownable() {
        paymentToken = _paymentToken;
        portfolioContract = _portfolio;
    }

    // Create a new sale
    function createSale(
        string memory _name,
        uint256 _numberOfPortions,
        uint256 _timeBetweenPortions,
        uint256 _price,
        IERC20 _projectToken
    ) public {
        // Check if the sale is not full
        require(userToSales[msg.sender].length < maxAmount, "Sale is full");

        // Create a new sale
        Sale newSale = new Sale(
            saleCounter,
            _name,
            _numberOfPortions,
            _timeBetweenPortions,
            _price,
            msg.sender,
            _projectToken,
            paymentToken,
            portfolioContract
        );

        address saleAddress = address(newSale);

        // Add the sale to the array
        sales.push(address(saleAddress));

        // Make sale valid
        isSale[saleAddress] = true;

        // Edit saleIdToSale mapping
        saleIdToSale[saleCounter].id = saleCounter;
        saleIdToSale[saleCounter].saleAddress = saleAddress;
        saleIdToSale[saleCounter].price = _price;
        saleIdToSale[saleCounter].numberOfPortions = _numberOfPortions;
        saleIdToSale[saleCounter].timeBetweenPortions = _timeBetweenPortions;
        saleIdToSale[saleCounter].projectToken = address(_projectToken);

        // Add the sale to the users collection mapping
        userToSales[msg.sender].push(saleCounter);

        // Increase the sale counter
        saleCounter++;

        // Emit the event
        emit SaleCreated(saleCounter - 1, saleIdToSale[saleCounter - 1]);
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
        returns (InfoSale memory saleAddress)
    {
        return saleIdToSale[_saleId];
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

    // External function for check validness of the address
    function isSaleValid(address _saleAddress) external view returns (bool) {
        return isSale[_saleAddress];
    }
}
