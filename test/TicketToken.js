const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketToken", function () {
  let ticketToken, owner, vendor, buyer;
  const ticketPrice   = ethers.parseEther("0.01");
  const initialSupply = 1000n;

  beforeEach(async function () {
    [owner, vendor, buyer] = await ethers.getSigners();
    const TicketToken = await ethers.getContractFactory("TicketToken", owner);
    ticketToken = await TicketToken.deploy(
      ticketPrice,
      vendor.address,
      initialSupply
    );
    await ticketToken.waitForDeployment();
    ticketToken.address = ticketToken.target;
  });

  it("should initialize with correct values and supply", async function () {
    expect(await ticketToken.ticketPrice()).to.equal(ticketPrice);
    expect(await ticketToken.vendor()).to.equal(vendor.address);
    expect(await ticketToken.name()).to.equal("TicketToken");
    expect(await ticketToken.symbol()).to.equal("TKT");
    expect(await ticketToken.balanceOf(ticketToken.address)).to.equal(initialSupply);
  });

  it("should revert purchase if wallet not created", async function () {
    await expect(
      ticketToken.connect(buyer).purchaseTicket({ value: ticketPrice })
    ).to.be.revertedWith("No wallet");
  });

  it("should revert when sent ETH is below ticketPrice", async function () {
    await ticketToken.connect(buyer).createWallet("hunter2");
    await expect(
      ticketToken.connect(buyer).purchaseTicket({ value: ethers.parseEther("0.005") })
    ).to.be.revertedWith("Too little ETH");
  });

  it("should transfer the correct number of tickets on exact payment", async function () {
    await ticketToken.connect(buyer).createWallet("hunter2");
    const count      = 3n;
    const amountSent = ticketPrice * count;

    await expect(
      ticketToken.connect(buyer).purchaseTicket({ value: amountSent })
    )
      .to.emit(ticketToken, "TicketPurchased")
      .withArgs(buyer.address, amountSent, count);

    expect(await ticketToken.balanceOf(buyer.address)).to.equal(count);
    expect(await ticketToken.balanceOf(ticketToken.address)).to.equal(initialSupply - count);
  });

  it("should revert when overpaying (non-multiple of ticketPrice)", async function () {
    await ticketToken.connect(buyer).createWallet("hunter2");
    await expect(
      ticketToken.connect(buyer).purchaseTicket({ value: ethers.parseEther("0.035") })
    ).to.be.revertedWith("Send exact multiples of ticketPrice");
  });

  it("should let the owner withdraw ETH to the vendor", async function () {
    await ticketToken.connect(buyer).createWallet("hunter2");
    const count      = 2n;
    const amountSent = ticketPrice * count;

    await ticketToken.connect(buyer).purchaseTicket({ value: amountSent });

    const vendorStarting = await ethers.provider.getBalance(vendor.address);
    await expect(
      ticketToken.connect(owner).withdrawVendor(amountSent)
    )
      .to.emit(ticketToken, "VendorWithdrawal")
      .withArgs(vendor.address, amountSent);

    const vendorEnding = await ethers.provider.getBalance(vendor.address);
    expect(vendorEnding - vendorStarting).to.equal(amountSent);
  });
});
