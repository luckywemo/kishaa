// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MultiSigWallet
 * @dev A simple multi-signature wallet for enhanced security
 */
contract MultiSigWallet {
    address[] public owners;
    uint256 public required;
    uint256 public transactionCount;
    
    struct Transaction {
        address destination;
        uint256 value;
        bytes data;
        bool executed;
    }
    
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;
    
    event Deposit(address indexed sender, uint256 value);
    event Submission(uint256 indexed transactionId);
    event Confirmation(address indexed owner, uint256 indexed transactionId);
    event Execution(uint256 indexed transactionId);
    event ExecutionFailure(uint256 indexed transactionId);
    
    modifier validRequirement(uint256 ownerCount, uint256 _required) {
        require(ownerCount >= _required && _required > 0 && ownerCount <= 50, "Invalid requirement");
        _;
    }
    
    modifier ownerExists(address owner) {
        require(isOwner(owner), "Owner does not exist");
        _;
    }
    
    modifier confirmed(uint256 transactionId, address owner) {
        require(confirmations[transactionId][owner], "Transaction not confirmed by owner");
        _;
    }
    
    modifier notExecuted(uint256 transactionId) {
        require(!transactions[transactionId].executed, "Transaction already executed");
        _;
    }
    
    modifier notNull(address _address) {
        require(_address != address(0), "Address cannot be zero");
        _;
    }
    
    constructor(address[] memory _owners, uint256 _required) 
        validRequirement(_owners.length, _required) 
    {
        for (uint256 i = 0; i < _owners.length; i++) {
            require(!isOwner(_owners[i]) && _owners[i] != address(0), "Invalid owner");
            owners.push(_owners[i]);
        }
        required = _required;
    }
    
    receive() external payable {
        if (msg.value > 0) {
            emit Deposit(msg.sender, msg.value);
        }
    }
    
    function isOwner(address owner) public view returns (bool) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == owner) {
                return true;
            }
        }
        return false;
    }
    
    function submitTransaction(address destination, uint256 value, bytes memory data) 
        public 
        ownerExists(msg.sender)
        returns (uint256 transactionId) 
    {
        transactionId = addTransaction(destination, value, data);
        confirmTransaction(transactionId);
    }
    
    function confirmTransaction(uint256 transactionId) 
        public 
        ownerExists(msg.sender) 
    {
        require(!confirmations[transactionId][msg.sender], "Already confirmed");
        confirmations[transactionId][msg.sender] = true;
        emit Confirmation(msg.sender, transactionId);
        executeTransaction(transactionId);
    }
    
    function revokeConfirmation(uint256 transactionId) 
        public 
        ownerExists(msg.sender) 
    {
        require(confirmations[transactionId][msg.sender], "Transaction not confirmed");
        require(!transactions[transactionId].executed, "Transaction already executed");
        confirmations[transactionId][msg.sender] = false;
        emit Confirmation(msg.sender, transactionId);
    }
    
    function executeTransaction(uint256 transactionId) 
        public 
        ownerExists(msg.sender) 
        notExecuted(transactionId) 
    {
        if (isConfirmed(transactionId)) {
            Transaction storage txn = transactions[transactionId];
            txn.executed = true;
            if (external_call(txn.destination, txn.value, txn.data.length, txn.data)) {
                emit Execution(transactionId);
            } else {
                emit ExecutionFailure(transactionId);
                txn.executed = false;
            }
        }
    }
    
    function isConfirmed(uint256 transactionId) public view returns (bool) {
        uint256 count = 0;
        for (uint256 i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]]) {
                count += 1;
            }
            if (count == required) {
                return true;
            }
        }
        return false;
    }
    
    function addTransaction(address destination, uint256 value, bytes memory data) 
        internal 
        notNull(destination) 
        returns (uint256 transactionId) 
    {
        transactionId = transactionCount;
        transactions[transactionId] = Transaction({
            destination: destination,
            value: value,
            data: data,
            executed: false
        });
        transactionCount += 1;
        emit Submission(transactionId);
    }
    
    function getConfirmationCount(uint256 transactionId) public view returns (uint256 count) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]]) {
                count += 1;
            }
        }
    }
    
    function getTransactionIds(uint256 from, uint256 to, bool pending, bool executed) 
        public 
        view 
        returns (uint256[] memory _transactionIds) 
    {
        uint256[] memory transactionIdsTemp = new uint256[](transactionCount);
        uint256 count = 0;
        uint256 i;
        for (i = 0; i < transactionCount; i++) {
            if ((pending && !transactions[i].executed) || (executed && transactions[i].executed)) {
                transactionIdsTemp[count] = i;
                count += 1;
            }
        }
        _transactionIds = new uint256[](to - from);
        for (i = from; i < to; i++) {
            _transactionIds[i - from] = transactionIdsTemp[i];
        }
    }
    
    function external_call(address destination, uint256 value, uint256 dataLength, bytes memory data) 
        internal 
        returns (bool) 
    {
        bool result;
        assembly {
            let x := mload(0x40)   // "Allocate" memory for output (0x40 is where "free memory" pointer is stored by convention)
            let d := add(data, 32) // First 32 bytes are the padded length of data, so actual data starts at +32
            result := call(
                gas(),
                destination,
                value,
                d,
                dataLength,        // Size of the input (in bytes) - this is what fixes the padding problem
                x,
                0                  // Output is ignored, therefore the output size is zero
            )
        }
        return result;
    }
}
