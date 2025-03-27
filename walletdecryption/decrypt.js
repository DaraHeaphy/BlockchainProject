const fs = require('fs');
const { ethers } = require("ethers");

async function getPrivateKey() {
  const json = fs.readFileSync("wallet.json", "utf8");
  const decryptedWallet = await ethers.Wallet.fromEncryptedJson(json, "password");
  console.log("Private Key:", decryptedWallet.privateKey);
}

getPrivateKey();
