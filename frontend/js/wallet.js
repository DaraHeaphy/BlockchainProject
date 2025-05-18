const ethers = window.ethers;

let localWallet, encryptedJson;

export async function createWallet(passwordInputId, outputId) {
  const pwd = document.getElementById(passwordInputId).value;
  if (!pwd || pwd.length < 8) {
    return alert("Password must be at least 8 characters");
  }

  localWallet = ethers.Wallet.createRandom();
  encryptedJson = await localWallet.encrypt(pwd);

  document.getElementById(outputId).innerText =
    `✅ Wallet created!\nAddress: ${localWallet.address}`;
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
