const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Deploying contracts with the account:", (await ethers.getSigners())[0].address);
  console.log("Vendor Address from .env:", process.env.VENDOR_ADDRESS);

  const TicketToken = await ethers.getContractFactory("TicketToken");
  const ticketPrice = ethers.parseEther("0.01");
  const vendorAddress = process.env.VENDOR_ADDRESS;

  const ticketToken = await TicketToken.deploy(ticketPrice, vendorAddress);

  console.log("Deployment transaction hash:", ticketToken.deploymentTransaction.hash);

  await ticketToken.waitForDeployment();

  console.log("TicketToken deployed to:", ticketToken.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
