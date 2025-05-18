const ethers = window.ethers;
import { CONTRACT_ADDRESS } from "./config.js";

let purchaseContract, signer;

export async function connectPurchase(abi, addressOutputId, btnEnableId) {
  if (!window.ethereum) {
    return alert("MetaMask not installed");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  purchaseContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    abi,
    signer
  );

  const addr = await signer.getAddress();
  document.getElementById(addressOutputId).innerText = addr;
  document.getElementById(btnEnableId).disabled = false;
}

export async function purchaseTicket(countInputId, statusId) {
  if (!purchaseContract) {
    return alert("Please connect your wallet first.");
  }

  const count = parseInt(
    document.getElementById(countInputId).value,
    10
  );
  if (isNaN(count) || count < 1 || count > 10) {
    return alert("Please enter a number of tickets between 1 and 10");
  }

  try {
    const pricePer = await purchaseContract.ticketPrice();
    const totalCost = pricePer * BigInt(count);

    const tx = await purchaseContract.purchaseTicket({ value: totalCost });
    document.getElementById(statusId).innerText = `⏳ Sending… ${tx.hash}`;
    await tx.wait();
    document.getElementById(statusId).innerText =
      `✅ Purchased ${count} ticket(s)!`;
  } catch (e) {
    const reason = e.data?.message || e.reason || e.message;
    alert(`Purchase error: ${reason}`);
  }
}
