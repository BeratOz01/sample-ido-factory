// !! This contract is not audited. Do not use in production!!

//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Imports
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // ERC20 interface
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; //  Ownable.sol

// Errors
error OnlySaleAdmin();

contract Sale is ReentrancyGuard {
    // User address to Participant struct
    mapping(address => Participant) internal userToParticipant;

    // Participant Struct
    struct Participant {
        uint256 vestedAmount; // Total amount of token vested
        uint256 withdrawnAmount; // Total amount of token withdrawn
        bool[] isPortionWithdrawn; // Array of booleans for each portion
    }

    // Infor struct for send data to front end
    struct Info {
        uint256 amount;
        uint256 unlockTime;
        bool isClaimed;
        bool canClaim;
    }

    // Events
    event TokenSold(address user, uint256 amount);
    event TokenWithdrawn(address user, uint256 amount);
    event OwnerWithdrawn(uint256 amount);

    // Admin of sale
    address public admin;

    // Distribution Dates
    uint256[] public distributionDates;

    // Number of portions for locking
    uint256 public numberOfPortions;

    // Time between portions
    uint256 public timeBetweenPortions;

    // Price (Should be in ether)
    uint256 public price;

    // Project && Payment Token
    IERC20 public projectToken;
    IERC20 public paymentToken;

    // Minimum distribution amount
    uint256 public minDistributionAmount;

    // Maximum distribution amount
    uint256 public maxDistributionAmount;

    // Total Token For Sale
    uint256 public totalTokenForBuyed;

    // Total Token Withdrawn
    uint256 public totalTokenWithdrawn;

    // Sale Name
    string public name;

    constructor(
        string memory _name,
        uint256 _numberOfPortion,
        uint256 _timeBetweenPortions,
        uint256 _price,
        address _admin,
        IERC20 _projectToken,
        IERC20 _paymentToken
    ) {
        // Set name of sale
        name = _name;

        // Setting admin
        admin = _admin;

        // Setting number of portions
        numberOfPortions = _numberOfPortion;

        // Setting time between portions
        timeBetweenPortions = _timeBetweenPortions;

        // Setting price
        price = _price;

        // Setting distribution dates
        distributionDates = new uint256[](numberOfPortions);

        uint256 index;
        for (index; index < numberOfPortions; index++) {
            distributionDates[index] =
                block.timestamp +
                (index + 1) *
                timeBetweenPortions;
        }

        // Setting project && payment token
        projectToken = _projectToken;
        paymentToken = _paymentToken;

        // Setting min & max distribution amount
        minDistributionAmount = 1 ether;
        maxDistributionAmount = 10 ether;
    }

    // Modifier
    // Only Sale Admin Modifier
    modifier onlySaleAdmin() {
        if (msg.sender != admin) {
            revert OnlySaleAdmin();
        }
        _;
    }

    // TODO => Setter function for admin

    function buy(uint256 amountInPaymentToken) external nonReentrant {
        // Local variable for msg.sender
        address user = msg.sender;

        // Distribution amount should be between minimum and maximum amount of payment token
        if (
            amountInPaymentToken < minDistributionAmount ||
            amountInPaymentToken > maxDistributionAmount
        ) {
            revert(
                "Amount should be between minimum and maximum amount of payment token"
            );
        }

        // Amount of project token
        uint256 amountOfProjectToken = (amountInPaymentToken * 10**18) / price;

        require(paymentToken.transferFrom(user, admin, amountInPaymentToken));

        updateParticipant(user, amountOfProjectToken);
    }

    // Internal function for update participant
    function updateParticipant(address participant, uint256 amount) internal {
        // Contract should have enough token for distribution
        require(
            totalTokenForBuyed - totalTokenWithdrawn + amount <=
                projectToken.balanceOf(address(this)),
            "Not enough tokens for distribution."
        );

        // Every user can only buy once
        require(
            userToParticipant[participant].vestedAmount == 0,
            "User already participated in this sale."
        );

        bool[] memory isPortionWithdrawn = new bool[](distributionDates.length);

        // Update participant struct in mapping
        userToParticipant[participant].vestedAmount += amount;
        userToParticipant[participant].isPortionWithdrawn = isPortionWithdrawn;

        // Update total token buyed variable
        totalTokenForBuyed = totalTokenForBuyed + amount;

        emit TokenSold(participant, amount);
    }

    function withdraw() public nonReentrant {
        // Local variable user for msg.sender
        address user = msg.sender;

        // Local variable for participant struct
        Participant storage participant = userToParticipant[user];

        // User should not have withdrawn all of the token
        require(
            participant.vestedAmount - participant.withdrawnAmount != 0,
            "User has already withdrawn all of the token."
        );

        // Local Variables
        uint256 withdrawAmount;

        bool isPortionUnlocked;
        uint256 length = distributionDates.length; // For Gas Optimization

        uint256 index;
        for (index; index < length; index++) {
            isPortionUnlocked = block.timestamp > distributionDates[index];

            if (isPortionUnlocked && !participant.isPortionWithdrawn[index]) {
                withdrawAmount = participant.vestedAmount / numberOfPortions;
                participant.isPortionWithdrawn[index] = true;
            }
        }

        require(withdrawAmount > 0, "Nothing to withdraw");

        // Update participant struct in mapping
        participant.withdrawnAmount += withdrawAmount;

        // Update total token withdrawn variable
        totalTokenWithdrawn = totalTokenWithdrawn + withdrawAmount;

        // Transfer token to user
        require(projectToken.transfer(user, withdrawAmount));

        emit TokenWithdrawn(user, withdrawAmount);
    }

    // Get Info From User
    function getInfo(address user) public view returns (Info[] memory) {
        // Local variable for participant struct
        Participant storage participant = userToParticipant[user];

        // Local variable for info struct
        Info[] memory info = new Info[](distributionDates.length);

        uint256 index;
        uint256 length = distributionDates.length;

        for (index; index < length; index++) {
            info[index].amount = (participant.vestedAmount / numberOfPortions);
            info[index].unlockTime = distributionDates[index];
            info[index].isClaimed = participant.isPortionWithdrawn[index];
            info[index].canClaim = block.timestamp > distributionDates[index];
        }

        return info;
    }

    // Get Info From msg.sender
    function getInfo__sender() external view returns (Info[] memory) {
        return getInfo(msg.sender);
    }

    // Get distribution dates
    function getDistributionDates() public view returns (uint256[] memory) {
        return distributionDates;
    }
}
