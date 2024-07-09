// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DepositGraph is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    address public admin;
    mapping(uint256 => address) public indexToAddress;
    mapping(address => uint256) public addressToIndex;
    mapping(address => uint256) public shares;
    uint256 public userCount;
    uint256 public constant SHARES_PER_TOKEN = 100000;
    uint256 public immutable chainId;

    event SharesUpdated(address indexed user, uint256 newShares, uint256 chainId);
    event WithdrawalRequested(address indexed user, uint256 sharesWithdrawn, uint256 tokenAmount, uint256 chainId);
    event ChainIdSet(uint256 chainId);
    event UserSignedUp(address indexed user, uint256 chainId);
    event Deposit(address indexed user, uint256 amount, uint256 newShares, uint256 chainId);
    event AdminUpdated(address indexed oldAdmin, address indexed newAdmin);

    constructor(address _admin) Ownable() {
        require(_admin != address(0), "Admin address cannot be zero");
        require(msg.sender != address(0), "Deployer address cannot be zero");
        admin = _admin;
        chainId = block.chainid;
        emit ChainIdSet(chainId);
        emit AdminUpdated(address(0), _admin);
        _transferOwnership(_admin);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function signUp() external {
        require(addressToIndex[msg.sender] == 0, "User already signed up");
        userCount = userCount.add(1);
        indexToAddress[userCount] = msg.sender;
        addressToIndex[msg.sender] = userCount;
        emit UserSignedUp(msg.sender, chainId);
    }

   function deposit(uint256 _amountWei) external payable nonReentrant {
    require(addressToIndex[msg.sender] != 0, "User not signed up");
    require(msg.value == _amountWei, "Sent value does not match the specified amount");
    require(_amountWei > 0, "Deposit amount must be greater than 0");
    
    uint256 newShares = (_amountWei * SHARES_PER_TOKEN) / 1 ether;
    shares[msg.sender] = shares[msg.sender] + newShares;
    
    (bool success, ) = payable(admin).call{value: _amountWei}("");
    require(success, "Transfer to admin failed");
    
    emit Deposit(msg.sender, _amountWei, newShares, chainId);
    emit SharesUpdated(msg.sender, shares[msg.sender], chainId);
}

    function requestWithdrawal(uint256 _shares) external nonReentrant {
        require(shares[msg.sender] >= _shares, "Insufficient shares");
        uint256 tokenAmount = _shares.mul(1 ether).div(SHARES_PER_TOKEN);
        shares[msg.sender] = shares[msg.sender].sub(_shares);
        emit WithdrawalRequested(msg.sender, _shares, tokenAmount, chainId);
        emit SharesUpdated(msg.sender, shares[msg.sender], chainId);
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
                i = i.add(1);
            } else if (bytes(_blob)[i] == 'y') {
                increase = false;
                i = i.add(1);
            } else {
                revert("Invalid operation");
            }

            (amount, i) = parseNumber(_blob, i);

            if (increase) {
                shares[indexToAddress[index]] = shares[indexToAddress[index]].add(amount);
            } else {
                require(shares[indexToAddress[index]] >= amount, "Insufficient shares");
                shares[indexToAddress[index]] = shares[indexToAddress[index]].sub(amount);
            }

            emit SharesUpdated(indexToAddress[index], shares[indexToAddress[index]], chainId);

            if (i < bytes(_blob).length && bytes(_blob)[i] == 'z') {
                i = i.add(1);
            }
        }
    }

   function parseNumber(string memory _str, uint256 _start) internal pure returns (uint256, uint256) {
    uint256 result = 0;
    uint256 i = _start;
    while (i < bytes(_str).length && bytes(_str)[i] >= '0' && bytes(_str)[i] <= '9') {
        result = result.mul(10).add((uint8(bytes(_str)[i])) - 48); // Changed `bytes1` to `uint8`
        i = i.add(1);
    }
    return (result, i);
}

    function updateAdmin(address _newAdmin) external onlyOwner {
        require(_newAdmin != address(0), "New admin address cannot be zero");
        address oldAdmin = admin;
        admin = _newAdmin;
        emit AdminUpdated(oldAdmin, _newAdmin);
    }

    function getContractBalance() external view onlyAdmin returns (uint256) {
        return address(this).balance;
    }
}