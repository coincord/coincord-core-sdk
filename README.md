# Coincord core sdk 
The Coincord Core SDK empowers developers to seamlessly interact with the Coincord Core wallet programmatically. It offers a comprehensive 
suite of functionalities for managing addresses, sending and receiving tokens, monitoring events, and more, streamlining the integration of Coincord Core features into your applications.
 
### Installation
Prerequisites:

Node.js and npm (or yarn) installed on your system. Download them from the official websites:
Node.js: https://nodejs.org/en
npm (included with Node.js installation)
yarn (optional package manager): https://yarnpkg.com/

### Package Installation:

> Coincord Libraries are hosted on github not npm so add this to your .npmrc file, (vim ~/.npmrc)
```sh
@coincord:registry=https://npm.pkg.github.com
```
With this set your environment will know to check github for coincord libraries instead of npm

```sh
# npm
npm install @coincord/coincord-core-wallet-sdk
```
or
```sh
# yarn
yarn install @coincord/coincord-core-wallet-sdk
```

### Setup your environment variables.
The Coincord Core Wallet SDK requires three environment variables for authentication and interaction with the network:

COINCORD_CORE_HOST_URL: The base URL of your Coincord Core node

COINCORD_CORE_HOST_CLIENT_ID: Your unique Coincord client ID obtained from Coincord support.

COINCORD_CORE_HOST_CLIENT_SECRET: Your Coincord client secret associated with your client ID.

Contact Coincord support at support@coincord.co to request your client ID and client secret.

Setting Environment Variables:

Permanently: Configure them in your system's environment variables.

Project-Specific: Create a .env file in your project directory and add them there (recommended for security reasons):

- COINCORD_CORE_HOST_URL
- COINCORD_CORE_HOST_CLIENT_ID
- COINCORD_CORE_HOST_CLIENT_SECRET


## Usage

Core Functionalities

The Coincord Core Wallet SDK provides a rich set of functionalities:

Initialization: Create a CoreWalletSDK instance to access SDK methods.
- **Get App**: Retrieve information about your Coincord application instance (name, associated wallet).

- **Create Addresses**: Generate new addresses for various supported tokens (Bitcoin, Litecoin, Ethereum, etc.).

- **Create Address Collection**: Create collections of addresses with unique identifiers.

- **Get Fee Estimate**: Retrieve estimated network fees for sending tokens.
- **Get Events**: Get a list of transactions (events) associated with a specific token and address.

- **SendTokensCheck**: Check the cost of sending a token transaction before confirming it

- **Process Transaction**: Process a send tokens check

*Important Note: Refer to the official Coincord Core documentation for a comprehensive list of functionalities and detailed information on each function.*

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
```

### Create Address Collection
This function allows you to create an address collection using a unique identifier.
```ts
let uniqueId = "123456789";
let addressCollection = await coincordCoreCLient.createAddressCollection(uniqueId);
```


### Get Fee Estimate
Retrieve an estimated fee for a token transfer.
```ts
let feeEstimate = await coincordCoreClient.getFeeEstimate("BITCOIN", 0.01, "recipient_address", "BITCOIN");
let estimatedFee = feeEstimate.estimatedFee;
```

### Get Events
Retrieve a list of events for a given token and address.
```ts
let token = "BITCOIN";
let address = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
let events = await coincordCoreClient.getEvents(token, address);
```

### Send Tokens Check
Check the cost of sending a transaction
```ts
let response = await coincordCoreClient.sendTokenCheck({
  recipient: "recipient_address",
  sender: "sender_address",
  reference: "optional_reference",
  amount: 100,
  network: "POLYGON",
  token: "USDC",
});

// Response contains the transaction address or throws an error
let transactionAddress = response.hash_ref;
```

### Confirming a transaction
Check the cost of sending a transaction
```ts
let response = await coincordCoreClient.processTransaction({
  hash_ref: hash_ref
});

// Response contains the transaction address or throws an error
let transactionHash = response.tx_hash;
```

## Managing your app
-----
There are two major calls available in this version to manage your app.
### Update App details.
Update your app details within core for critical api integrations.
```ts
let response = await coincordCoreClient.updateAppDetails({
  name: "Your App Name",
  api_key: "YOUR API KEY",
  webhook_url: "YOUR_WEBHOOK_URL"
})
```
### Generate client secret.
Generate new client id and secrets for your account. This is nessecary for situations like rotational auth migrations.
```ts
let response = await coincordCoreClient.generateClientSecret()

// YOUR UPDATED CLIENT DETAILS
console.log(response.client_id)
console.log(response.client_secret)
```

## Webhooks and Events
Coincord core APIs provide access to webhook events for getting notified on transaction status for incoming and completed transactions

Coincord sends Webhook events with the structure

```ts

type RequestBody = {
  event: EventRequest
}

type EventRequest = {
  address: string;
  transaction: {
    id: string | null;
    tx_hash: string | null;
    recipient: string | null;
  };
  event: "INCOMING_TRANSACTION" | "OUTGOING_TRANSACTION" | "MINED_TRANSACTION"; 
  token_set: string;
  amount: number;
  network: "BITCOIN" | "LITECOIN" | "POLYGON" | "TRON" | "ETHEREUM"
  reference: string | null;
  details: string;
  token_name: string;
  created_at: Date;
};
```

The request header contains the API_KEY, confirm the API key on your end to confirm for certain that the webhook request is coming from the right source.

## Coincord Core Types.
This section outlines the types of the response data you would receive on every request made to our apis. Since the APIs are graphql based, the responses are equally graphql based.

```ts

type Address {
  address: String!
  amount: Float!
  app: App!
  app_wallet: AppWallet
  app_wallet_id: String
  created_at: String!
  events: [Event]
  id: String!
  token: Token
  token_set: TokenSet!
  transactions: [Transaction]
}

type AddressSet {
  BITCOIN: Address!
  ETHEREUM: Address!
  LITECOIN: Address!
  MULTI_ERC: Address!
}

type App {
  addresses: [Address]!
  app_wallet: [AppWallet]!
  created_at: String!
  id: String!
  name: String!
  webhook_url: String
}

type AppWallet {
  addresses: [Address]!
  app: App!
  app_id: String!
  balance: Float!
  created_at: String!
  id: String!
  token_name: String!
  token_set: String!
  transactions: [Transaction]!
}

type Event {
  address: Address
  address_id: String
  amount: Float!
  app: App!
  app_id: String!
  app_wallet: AppWallet
  app_wallet_id: String
  created_at: String
  details: String
  event: String!
  id: String!
  network: String
  reference: String
  sender_address: String
  token: Token!
  token_id: String!
  token_name: String!
  token_set: String!
  transaction: Transaction
  transaction_id: String
}

type FeeEstimate {
  recipient: String
  token: TokenCollection
  value: Float
}

type FeeRate {
  bitcoin_fee_rate: Float!
  litecoin_fee_rate: Float!
}

enum Network {
  BASE
  BITCOIN
  ETHEREUM
  LITECOIN
  POLYGON
  SOLANA
  TRON
}

type Mutation {
  
}

type SecretData {
  client_id: String!
  client_secret: String!
}

type Transaction {
  address: Address
  address_id: String
  amount: Float!
  created_at: String!
  hash: String
  id: String!
  meta: String
  recipient: String
  reference: String
  status: TransactionState!
  token: Token!
  tx_hash: String
  type: TransactionFlow!
}

type TransactionCheck {
  amount: Float
  app_wallet: AppWallet
  app_wallet_id: String
  fee: Float
  hash_ref: String
  id: String!
  network: Network
  recipient: String
  token: Token
}

enum TransactionFlow {
  CREDIT
  DEBIT
}

enum TransactionState {
  FAILED
  PENDING
  SUCCESSFUL
}

enum TransactionType {
  RECEIVING
  REMITTANCE
  SENDING
  SWAP
}


type Token {
  contract_address: String
  name: String!
  ticker: String!
  token_set: String!
}

enum TokenCollection {
  BITCOIN
  DAI
  ETHEREUM
  LITECOIN
  USDC
  USDT
}

enum TokenSet {
  ERC20
  ERC721
  NATIVE
}

```

These types outline the response of each of the sdk functions based on the types outlined above.
```ts

type SDK {
  getApp: App

  createAddress(token_set: TokenCollection!): Address
  createAddressCollection(uniqueId: String!): AddressSet
  getFeeEstimate(network: Network! = ETHEREUM, recipient: String!, token: TokenCollection! = ETHEREUM, value: Float!): FeeEstimate
  processTransaction(hash_ref: String!): Transaction
  sendTokenCheck(amount: Float!, network: Network = ETHEREUM, recipient: String!, reference: String, token: TokenCollection!): TransactionCheck
  sendTokens(amount: Float!, fee_rate: Float!, network: Network = ETHEREUM, recipient: String!, reference: String, sender: String, token: TokenCollection!): Transaction
  generateClientSecret: SecretData
  updateAppDetails(api_key: String, name: String, webhook_url: String): App

  """Event Events for your token type and/or address"""
  getEvents(address: String, token: String): [Event]

  """getting the fee rate for a token"""
  getFeeRate: FeeRate

  """Apps or platforms registered with coincord core wallet."""
  tokens: [Token]

  """Apps or platforms registered with coincord core wallet."""
  transactions(
    network: Network!

    """The Token of your app wallet"""
    token_name: String!
  ): [Transaction]
}

```