# Coincord core wallet sdk 
> Connecting to coincord core wallet.
 
### Installation

## How to use.
### Install the package
```sh
# yarn
yarn install @coincord/coincord-core-wallet-sdk

# npm
npm install @coincord/coincord-core-wallet-sdk
```

### Setup your environment variables.
Coincord Core Wallet SDK needs three configurations to process your requests. These includes the following.
- COINCORD_CORE_HOST_URL
- COINCORD_CORE_HOST_CLIENT_ID
- COINCORD_CORE_HOST_CLIENT_SECRET

contact Coincord support for your credentials: support@coincord.co

## Make requests and queries
### Initializing the library.
```ts
import CoreWalletSDK from '@coincord/coincord-core-sdk-wallet'
const coincordCoreClient = new CoreWalletSDK()
```
### Get App
Get your app instance.
```ts
let app = coincordCoreClient.getApp()
let name = app.name
let appWallet = app.app_wallet
let addresses = app.app_wallet.addresses
```

### Create Addresses
Create your account address.
```ts
// supported token types: BITCOIN, LITECOIN, ETHEREUM, USDC, USDT, DAI
let address = coincordCoreCLient.createAddress("BITCOIN")
let address = address.address
let tokenType = address.token_set
let 
```