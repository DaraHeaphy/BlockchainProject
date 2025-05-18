import { createWallet, downloadWalletBtn }       from "./wallet.js";
import { loadWallet, purchaseTicket }           from "./purchase.js";
import { loadWalletForTransfer, returnToVendor } from "./transfer.js";
import { initBalance, loadBalanceWallet }       from "./balance.js";
import { showRemaining }                        from "./remaining.js";

const abi = window.contractABI;

window.addEventListener("DOMContentLoaded", () => {
  const createBtn = document.getElementById("createWalletBtn");
  if (createBtn) {
    createBtn.addEventListener("click", () => createWallet("newWalletPassword"));
    document
      .getElementById("downloadWalletBtn")
      .addEventListener("click", downloadWalletBtn);
  }

  const loadPurchaseBtn = document.getElementById("loadWalletBtn");
  if (loadPurchaseBtn) {
    loadPurchaseBtn.addEventListener("click", loadWallet);
    document
      .getElementById("purchaseBtn")
      .addEventListener("click", purchaseTicket);
  }

  const loadTransferBtn = document.getElementById("loadTransferWalletBtn");
  if (loadTransferBtn) {
    loadTransferBtn.addEventListener("click", loadWalletForTransfer);
    document
      .getElementById("returnToVendorBtn")
      .addEventListener("click", returnToVendor);
  }

  const loadBalanceBtn = document.getElementById("loadBalanceWalletBtn");
  if (loadBalanceBtn) {
    initBalance(abi);
    loadBalanceBtn.addEventListener("click", () =>
      loadBalanceWallet(
        "keystoreFileBalance",
        "walletPasswordBalance",
        "balances"
      )
    );
  }

  const remainingBtn = document.getElementById("remainingBtn");
  if (remainingBtn) {
    remainingBtn.addEventListener("click", () => showRemaining("balances", abi));
  }
});
