import { CUSTOM_FEES, TESTNET_URL } from "./CONSTANTS";

const {
  EnigmaUtils,
  Secp256k1Pen,
  SigningCosmWasmClient,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
} = require("secretjs");
const fs = require("fs");
const chalk = require("chalk");
require("dotenv").config();

const log = console.log;

const KEYPAIR = require("./keys.json");
const PERMIT_SIG = require("./sig.json");
const CONTRACT_DATA = require("./contract.json");

const main = async () => {
  if (KEYPAIR?.mnemonic) {
    const signingPen = await Secp256k1Pen.fromMnemonic(KEYPAIR.mnemonic);
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const accAddress = pubkeyToAddress(pubkey, "secret");
    const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();

    const client = new SigningCosmWasmClient(
      TESTNET_URL,
      accAddress,
      (signBytes) => signingPen.sign(signBytes),
      txEncryptionSeed,
      CUSTOM_FEES
    );

    const queryStatsMsg = {
      with_permit: {
        query: {
          balance: {},
        },
        permit: {
          params: {
            permit_name: "test",
            permissions: ["balance"],
            allowed_tokens: [CONTRACT_DATA.contractAddress],
            chain_id: "secret-4",
          },
          signature: PERMIT_SIG,
        },
      },
    };

    let query_response = await client.queryContractSmart(
      CONTRACT_DATA.contractAddress,
      queryStatsMsg
    );

    if (query_response.Ok) {
      log(chalk.green.bold("Score Query Response:"));
      log(chalk.green("Status: ", query_response.Ok.status));
      log(chalk.green("Score: ", query_response.Ok.score));
      log(chalk.green("Description:", query_response.Ok.description));
    } else log(chalk.red("Error querying score"));
  }
};

main().catch((err) => {
  console.error(err);
});
