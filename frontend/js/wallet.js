const ethers = window.ethers;

let localWallet, encryptedJson;

export async function createWallet(passwordInputId) {
  const pwd = document.getElementById(passwordInputId).value;
  if (!pwd || pwd.length < 8) {
    return alert("Password must be at least 8 characters");
  }

  // generate and encrypt
  localWallet = ethers.Wallet.createRandom();
  encryptedJson = await localWallet.encrypt(pwd);

  // populate the text‐boxes
  document.getElementById("walletAddress").value = localWallet.address;
  document.getElementById("privateKey").value     = localWallet.privateKey;
  document.getElementById("keystoreJson").value   = encryptedJson;
}

export function downloadWalletBtn() {
  if (!encryptedJson || !localWallet) {
    return alert("Please create a wallet first");
  }
  const blob = new Blob([encryptedJson], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `wallet-${localWallet.address}.json`;
  a.click();
}
