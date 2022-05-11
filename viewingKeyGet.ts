import { CUSTOM_FEES, TESTNET_URL } from "./CONSTANTS";

const {
  EnigmaUtils,
  Secp256k1Pen,
  SigningCosmWasmClient,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
} = require("secretjs");
const chalk = require("chalk");

const log = console.log;

const KEYPAIR = require("./keys.json");
const CONTRACT_DATA = require("./contract.json");
const VIEWING_KEY = require("./viewingKey.json");

const main = async () => {
  if (VIEWING_KEY?.viewingKey) {
    const signingPen = await Secp256k1Pen.fromMnemonic(KEYPAIR.mnemonic);
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const accAddress = pubkeyToAddress(pubkey, "secret");
    console.log({ accAddress });
    const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();

    const client = new SigningCosmWasmClient(
      TESTNET_URL,
      accAddress,
      (signBytes) => signingPen.sign(signBytes),
      txEncryptionSeed,
      CUSTOM_FEES
    );

    console.log({ accAddress });

    const getScoreMsg = {
      read: {
        key: VIEWING_KEY?.viewingKey,
        address: accAddress, // any account can make this query
      },
    };
    let query_response = await client.queryContractSmart(
      CONTRACT_DATA.contractAddress,
      getScoreMsg
    );

    // let date = new Date(query_response.timestamp).toLocaleDateString("en-US");
    log(chalk.green.bold("Score Query Response:"));
    log(chalk.green("Status: ", query_response.status));
    log(chalk.green("Score: ", query_response.score));
    log(chalk.green("Description:", query_response.description));
  }
};

main().catch((err) => {
  console.error(err);
});
