// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketToken is ERC20, Ownable {
    uint256 public ticketPrice; // Price per ticket in wei
    address public vendor;      // Vendor (or event organizer) address

    // Event emitted when a ticket is purchased
    event TicketPurchased(address indexed buyer, uint256 amountUsed, uint256 ticketsMinted);

    // Constructor sets the initial ticket price and vendor address.
    // Here, we pass msg.sender to Ownable to set the deployer as the initial owner.
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

        // Calculate how many whole tickets the buyer can purchase
        uint256 ticketsToMint = msg.value / ticketPrice;
        require(ticketsToMint > 0, "Not enough funds for one ticket");

        // Calculate used amount and refund any remainder
        uint256 usedAmount = ticketsToMint * ticketPrice;
        uint256 remainder = msg.value - usedAmount;
        if (remainder > 0) {
            payable(msg.sender).transfer(remainder);
        }

        // Mint the appropriate number of ticket tokens to the buyer
        _mint(msg.sender, ticketsToMint);

        // Forward the used funds to the vendor
        payable(vendor).transfer(usedAmount);

        emit TicketPurchased(msg.sender, usedAmount, ticketsToMint);
    }
}
