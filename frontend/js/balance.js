const ethers = window.ethers;
import { CONTRACT_ADDRESS } from "./config.js";

let tokenABI = [];

export function initBalance(abi) {
  tokenABI = abi;
}

export async function checkBalance(addrInputId, outputId) {
  const address = document.getElementById(addrInputId).value.trim();
  if (!ethers.isAddress(address)) {
    return alert("❌ Invalid Ethereum address.");
  }

  const provider = new ethers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/74ac8b5828754e85b0bcdbab511ba892"
  );

  const rawBal = await provider.getBalance(address);
  const sethBal = ethers.formatEther(rawBal);

  const tokenContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    tokenABI,
    provider
  );
  const ticketBal = await tokenContract.balanceOf(address);
  const symbol = await tokenContract.symbol();

  document.getElementById(outputId).innerText =
    `Address: ${address}\n\n` +
    `SETH balance: ${sethBal} SETH\n` +
    `${symbol} balance: ${ticketBal.toString()} ${symbol}`;
}
