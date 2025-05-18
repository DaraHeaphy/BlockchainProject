import { createWallet, downloadWalletBtn } from "./wallet.js";
import { initBalance, checkBalance }        from "./balance.js";
import { connectPurchase, purchaseTicket }  from "./purchase.js";
import { initTransfer, returnTickets }      from "./transfer.js";
import { showRemaining }                    from "./remaining.js";

const abi = window.contractABI;

window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("createWalletBtn")) {
    document.getElementById("createWalletBtn")
      .addEventListener("click", () => createWallet("newWalletPassword", "walletDetails"));
    document.getElementById("downloadWalletBtn")
      .addEventListener("click", () => downloadWalletBtn());
  }

  if (document.getElementById("checkBalanceBtn")) {
    initBalance(abi);
    document.getElementById("checkBalanceBtn")
      .addEventListener("click", () => {
        const outEl = document.getElementById("balances") || document.getElementById("remainingStatus");
        const inputId = document.getElementById("manualAddress") ? "manualAddress" : null;
        checkBalance(inputId, outEl.id);
      });
  }

  if (document.getElementById("connectPurchaseBtn")) {
    document.getElementById("connectPurchaseBtn")
      .addEventListener("click", () => connectPurchase(abi, "connectedAddress", "purchaseBtn"));
    document.getElementById("purchaseBtn")
      .addEventListener("click", () => purchaseTicket("purchaseAmount", "purchaseStatus"));
  }

  if (document.getElementById("returnBtn")) {
    document.getElementById("returnBtn")
      .addEventListener("click", () => returnTickets("returnAmount", "transferStatus", abi));
  }

  if (document.getElementById("remainingBtn")) {
    document.getElementById("remainingBtn")
      .addEventListener("click", () => showRemaining("balances", abi));
  }
});
