const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const vendorAddress   = process.env.VENDOR_ADDRESS;
  const ticketPriceEth  = process.env.TICKET_PRICE_ETH   || "0.001";
  const initialSupply   = parseInt(process.env.INITIAL_SUPPLY || "1000", 10);

  console.log("Vendor address:    ", vendorAddress);
  console.log("Ticket price (ETH):", ticketPriceEth);
  console.log("Initial supply:    ", initialSupply);

  const ticketPrice = ethers.parseEther(ticketPriceEth);

  const TicketToken = await ethers.getContractFactory("TicketToken");
  const ticketToken = await TicketToken.deploy(
    ticketPrice,
    vendorAddress,
    initialSupply
  );

  console.log("Deployment tx hash:", ticketToken.deploymentTransaction().hash);
  await ticketToken.waitForDeployment();
  console.log("TicketToken deployed to:", ticketToken.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
