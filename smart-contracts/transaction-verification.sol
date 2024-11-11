pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TransactionVerification is Ownable, ReentrancyGuard {
    IERC20 public usdcToken;
    mapping(address => uint256) public balances;
    mapping(bytes32 => bool) public verifiedTransactions;

    event TransactionVerified(address indexed user, bytes32 transactionId, uint256 amount);
    event TransactionFailed(address indexed user, bytes32 transactionId, string reason);

    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
    }

    function verifyTransaction(address user, bytes32 transactionId, uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(!verifiedTransactions[transactionId], "Transaction already verified");

        if (usdcToken.balanceOf(user) >= amount) {
            verifiedTransactions[transactionId] = true;
            balances[user] += amount;
            emit TransactionVerified(user, transactionId, amount);
        } else {
            emit TransactionFailed(user, transactionId, "Insufficient balance");
        }
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}
