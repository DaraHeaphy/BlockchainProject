const meta = document.querySelector('meta[name="contract-address"]');
if (!meta) throw new Error("contract-address meta tag missing");
export const CONTRACT_ADDRESS = meta.content;
