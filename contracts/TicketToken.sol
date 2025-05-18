pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketToken is ERC20, Ownable {
    uint256 public ticketPrice;
    address public vendor;

    struct Wallet {
        bytes32 passwordHash;
        bool exists;
    }
    mapping(address => Wallet) private wallets;

    event WalletCreated(address indexed user);
    event TicketPurchased(address indexed buyer, uint256 amountUsed, uint256 ticketsTransferred);
    event TicketReturned(address indexed user, uint256 ticketsReturned, uint256 refundAmount);
    event VendorWithdrawal(address indexed vendorAddress, uint256 amount);

    constructor(
        uint256 _ticketPrice,
        address _vendor,
        uint256 _initialSupply
    ) ERC20("TicketToken", "TKT") 
      Ownable(msg.sender)
    {
        require(_vendor != address(0), "Invalid vendor address");
        ticketPrice = _ticketPrice;
        vendor = _vendor;
        _mint(address(this), _initialSupply);
    }

    function createWallet(string calldata password) external {
        require(!wallets[msg.sender].exists, "Wallet already exists");
        wallets[msg.sender] = Wallet({
            passwordHash: keccak256(abi.encodePacked(password)),
            exists: true
        });
        emit WalletCreated(msg.sender);
    }

    function purchaseTicket() external payable {
        require(wallets[msg.sender].exists, "Wallet does not exist");
        require(msg.value >= ticketPrice, "Insufficient funds");

        uint256 ticketsToBuy = msg.value / ticketPrice;
        require(ticketsToBuy > 0, "Need at least one ticket");
        require(balanceOf(address(this)) >= ticketsToBuy, "Sold out");

        uint256 used = ticketsToBuy * ticketPrice;
        uint256 refund = msg.value - used;
        if (refund > 0) {
            (bool ok, ) = payable(msg.sender).call{ value: refund }("");
            require(ok, "Refund failed");
        }

        _transfer(address(this), msg.sender, ticketsToBuy);
        emit TicketPurchased(msg.sender, used, ticketsToBuy);
    }

    function returnTickets(uint256 count) external {
        require(wallets[msg.sender].exists, "Wallet does not exist");
        require(balanceOf(msg.sender) >= count, "Not enough tickets to return");

        uint256 refundAmount = ticketPrice * count;
        _transfer(msg.sender, address(this), count);

        (bool ok, ) = payable(msg.sender).call{ value: refundAmount }("");
        require(ok, "Refund transfer failed");

        emit TicketReturned(msg.sender, count, refundAmount);
    }

    function withdrawVendor(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient contract balance");
        (bool ok, ) = payable(vendor).call{ value: amount }("");
        require(ok, "Vendor withdrawal failed");
        emit VendorWithdrawal(vendor, amount);
    }
}