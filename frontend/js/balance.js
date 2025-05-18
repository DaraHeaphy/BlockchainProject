import { RPC_URL, CONTRACT_ADDRESS } from "./config.js";
const ethers = window.ethers;

let tokenABI = [];

export function initBalance(abi) {
  tokenABI = abi;
}

export async function checkBalance(addrInputId, outputId) {
  const address = document.getElementById(addrInputId).value.trim();
  if (!ethers.isAddress(address)) {
    return alert("❌ Invalid Ethereum address.");
  }

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const rawBal   = await provider.getBalance(address);
    const sethBal  = ethers.formatEther(rawBal);

    const tokenContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      tokenABI,
      provider
    );
    const ticketBal = await tokenContract.balanceOf(address);
    const symbol    = await tokenContract.symbol();

    document.getElementById(outputId).innerText =
      `Address: ${address}\n\n` +
      `SETH balance: ${sethBal} SETH\n` +
      `${symbol} balance: ${ticketBal.toString()} ${symbol}`;
  } catch (err) {
    alert("Failed to fetch balances: " + (err.reason || err.message));
  }
}

export async function loadBalanceWallet(fileInputId, passwordInputId, outputId) {
  const fileInput = document.getElementById(fileInputId);
  const pwdInput  = document.getElementById(passwordInputId);

  if (!fileInput.files.length) {
    return alert("Please select your keystore JSON file.");
  }
  const pwd = pwdInput.value;
  if (!pwd) {
    return alert("Enter your wallet password.");
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const json         = e.target.result;
      const decrypted    = await ethers.Wallet.fromEncryptedJson(json, pwd);
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet       = decrypted.connect(provider);
      const address      = wallet.address;

      const rawBal       = await provider.getBalance(address);
      const sethBal      = ethers.formatEther(rawBal);

      const tokenContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        tokenABI,
        provider
      );
      const ticketBal    = await tokenContract.balanceOf(address);
      const symbol       = await tokenContract.symbol();

      document.getElementById(outputId).innerText =
        `Address: ${address}\n\n` +
        `SETH balance: ${sethBal} SETH\n` +
        `${symbol} balance: ${ticketBal.toString()} ${symbol}`;
    } catch (err) {
      alert("Failed to decrypt or fetch balances: " + err.message);
    }
  };
  reader.readAsText(file);
}
