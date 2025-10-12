// SPDX-License-Identifier: MIT
pragma solidity ^0.5.11;

contract SimpleStorage {
    uint256 private storedData;
    address public owner;
    
    event DataStored(uint256 indexed data, address indexed from);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function store(uint256 _data) public {
        storedData = _data;
        emit DataStored(_data, msg.sender);
    }
    
    function retrieve() public view returns (uint256) {
        return storedData;
    }
    
    function getOwner() public view returns (address) {
        return owner;
    }
    
    // Function to send ETH to the contract
    function deposit() public payable {
        require(msg.value > 0, "Must send some ETH");
    }
    
    // Function to withdraw ETH (only owner)
    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner).transfer(amount);
    }
    
    // Get contract balance
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
