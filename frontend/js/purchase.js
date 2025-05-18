import { RPC_URL, CONTRACT_ADDRESS } from "./config.js";
const ethers = window.ethers;

let saleContract;
let loadedWallet;

async function loadWallet() {
  const fileInput = document.getElementById("keystoreFile");
  const pwdInput  = document.getElementById("walletPassword");

  if (!fileInput.files.length) {
    return alert("Please select your keystore JSON file.");
  }
  const file = fileInput.files[0];
  const pwd  = pwdInput.value;
  if (!pwd) {
    return alert("Enter your wallet password.");
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const json = e.target.result;
      loadedWallet = await ethers.Wallet.fromEncryptedJson(json, pwd);
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      loadedWallet = loadedWallet.connect(provider);

      document.getElementById("walletInfo").innerText =
        `✅ Loaded wallet: ${loadedWallet.address}`;
      document.getElementById("purchaseAmount").disabled = false;
      document.getElementById("purchaseBtn").disabled = false;

      saleContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        window.contractABI,
        loadedWallet
      );
    } catch (err) {
      alert("Failed to decrypt keystore: " + err.message);
    }
  };
  reader.readAsText(file);
}

async function purchaseTicket() {
  if (!saleContract) {
    return alert("Load your wallet first.");
  }
  const count = parseInt(
    document.getElementById("purchaseAmount").value,
    10
  );
  if (isNaN(count) || count < 1 || count > 10) {
    return alert("Enter a number of tickets between 1 and 10.");
  }

  try {
    const price   = await saleContract.ticketPrice();
    const total   = price * BigInt(count);
    const tx      = await saleContract.purchaseTicket({ value: total });
    document.getElementById("purchaseStatus").innerText = `⏳ ${tx.hash}`;
    await tx.wait();
    document.getElementById("purchaseStatus").innerText =
      `✅ Purchased ${count} ticket(s)!`;
  } catch (err) {
    alert("Purchase failed: " + (err.reason || err.message));
  }
}

export { loadWallet, purchaseTicket };
