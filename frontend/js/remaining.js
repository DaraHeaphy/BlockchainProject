const ethers = window.ethers;
import { CONTRACT_ADDRESS } from "./config.js";

export async function showRemaining(outputId, abi) {
  if (!window.ethereum) {
    return alert("MetaMask not installed");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

  try {
    const rem = await contract.balanceOf(CONTRACT_ADDRESS);
    document.getElementById(outputId).value = rem.toString();
  } catch (e) {
    const reason = e.data?.message || e.reason || e.message;
    alert(`Error fetching remaining tickets: ${reason}`);
  }
}