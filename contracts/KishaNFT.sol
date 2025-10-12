// SPDX-License-Identifier: MIT
pragma solidity ^0.5.11;

/**
 * @title KishaNFT
 * @dev A simple ERC721-like NFT contract for the Kisha project
 */
contract KishaNFT {
    string public name = "Kisha NFT Collection";
    string public symbol = "KISHNFT";
    string public baseURI = "https://api.kisha.com/nft/";
    
    uint256 public totalSupply;
    uint256 public maxSupply = 10000;
    uint256 public mintPrice = 0.01 ether;
    uint256 public maxMintPerTx = 10;
    
    address public owner;
    bool public mintingActive = true;
    
    mapping(uint256 => address) public tokenOwners;
    mapping(address => uint256) public balances;
    mapping(uint256 => address) public tokenApprovals;
    mapping(address => mapping(address => bool)) public operatorApprovals;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event Mint(address indexed to, uint256 indexed tokenId, string tokenURI);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier mintingEnabled() {
        require(mintingActive, "Minting is not active");
        _;
    }
    
    modifier validTokenId(uint256 tokenId) {
        require(tokenId > 0 && tokenId <= totalSupply, "Invalid token ID");
        _;
    }
    
    constructor() public {
        owner = msg.sender;
    }
    
    // Mint NFTs
    function mint(uint256 quantity) public payable mintingEnabled {
        require(quantity > 0 && quantity <= maxMintPerTx, "Invalid quantity");
        require(totalSupply + quantity <= maxSupply, "Exceeds max supply");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");
        
        for (uint256 i = 0; i < quantity; i++) {
            totalSupply++;
            uint256 tokenId = totalSupply;
            tokenOwners[tokenId] = msg.sender;
            balances[msg.sender]++;
            
            emit Transfer(address(0), msg.sender, tokenId);
            emit Mint(msg.sender, tokenId, string(abi.encodePacked(baseURI, uint2str(tokenId))));
        }
    }
    
    // Owner mint (free)
    function ownerMint(address to, uint256 quantity) public onlyOwner {
        require(quantity > 0, "Quantity must be greater than 0");
        require(totalSupply + quantity <= maxSupply, "Exceeds max supply");
        
        for (uint256 i = 0; i < quantity; i++) {
            totalSupply++;
            uint256 tokenId = totalSupply;
            tokenOwners[tokenId] = to;
            balances[to]++;
            
            emit Transfer(address(0), to, tokenId);
            emit Mint(to, tokenId, string(abi.encodePacked(baseURI, uint2str(tokenId))));
        }
    }
    
    // Transfer NFT
    function transfer(address to, uint256 tokenId) public validTokenId(tokenId) {
        require(tokenOwners[tokenId] == msg.sender, "Not the owner");
        require(to != address(0), "Cannot transfer to zero address");
        
        tokenOwners[tokenId] = to;
        balances[msg.sender]--;
        balances[to]++;
        
        emit Transfer(msg.sender, to, tokenId);
    }
    
    // Approve token for transfer
    function approve(address to, uint256 tokenId) public validTokenId(tokenId) {
        require(tokenOwners[tokenId] == msg.sender || tokenApprovals[tokenId] == msg.sender, "Not authorized");
        
        tokenApprovals[tokenId] = to;
        emit Approval(tokenOwners[tokenId], to, tokenId);
    }
    
    // Set approval for all
    function setApprovalForAll(address operator, bool approved) public {
        operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    
    // Transfer from (for approved addresses)
    function transferFrom(address from, address to, uint256 tokenId) public validTokenId(tokenId) {
        require(
            tokenOwners[tokenId] == msg.sender || 
            tokenApprovals[tokenId] == msg.sender || 
            operatorApprovals[tokenOwners[tokenId]][msg.sender],
            "Not authorized"
        );
        
        tokenOwners[tokenId] = to;
        balances[from]--;
        balances[to]++;
        tokenApprovals[tokenId] = address(0);
        
        emit Transfer(from, to, tokenId);
    }
    
    // View functions
    function ownerOf(uint256 tokenId) public view validTokenId(tokenId) returns (address) {
        return tokenOwners[tokenId];
    }
    
    function balanceOf(address owner) public view returns (uint256) {
        return balances[owner];
    }
    
    function getApproved(uint256 tokenId) public view validTokenId(tokenId) returns (address) {
        return tokenApprovals[tokenId];
    }
    
    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return operatorApprovals[owner][operator];
    }
    
    function tokenURI(uint256 tokenId) public view validTokenId(tokenId) returns (string memory) {
        return string(abi.encodePacked(baseURI, uint2str(tokenId)));
    }
    
    // Owner functions
    function setMintingActive(bool _active) public onlyOwner {
        mintingActive = _active;
    }
    
    function setMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price;
    }
    
    function setMaxMintPerTx(uint256 _max) public onlyOwner {
        maxMintPerTx = _max;
    }
    
    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner).transfer(balance);
    }
    
    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}
