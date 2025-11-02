// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SimpleAMM
 * @dev A simple Automated Market Maker for token swapping
 */
contract SimpleAMM {
    address public tokenA;
    address public tokenB;
    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalLiquidity;
    
    mapping(address => uint256) public liquidityProviders;
    
    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event Swap(address indexed user, address indexed tokenIn, uint256 amountIn, uint256 amountOut);
    
    modifier validToken(address token) {
        require(token == tokenA || token == tokenB, "Invalid token");
        _;
    }
    
    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }
    
    // Add liquidity to the pool
    function addLiquidity(uint256 amountA, uint256 amountB) public returns (uint256 liquidity) {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");
        
        // Transfer tokens from user to this contract
        require(transferFrom(tokenA, msg.sender, address(this), amountA), "Transfer A failed");
        require(transferFrom(tokenB, msg.sender, address(this), amountB), "Transfer B failed");
        
        if (totalLiquidity == 0) {
            liquidity = amountA; // Initial liquidity
        } else {
            liquidity = (amountA * totalLiquidity) / reserveA;
        }
        
        reserveA += amountA;
        reserveB += amountB;
        totalLiquidity += liquidity;
        liquidityProviders[msg.sender] += liquidity;
        
        emit LiquidityAdded(msg.sender, amountA, amountB, liquidity);
    }
    
    // Remove liquidity from the pool
    function removeLiquidity(uint256 liquidity) public returns (uint256 amountA, uint256 amountB) {
        require(liquidity > 0, "Liquidity must be greater than 0");
        require(liquidityProviders[msg.sender] >= liquidity, "Insufficient liquidity");
        
        amountA = (liquidity * reserveA) / totalLiquidity;
        amountB = (liquidity * reserveB) / totalLiquidity;
        
        reserveA -= amountA;
        reserveB -= amountB;
        totalLiquidity -= liquidity;
        liquidityProviders[msg.sender] -= liquidity;
        
        // Transfer tokens back to user
        require(transfer(tokenA, msg.sender, amountA), "Transfer A back failed");
        require(transfer(tokenB, msg.sender, amountB), "Transfer B back failed");
        
        emit LiquidityRemoved(msg.sender, amountA, amountB, liquidity);
    }
    
    // Swap tokens using constant product formula (x * y = k)
    function swap(address tokenIn, uint256 amountIn) public validToken(tokenIn) returns (uint256 amountOut) {
        require(amountIn > 0, "Amount in must be greater than 0");
        
        address tokenOut = tokenIn == tokenA ? tokenB : tokenA;
        
        // Calculate amount out using constant product formula
        if (tokenIn == tokenA) {
            amountOut = (amountIn * reserveB) / (reserveA + amountIn);
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            amountOut = (amountIn * reserveA) / (reserveB + amountIn);
            reserveB += amountIn;
            reserveA -= amountOut;
        }
        
        // Transfer tokens
        require(transferFrom(tokenIn, msg.sender, address(this), amountIn), "Transfer in failed");
        require(transfer(tokenOut, msg.sender, amountOut), "Transfer out failed");
        
        emit Swap(msg.sender, tokenIn, amountIn, amountOut);
    }
    
    // Get amount out for a given amount in (view function)
    function getAmountOut(address tokenIn, uint256 amountIn) public view validToken(tokenIn) returns (uint256 amountOut) {
        if (amountIn == 0) return 0;
        
        if (tokenIn == tokenA) {
            amountOut = (amountIn * reserveB) / (reserveA + amountIn);
        } else {
            amountOut = (amountIn * reserveA) / (reserveB + amountIn);
        }
    }
    
    // Get reserves
    function getReserves() public view returns (uint256 _reserveA, uint256 _reserveB) {
        _reserveA = reserveA;
        _reserveB = reserveB;
    }
    
    // Helper function to transfer tokens (simplified - assumes tokens are ERC20)
    function transfer(address token, address to, uint256 amount) internal returns (bool) {
        // This is a simplified version - in practice you'd use proper ERC20 interface
        // For this example, we'll assume the tokens are already in this contract
        return true;
    }
    
    // Helper function to transfer tokens from user (simplified - assumes tokens are ERC20)
    function transferFrom(address token, address from, address to, uint256 amount) internal returns (bool) {
        // This is a simplified version - in practice you'd use proper ERC20 interface
        // For this example, we'll assume the user has approved this contract
        return true;
    }
    
    // Emergency function to withdraw tokens (only for testing)
    function emergencyWithdraw(address token, uint256 amount) public {
        // This should be restricted to owner in production
        require(transfer(token, msg.sender, amount), "Emergency withdraw failed");
    }
}
