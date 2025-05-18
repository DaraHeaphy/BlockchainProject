pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketToken is ERC20, Ownable {
    uint256 public immutable ticketPrice;
    address public immutable vendor;

    struct Wallet {
        bytes32 passwordHash;
        bool exists;
    }
    mapping(address => Wallet) private wallets;

    event WalletCreated(address indexed user);
    event TicketPurchased(address indexed buyer, uint256 amountPaid, uint256 ticketsTransferred);
    event TicketReturned(address indexed user, uint256 ticketsReturned);
    event VendorWithdrawal(address indexed vendorAddress, uint256 amount);

    constructor(
        uint256 _ticketPrice,
        address _vendor,
        uint256 _initialSupply
    )
        ERC20("TicketToken", "TKT")
        Ownable(msg.sender)
    {
        require(_ticketPrice > 0, "ticketPrice must be > 0");
        require(_vendor      != address(0), "Invalid vendor");
        require(_initialSupply > 0, "initialSupply must be > 0");

        ticketPrice = _ticketPrice;
        vendor      = _vendor;
        _mint(address(this), _initialSupply);
    }

    function createWallet(string calldata password) external {
        require(!wallets[msg.sender].exists, "Already exists");
        wallets[msg.sender] = Wallet({
            passwordHash: keccak256(abi.encodePacked(password)),
            exists:       true
        });
        emit WalletCreated(msg.sender);
    }

    function purchaseTicket() external payable {
        require(wallets[msg.sender].exists, "No wallet");
        require(msg.value >= ticketPrice, "Too little ETH");

        uint256 count = msg.value / ticketPrice;
        require(count > 0, "Must buy >= 1 ticket");
        require(msg.value % ticketPrice == 0, "Send exact multiples of ticketPrice");
        require(balanceOf(address(this)) >= count, "Sold out");

        _transfer(address(this), msg.sender, count);
        emit TicketPurchased(msg.sender, msg.value, count);
    }

    function returnTickets(uint256 count) external {
        require(wallets[msg.sender].exists, "No wallet");
        require(balanceOf(msg.sender) >= count,     "Not enough tickets");

        _transfer(msg.sender, address(this), count);
        emit TicketReturned(msg.sender, count);
    }

    function withdrawVendor(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "No funds");
        (bool ok, ) = payable(vendor).call{ value: amount }("");
        require(ok, "Withdraw failed");
        emit VendorWithdrawal(vendor, amount);
    }
}
