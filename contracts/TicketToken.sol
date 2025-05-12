pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketToken is ERC20, Ownable {
    uint256 public ticketPrice;
    address public vendor;

    event TicketPurchased(address indexed buyer, uint256 amountUsed, uint256 ticketsTransferred);

    constructor(
        uint256 _ticketPrice,
        address _vendor,
        uint256 _initialSupply
    )
        ERC20("TicketToken", "TKT")
        Ownable(msg.sender)
    {
        ticketPrice = _ticketPrice;
        vendor      = _vendor;
        _mint(address(this), _initialSupply);
    }

    function purchaseTicket() external payable {
        require(msg.value >= ticketPrice, "Insufficient funds");
        uint256 ticketsToBuy = msg.value / ticketPrice;
        require(ticketsToBuy > 0, "Need at least one ticket");
        require(balanceOf(address(this)) >= ticketsToBuy, "Sold out");

        uint256 used = ticketsToBuy * ticketPrice;
        // refund any extra
        if (msg.value > used) payable(msg.sender).transfer(msg.value - used);

        // transfer tokens from pool to buyer
        _transfer(address(this), msg.sender, ticketsToBuy);

        // forward funds
        payable(vendor).transfer(used);

        emit TicketPurchased(msg.sender, used, ticketsToBuy);
    }
}
