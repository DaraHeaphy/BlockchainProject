import { RPC_URL, CONTRACT_ADDRESS } from "./config.js";
const ethers = window.ethers;

let transferContract;
let loadedWallet;
let vendorAddress;

async function loadWalletForTransfer() {
  const fileInput = document.getElementById("keystoreFileTransfer");
  const pwdInput  = document.getElementById("walletPasswordTransfer");

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

      document.getElementById("transferWalletInfo").innerText =
        `✅ Loaded wallet: ${loadedWallet.address}`;
      document.getElementById("transferAmount").disabled = false;
      document.getElementById("recipientAddress").disabled = false;
      document.getElementById("transferBtn").disabled = false;

      transferContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        window.contractABI,
        loadedWallet
      );

      vendorAddress = await transferContract.vendor();
      document.getElementById("vendorAddressDisplay").innerText = vendorAddress;
      document.getElementById("returnToVendorBtn").disabled = false;
      document.getElementById("vendorSection").style.display = "block";
    } catch (err) {
      alert("Failed to decrypt keystore: " + err.message);
    }
  };
  reader.readAsText(file);
}

async function transferTickets() {
  if (!transferContract) {
    return alert("Load your wallet first.");
  }
  const count     = parseInt(document.getElementById("transferAmount").value, 10);
  const recipient = document.getElementById("recipientAddress").value.trim();

  if (isNaN(count) || count < 1) {
    return alert("Enter a valid number of tickets.");
  }
  if (!ethers.isAddress(recipient)) {
    return alert("Enter a valid recipient address.");
  }

  try {
    const tx = await transferContract.transfer(recipient, count);
    document.getElementById("transferStatus").innerText = `⏳ ${tx.hash}`;
    await tx.wait();
    document.getElementById("transferStatus").innerText =
      `✅ Sent ${count} ticket(s) to ${recipient}!`;
  } catch (err) {
    alert("Transfer failed: " + (err.reason || err.message));
  }
}

async function returnToVendor() {
  if (!transferContract || !vendorAddress) {
    return alert("Load your wallet first.");
  }
  const count = parseInt(document.getElementById("transferAmount").value, 10);
  if (isNaN(count) || count < 1) {
    return alert("Enter a valid number of tickets.");
  }

  try {
    const tx = await transferContract.transfer(vendorAddress, count);
    document.getElementById("transferStatus").innerText = `⏳ ${tx.hash}`;
    await tx.wait();
    document.getElementById("transferStatus").innerText =
      `✅ Returned ${count} ticket(s) to vendor!`;
  } catch (err) {
    alert("Return to vendor failed: " + (err.reason || err.message));
  }
}

export { loadWalletForTransfer, transferTickets, returnToVendor };
