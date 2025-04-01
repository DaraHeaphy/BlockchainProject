pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketToken is ERC20, Ownable {
    uint256 public ticketPrice;
    address public vendor;

    event TicketPurchased(address indexed buyer, uint256 amountUsed, uint256 ticketsMinted);

    constructor(uint256 _ticketPrice, address _vendor) 
        ERC20("TicketToken", "TKT")
        Ownable(msg.sender)
    {
        ticketPrice = _ticketPrice;
        vendor = _vendor;
    }

    /**
     * @notice Purchase tickets by sending SETH (native cryptocurrency on Sepolia)
     * @dev The function calculates the number of tickets based on msg.value.
     *      If excess funds are sent (not enough for a whole ticket), they are refunded.
     */
    function purchaseTicket() external payable {
        require(msg.value >= ticketPrice, "Insufficient funds for a ticket");

        uint256 ticketsToMint = msg.value / ticketPrice;
        require(ticketsToMint > 0, "Not enough funds for one ticket");

        uint256 usedAmount = ticketsToMint * ticketPrice;
        uint256 remainder = msg.value - usedAmount;
        if (remainder > 0) {
            payable(msg.sender).transfer(remainder);
        }

        _mint(msg.sender, ticketsToMint);

        payable(vendor).transfer(usedAmount);

        emit TicketPurchased(msg.sender, usedAmount, ticketsToMint);
    }
}
