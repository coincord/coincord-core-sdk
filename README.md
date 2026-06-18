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
let address = coincordCoreCLient.createAddress("BITCOIN","NATIVE")
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

//  This is a response structure of the Event Data
type EventRequest = {
  address: Address;
  sender_address: string;
  transaction: {
    id: string | null;
    tx_hash: string | null;
    recipient: string | null;
    tx_hash: string
    type: "CREDIT"
    amount: number
    status: "SUCCESSFUL" | "PENDING" | "FAILED",
    address: {
      address: string
    }
  };
  event: "INCOMING_TRANSACTION" | "MINED_OUTGOING_TRANSACTION"; 
  token_set: string;
  amount: number;
  network: "BITCOIN" | "LITECOIN" | "POLYGON" | "TRON" | "ETHEREUM"
  reference: string | null;
  details: string;
  token_name: string;
  created_at: Date;
};
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
  event: WebhookEventStructure
}

type WebhookEventStructure = {
  address: Address | string;
  transaction: {
    id: string | null;
    tx_hash: string | null;
    recipient: string | null;
  };
  event: "INCOMING_TRANSACTION" | "MINED_OUTGOING_TRANSACTION"; 
  token_set: string;
  amount: number;
  fee?: number;
  network: "BITCOIN" | "LITECOIN" | "POLYGON" | "TRON" | "ETHEREUM"
  reference: string | null;
  details: string;
  token_name: string;
  created_at: Date;
};
```

Example WebHook Event
```
{
      "id": "8b6701da-942b-4479-ba69-42ece452edsdf",
      "address": "0xEeda4524cfB7E70F1875F7A71E759cCb4e3d7Ebc",
      "transaction": {
        "id": "119d2797-3234-4205-8a10-134aa9b3de74",
        "tx_hash": "0x65d22498e777c50db2b844e70da31eb8d60bb98162bad41002c7f6c55a9ac56e",
        "recipient": null
      },
      "network": "ETHEREUM",
      "reference": null,
      "event": "INCOMING_TRANSACTION",
      "token_set": "NATIVE",
      "amount": 0.00259106,
      "details": "received funds from 0x4976A4A02f38326660D17bf34b431dC6e2eb2327",
      "token_name": "ETHEREUM",
      "created_at": "2024-08-11T21:15:19.972Z"
}
```

The request header contains the API_KEY, confirm the API key on your end to confirm for certain that the webhook request is coming from the right source.

## Coincord Core Types.
This section outlines the types of the response data you would receive on every request made to our apis. Since the APIs are graphql based, the responses are equally graphql based.

```ts

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

enum Network {
  BITCOIN
  ETHEREUM
  LITECOIN
  POLYGON
  TRON
  // SOLANA
  // TRON
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
  MULTI_TRC: Address!
}

type App {
  addresses: [Address]!
  app_wallet: [AppWallet]!
  created_at: String!
  id: String!
  name: String!
  network: Network
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
  fee: Float!
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

type SecretData {
  client_id: String!
  client_secret: String!
}

type Transaction {
  address: Address
  address_id: String
  amount: Float!
  fee: Float!
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


type Token {
  contract_address: String
  name: String!
  ticker: String!
  token_set: String!
}

```

These types outline the response of each of the sdk functions based on the types outlined above.
```ts

type CoreSDK {
  getApp: App

  createAddress(network: Network!, token_set: TokenSet!): Address
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

---

## Business Customer (KYB)

The SDK supports registering business entities and managing their KYB (Know Your Business) lifecycle through the active banking partner. This includes creating a business customer, resubmitting rejected documents, and listing provisioned virtual accounts.

---

### `createBusinessCustomer`

Registers a new business customer with the active banking partner and initiates the KYB process. Returns a record that can be used to track the business customer by ID.

**GraphQL mutation:** `CREATE_BUSINESS_CUSTOMER`

```ts
const result = await coincordCoreClient.createBusinessCustomer({
  business_name: "Acme Ltd",
  business_bvn: "12345678901",
  industry: "Fintech",
  registration_type: "LLC",
  country: "NG",
  date_of_registration: "2015-03-20",   // ISO 8601
  description: "A fintech company",
  website: "https://acme.example.com",  // optional
  rc_tin: "RC123456",
  addressCountry: "NG",
  addressState: "Lagos",
  addressLine: "14 Marina Street",
  addressCity: "Lagos",
  addressPostal: "100001",
  phone: "+2348012345678",
  contact: {
    phoneNumber: "+2348012345678",
    emailGeneral: "hello@acme.example.com",
    emailSupport: "support@acme.example.com",   // optional
    emailDispute: "disputes@acme.example.com",  // optional
  },
  officers: [
    {
      role: "DIRECTOR",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@acme.example.com",
      phoneNumber: "+2348098765432",
      nationality: "NG",
      bvn: "98765432100",
      dateOfBirth: "1985-07-10",   // ISO 8601
      percentageOwned: 51,
      address: {
        country: "NG",
        state: "Lagos",
        city: "Lagos",
        addressLine1: "14 Marina Street",
        addressLine2: "Floor 3",   // optional
        postalCode: "100001",      // optional
      },
    },
  ],
  documents: [
    {
      type: "CERTIFICATE_OF_INCORPORATION",
      file: incorporationFile,   // File | Blob | string (public URL)
    },
    {
      type: "RC_NUMBER",
      file: "https://storage.example.com/rc-number.pdf",
    },
  ],
});

console.log(result.id);                    // internal business customer ID
console.log(result.business_name);
console.log(result.anchor_reference_id);  // banking partner reference (nullable)
console.log(result.created_at);
```

**Input type — `BusinessCustomerInput`**

| Field | Type | Required | Description |
|---|---|---|---|
| `business_name` | `string` | ✓ | Legal business name |
| `business_bvn` | `string` | ✓ | BVN linked to the business |
| `industry` | `string` | ✓ | Industry sector |
| `registration_type` | `string` | ✓ | e.g. `"LLC"`, `"PLC"` |
| `country` | `string` | ✓ | ISO 3166-1 alpha-2 country code |
| `date_of_registration` | `string` | ✓ | ISO 8601 date e.g. `"2015-03-20"` |
| `description` | `string` | ✓ | Short business description |
| `website` | `string` | — | Publicly accessible website URL |
| `rc_tin` | `string` | ✓ | RC or TIN number |
| `addressCountry` | `string` | ✓ | Registered address country |
| `addressState` | `string` | ✓ | Registered address state/region |
| `addressLine` | `string` | ✓ | Street address line |
| `addressCity` | `string` | ✓ | City |
| `addressPostal` | `string` | ✓ | Postal / zip code |
| `phone` | `string` | ✓ | Business phone number |
| `contact` | `BusinessCustomerContact` | ✓ | Contact email configuration |
| `officers` | `BusinessCustomerOfficer[]` | ✓ | At least one officer required |
| `documents` | `BusinessCustomerDocument[]` | — | KYB supporting documents |

**`BusinessCustomerContact`**

| Field | Type | Required |
|---|---|---|
| `phoneNumber` | `string` | ✓ |
| `emailGeneral` | `string` | ✓ |
| `emailSupport` | `string` | — |
| `emailDispute` | `string` | — |

**`BusinessCustomerOfficer`**

| Field | Type | Required | Notes |
|---|---|---|---|
| `role` | `OfficerRole` | ✓ | `"DIRECTOR"` \| `"OWNER"` \| `"SECRETARY"` |
| `firstName` | `string` | ✓ | |
| `lastName` | `string` | ✓ | |
| `middleName` | `string` | — | |
| `maidenName` | `string` | — | |
| `title` | `string` | — | |
| `nationality` | `string` | ✓ | ISO 3166-1 alpha-2 |
| `bvn` | `string` | ✓ | |
| `email` | `string` | ✓ | |
| `phoneNumber` | `string` | ✓ | |
| `dateOfBirth` | `string` | ✓ | ISO 8601 e.g. `"1985-07-10"` |
| `percentageOwned` | `number` | ✓ | `0–100` |
| `address` | `BusinessCustomerAddress` | ✓ | Residential address |

**`BusinessCustomerDocument`**

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | `AnchorDocType` | ✓ | See document types below |
| `file` | `File \| Blob \| string` | ✓ | Multipart upload or a publicly accessible URL |

**`AnchorDocType` values**

| Value | Description |
|---|---|
| `FORM_CAC_3` | CAC Form 3 (particulars of directors) |
| `RC_NUMBER` | RC number certificate |
| `CERTIFICATE_OF_INCORPORATION` | Certificate of incorporation |
| `PROOF_OF_ADDRESS` | Proof of business address |

**Response — `BusinessCustomerResult`**

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Internal business customer ID |
| `business_name` | `string` | |
| `anchor_reference_id` | `string \| null` | Banking partner reference ID |
| `created_at` | `string` | ISO 8601 timestamp |

---

### `resubmitBusinessCustomerDocument`

Replaces a previously uploaded document that was rejected by the banking partner. The new file is used the next time the provider requests that document type for KYB review.

**GraphQL mutation:** `RESUBMIT_BUSINESS_CUSTOMER_DOCUMENT`

```ts
const success = await coincordCoreClient.resubmitBusinessCustomerDocument({
  business_customer_id: "biz_cust_abc123",
  type: "CERTIFICATE_OF_INCORPORATION",
  file: updatedCertFile,   // File | Blob | string (public URL)
});

if (success) {
  console.log("Document resubmitted successfully.");
}
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `business_customer_id` | `string` | ✓ | ID from `createBusinessCustomer` response |
| `type` | `AnchorDocType` | ✓ | The document type being replaced |
| `file` | `File \| Blob \| string` | ✓ | Replacement file — multipart upload or public URL |

**Response:** `boolean` — `true` on success, throws on failure.

> **Note on file uploads:** When passing a `File` or `Blob`, the SDK relies on `graphql-request`'s built-in multipart form-data support. When passing a `string`, it must be a publicly accessible URL that the banking partner can fetch directly.

---

### `getBusinessCustomerAccounts`

Lists all virtual accounts provisioned for a registered business customer.

**GraphQL query:** `BusinessCustomerAccounts`

```ts
const accounts = await coincordCoreClient.getBusinessCustomerAccounts(
  "biz_cust_abc123"
);

accounts.forEach((account) => {
  console.log(account.account_number);
  console.log(account.bank_name);
  console.log(account.currency);
  console.log(account.active);
});
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `business_customer_id` | `string` | ✓ | ID from `createBusinessCustomer` response |

**Response — `BusinessCustomerAccount[]`**

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Virtual account ID |
| `account_number` | `string` | |
| `account_name` | `string` | |
| `bank_name` | `string` | |
| `currency` | `string` | Currency code e.g. `"NGN"` |
| `active` | `boolean` | Whether the account is active |
| `created_at` | `string` | ISO 8601 timestamp |

---

### Business Customer Types Reference

```ts
type OfficerRole = "DIRECTOR" | "OWNER" | "SECRETARY";

type AnchorDocType =
  | "FORM_CAC_3"
  | "RC_NUMBER"
  | "CERTIFICATE_OF_INCORPORATION"
  | "PROOF_OF_ADDRESS";

interface BusinessCustomerAddress {
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
}

interface BusinessCustomerContact {
  phoneNumber: string;
  emailGeneral: string;
  emailSupport?: string;
  emailDispute?: string;
}

interface BusinessCustomerOfficer {
  role: OfficerRole;
  title?: string;
  nationality: string;
  bvn: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;        // ISO 8601
  percentageOwned: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  maidenName?: string;
  address: BusinessCustomerAddress;
}

interface BusinessCustomerDocument {
  type: AnchorDocType;
  file: File | Blob | string;
}

interface BusinessCustomerInput {
  business_name: string;
  business_bvn: string;
  industry: string;
  registration_type: string;
  country: string;
  date_of_registration: string;  // ISO 8601
  description: string;
  website?: string;
  rc_tin: string;
  addressCountry: string;
  addressState: string;
  addressLine: string;
  addressCity: string;
  addressPostal: string;
  phone: string;
  contact: BusinessCustomerContact;
  officers: BusinessCustomerOfficer[];
  documents?: BusinessCustomerDocument[];
}

interface BusinessCustomerResult {
  id: string;
  business_name: string;
  anchor_reference_id: string | null;
  created_at: string;
}

interface BusinessCustomerAccount {
  id: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  currency: string;
  active: boolean;
  created_at: string;
}
```
