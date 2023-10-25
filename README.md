## Updating contract types

0. Install npm install -g @cosmwasm/ts-codegen
1. Inside chain folder run

```
cargo run --bin schema
cosmwasm-ts-codegen generate \
          --plugin client \
          --schema ./schema \
          --out ./ts \
          --name MyProject \
          --no-bundle
```

2. Copy generate types into back / frontend folders
3. Update contract address in front env variables and backend ContractsService

## Creating new credential type

```
curl -d "@GenericAsset.json" -X POST localhost:3000/issuer-api/default/config/templates/GenericAsset
```
