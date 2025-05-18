import { RPC_URL, CONTRACT_ADDRESS } from "./config.js";
const ethers = window.ethers;

let transferContract;
let loadedWallet;
let vendorAddress;

export async function loadWalletForTransfer() {
  const fileInput = document.getElementById("keystoreFileTransfer");
  const pwdInput  = document.getElementById("walletPasswordTransfer");

  if (!fileInput.files.length) {
    return alert("Please select your keystore JSON file.");
  }
  const pwd = pwdInput.value.trim();
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

      // Display loaded wallet address
      document.getElementById("transferWalletInfo").value =
        `✅ Loaded wallet: ${loadedWallet.address}`;
      document.getElementById("transferAmount").disabled = false;

      // Instantiate contract and fetch vendor
      transferContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        window.contractABI,
        loadedWallet
      );
      vendorAddress = await transferContract.vendor();

      // Show vendor section
      const vendorSection = document.getElementById("vendorSection");
      document.getElementById("vendorAddressDisplay").value = vendorAddress;
      document.getElementById("returnToVendorBtn").disabled = false;
      vendorSection.style.display = "block";
    } catch (err) {
      alert("Failed to decrypt keystore: " + err.message);
    }
  };
  reader.readAsText(fileInput.files[0]);
}

export async function returnToVendor() {
  if (!transferContract || !vendorAddress) {
    return alert("Load your wallet first.");
  }
  const count = parseInt(
    document.getElementById("transferAmount").value,
    10
  );
  if (isNaN(count) || count < 1) {
    return alert("Enter a valid number of tickets.");
  }

  try {
    const tx = await transferContract.transfer(vendorAddress, count);
    document.getElementById("transferStatus").value = `⏳ ${tx.hash}`;
    await tx.wait();
    document.getElementById("transferStatus").value =
      `✅ Returned ${count} ticket(s) to vendor!`;
  } catch (err) {
    alert("Return to vendor failed: " + (err.reason || err.message));
  }
}
