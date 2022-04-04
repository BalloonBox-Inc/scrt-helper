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

    const setViewingKey = {
      generate_viewing_key: {
        padding: "extra padding",
        entropy: "entropy string",
      },
    };

    let handle_response = await client.execute(
      CONTRACT_DATA.contractAddress,
      setViewingKey
    );

    const strRes = Buffer.from(handle_response.data.buffer).toString();
    const jsonRes = await JSON.parse(strRes);
    console.log({ strRes, jsonRes });
    if (jsonRes.generate_viewing_key.key) {
      log(
        chalk.green.bold(
          "Viewing Key successfully generated! Writing viewingKey.json file."
        )
      );
      fs.writeFileSync(
        "viewingKey.json",
        JSON.stringify({
          viewingKey: jsonRes.generate_viewing_key.key,
        })
      );
    }
  }
};

main().catch((err) => {
  console.error(err);
});
