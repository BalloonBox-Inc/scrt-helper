export const TESTNET_URL = "http://testnet.securesecrets.org:1317/";

export const CUSTOM_FEES = {
  upload: {
    amount: [{ amount: "2530124", denom: "uscrt" }],
    gas: "10120493",
  },
  init: {
    amount: [{ amount: "2530124", denom: "uscrt" }],
    gas: "10120493",
  },
  exec: {
    amount: [{ amount: "500000", denom: "uscrt" }],
    gas: "500000",
  },
  send: {
    amount: [{ amount: "80000", denom: "uscrt" }],
    gas: "80000",
  },
};
