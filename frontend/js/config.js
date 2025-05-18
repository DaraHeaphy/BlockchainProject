const mCA  = document.querySelector('meta[name="contract-address"]');
const mRPC = document.querySelector('meta[name="rpc-url"]');
if (!mCA || !mRPC) {
  throw new Error("Missing <meta name=\"contract-address\"> or <meta name=\"rpc-url\">");
}
export const CONTRACT_ADDRESS = mCA.content;
export const RPC_URL          = mRPC.content;