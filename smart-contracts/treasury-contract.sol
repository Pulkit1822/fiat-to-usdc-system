pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Treasury is Ownable, ReentrancyGuard {
    IERC20 public usdcToken;
    address public multiSigWallet;
    uint256 public totalFunds;

    event FundsDeposited(address indexed user, uint256 amount);
    event FundsWithdrawn(address indexed user, uint256 amount);
    event FundsTransferred(address indexed from, address indexed to, uint256 amount);

    constructor(address _usdcToken, address _multiSigWallet) {
        usdcToken = IERC20(_usdcToken);
        multiSigWallet = _multiSigWallet;
    }

    function depositFunds(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        usdcToken.transferFrom(msg.sender, address(this), amount);
        totalFunds += amount;
        emit FundsDeposited(msg.sender, amount);
    }

    function withdrawFunds(uint256 amount) external onlyOwner nonReentrant {
        require(amount <= totalFunds, "Insufficient funds");
        usdcToken.transfer(msg.sender, amount);
        totalFunds -= amount;
        emit FundsWithdrawn(msg.sender, amount);
    }

    function transferFunds(address to, uint256 amount) external onlyOwner nonReentrant {
        require(amount <= totalFunds, "Insufficient funds");
        usdcToken.transfer(to, amount);
        totalFunds -= amount;
        emit FundsTransferred(address(this), to, amount);
    }

    function getBalance() external view returns (uint256) {
        return usdcToken.balanceOf(address(this));
    }
}
