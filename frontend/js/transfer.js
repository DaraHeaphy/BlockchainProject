const ethers = window.ethers;
import { CONTRACT_ADDRESS } from "./config.js";

let transferContract;
let vendorAddress;
let signer;

export async function initTransfer(abi) {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  transferContract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  vendorAddress = await transferContract.vendor();
}

export async function returnTickets(inputId, statusId, abi) {
  if (!transferContract || !vendorAddress) {
    await initTransfer(abi);
  }

  const amt = parseInt(document.getElementById(inputId).value, 10);
  if (isNaN(amt) || amt < 1) {
    return alert("Enter a valid number of tickets");
  }

  if (!transferContract) {
    return alert("Please connect your wallet first.");
  }

  if (!vendorAddress) {
    return alert("Vendor address not found on contract.");
  }

  if (!confirm(`Are you sure you want to return ${amt} ticket(s)?`)) {
    return;
  }

  try {
    const tx = await transferContract.transfer(vendorAddress, amt);
    document.getElementById(statusId).innerText = `⏳ Sending… ${tx.hash}`;
    await tx.wait();
    document.getElementById(statusId).innerText = "✅ Tickets returned!";
  } catch (e) {
    const reason = e.data?.message || e.reason || e.message;
    alert(`Return error: ${reason}`);
  }
}
