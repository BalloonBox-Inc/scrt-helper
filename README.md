# 🚀 SCRT NETWORK - Contract Development Helper

This is a simple module intended to help with development on the SECRET Network.

### Requirements

- Yarn
- Node
- A compiled WASM smart contract

**note**
The current contract in the contract folder is based on this repo: https://github.com/BalloonBox-Inc/SCRTSibyl-Contract and this UI: https://github.com/BalloonBox-Inc/scrt-network-oracle-client. If you change the contract, you'll also need to change the contents in the transactions in this repo, depending on your contract.

### 1. Install Dependencies

run `yarn install` in the cli folder

### 2. Generate keypairs

in the same folder run `yarn keypair`

This will generate a mnemonic + address and write it to a file called keys.json. Don't worry, these are just testnet keys.

### 3. Add testnet funds to your keypair

Visit the faucet to get tokens: https://faucet.secrettestnet.io - enter your address from the keys.json file and request tokens.

### 4. Verify the max_size and your compiled wasm contract path

```sh
const MAX_SIZE = 1000;
const WASM = fs.readFileSync("./contract/contract.wasm");
```

## 4. Upload and Initiate your contract

Run `yarn go` to upload and initiate your contract

## 5. Generate a permit query

For this step you need secretcli installed an in path. You can download it and then set the alias like this:

`$ alias secretcli='/Users/matteo/Downloads/secretcli.unix'`

get the contract address from contract.json, then run the following with the contract address in the allowed_tokens array:

```
echo '{
    "chain_id": "secret-4",
    "account_number": "0",
    "sequence": "0",
    "msgs": [
        {
            "type": "query_permit",
            "value": {
                "permit_name": "test",
                "allowed_tokens": [
                    "secret17zt6efqat4hxzzfrm6mzazt9n50y70xdqsvmpp" //replace
                ],
                "permissions": ["balance"]
            }
        }
    ],
    "fee": {
        "amount": [
            {
                "denom": "uscrt",
                "amount": "0"
            }
        ],
        "gas": "1"
    },
    "memo": ""
}' > ./permit.json
```

You should now have a json file called permit.json

next add your keys to the secretcli: `secretcli keys import my_keys ./keys.json`

You'll be prompted to add a passphrase.

IF it fails (which it sometimes does), you can add your key by simply copying the mnemonic from the keys.json file then run

`secretcli keys add --recover <key-alias>` (replace key-alias with the name you want to give this keypair)

You'll then be prompted for your mnemonic.

run `secretcli keys list` to make sure you've successfully added your keypair to the cli.

then run `secretcli tx sign-doc ./permit.json --from <key-alias> > ./sig.json` (replace key-alias with the name of your key)

this should create your signature.

then `yarn query_permit`
