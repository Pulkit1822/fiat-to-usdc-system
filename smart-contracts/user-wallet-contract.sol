pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UserWallet is Ownable, ReentrancyGuard {
    IERC20 public usdcToken;
    mapping(address => uint256) public balances;

    event FundsDeposited(address indexed user, uint256 amount);
    event FundsWithdrawn(address indexed user, uint256 amount);
    event FundsTransferred(address indexed from, address indexed to, uint256 amount);

    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
    }

    function depositFunds(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        usdcToken.transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
        emit FundsDeposited(msg.sender, amount);
    }

    function withdrawFunds(uint256 amount) external nonReentrant {
        require(amount <= balances[msg.sender], "Insufficient funds");
        usdcToken.transfer(msg.sender, amount);
        balances[msg.sender] -= amount;
        emit FundsWithdrawn(msg.sender, amount);
    }

    function transferFunds(address to, uint256 amount) external nonReentrant {
        require(amount <= balances[msg.sender], "Insufficient funds");
        usdcToken.transfer(to, amount);
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit FundsTransferred(msg.sender, to, amount);
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
