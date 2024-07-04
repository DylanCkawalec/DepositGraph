// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DepositGraph is Ownable {
    address public admin;
    mapping(uint256 => address) public indexToAddress;
    mapping(address => uint256) public addressToIndex;
    mapping(address => uint256) public shares;
    uint256 public userCount;
    uint256 public constant SHARES_PER_ETH = 100000;
    uint256 public chainId;

    event SharesUpdated(address indexed user, uint256 newShares, uint256 chainId);
    event WithdrawalRequested(address indexed user, uint256 sharesWithdrawn, uint256 ethAmount, uint256 chainId);
    event ChainIdSet(uint256 chainId);

    constructor(address _admin) Ownable(_admin) {
        admin = _admin;
        chainId = block.chainid;
        emit ChainIdSet(chainId);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function signUp() external {
        require(addressToIndex[msg.sender] == 0, "User already signed up");
        userCount++;
        indexToAddress[userCount] = msg.sender;
        addressToIndex[msg.sender] = userCount;
    }

    function deposit() external payable {
        require(addressToIndex[msg.sender] != 0, "User not signed up");
        uint256 newShares = msg.value * SHARES_PER_ETH / 1 ether;
        shares[msg.sender] += newShares;
        emit SharesUpdated(msg.sender, shares[msg.sender], chainId);
    }

    function withdraw(uint256 _shares) external {
        require(shares[msg.sender] >= _shares, "Insufficient shares");
        uint256 ethAmount = _shares * 1 ether / SHARES_PER_ETH;
        shares[msg.sender] -= _shares;
        emit WithdrawalRequested(msg.sender, _shares, ethAmount, chainId);
        payable(msg.sender).transfer(ethAmount);
    }

    function blobUpdate(string memory _blob) external onlyAdmin {
        uint256 i = 0;
        uint256 index;
        bool increase;
        uint256 amount;

        while (i < bytes(_blob).length) {
            (index, i) = parseNumber(_blob, i);
            require(indexToAddress[index] != address(0), "Invalid index");

            if (bytes(_blob)[i] == 'x') {
                increase = true;
                i++;
            } else if (bytes(_blob)[i] == 'y') {
                increase = false;
                i++;
            } else {
                revert("Invalid operation");
            }

            (amount, i) = parseNumber(_blob, i);

            if (increase) {
                shares[indexToAddress[index]] += amount;
            } else {
                require(shares[indexToAddress[index]] >= amount, "Insufficient shares");
                shares[indexToAddress[index]] -= amount;
            }

            emit SharesUpdated(indexToAddress[index], shares[indexToAddress[index]], chainId);

            if (i < bytes(_blob).length && bytes(_blob)[i] == 'z') {
                i++;
            }
        }
    }

    function parseNumber(string memory _str, uint256 _start) internal pure returns (uint256, uint256) {
        uint256 result = 0;
        uint256 i = _start;
        while (i < bytes(_str).length && bytes(_str)[i] >= '0' && bytes(_str)[i] <= '9') {
            result = result * 10 + (uint8(bytes(_str)[i]) - 48);
            i++;
        }
        return (result, i);
    }
}
