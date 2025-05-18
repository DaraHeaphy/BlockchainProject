import { createWallet, downloadWalletBtn } from "./wallet.js";
import { loadWallet, purchaseTicket }     from "./purchase.js";
import { loadWalletForTransfer, transferTickets, returnToVendor } from "./transfer.js";
import { initBalance, checkBalance, loadBalanceWallet } from "./balance.js";
import { showRemaining }                  from "./remaining.js";

const abi = window.contractABI;

window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("createWalletBtn")) {
    document
      .getElementById("createWalletBtn")
      .addEventListener("click", () =>
        createWallet("newWalletPassword", "walletDetails")
      );
    document
      .getElementById("downloadWalletBtn")
      .addEventListener("click", () => downloadWalletBtn());
  }

  if (document.getElementById("loadWalletBtn")) {
    document
      .getElementById("loadWalletBtn")
      .addEventListener("click", loadWallet);
    document
      .getElementById("purchaseBtn")
      .addEventListener("click", purchaseTicket);
  }

  if (document.getElementById("loadTransferWalletBtn")) {
    document
      .getElementById("loadTransferWalletBtn")
      .addEventListener("click", loadWalletForTransfer);
    document
      .getElementById("transferBtn")
      .addEventListener("click", transferTickets);
    document
      .getElementById("returnToVendorBtn")
      .addEventListener("click", returnToVendor);
  }

  if (document.getElementById("checkBalanceBtn")) {
    initBalance(abi);
    document
      .getElementById("checkBalanceBtn")
      .addEventListener("click", () =>
        checkBalance("manualAddress", "balances")
      );
    document
      .getElementById("loadBalanceWalletBtn")
      .addEventListener("click", () =>
        loadBalanceWallet(
          "keystoreFileBalance",
          "walletPasswordBalance",
          "balances"
        )
      );
  }

  if (document.getElementById("remainingBtn")) {
    document
      .getElementById("remainingBtn")
      .addEventListener("click", () =>
        showRemaining("balances", abi)
      );
  }
});
