// This software and its associated documentation are the exclusive property of Coincord.
// It is provided to authorized Coincord partners and clients under the terms of the Coincord Software License.
// Unauthorized use, copying, distribution, or modification of this software is strictly prohibited.
// © Coincord 2024. All rights reserved.

import { gql } from "graphql-request";

// list queries
export const organization = gql`
  query ORGANIZATION {
    organization {
      id
      name
      webhook_url
      access_level
      created_at
    }
  }
`;

export const app = gql`
  query APP {
    organization {
      id
      name
      webhook_url
      access_level
      created_at
      app_wallet {
        id
        asset_name
        asset_type
        balance
        analytics_in
        analytics_out
        token_type
        token_set
        fiat_type
        created_at
        addresses {
          id
          address
          amount
        }
      }
    }
  }
`;

export const feeRate = gql`
  query FEERATE {
    fee_rate {
      bitcoin_fee_rate
      litecoin_fee_rate
    }
  }
`;

export const addresses = gql`
  query Addresses {
    addresses {
      id
      address
      amount
      created_at
      token_set
      organization {
        id
        name
        webhook_url
      }
      token {
        name
        ticker
        contract_address
      }
      app_wallet {
        id
        asset_name
        balance
      }
      transactions {
        id
        amount
        created_at
        tx_hash
        status
        recipient
        reference
      }
    }
  }
`;

export const tokens = gql`
  query Tokens {
    tokens {
      name
      ticker
      contract_address
      token_set
    }
  }
`;

export const fiats = gql`
  query Fiats {
    fiats {
      id
      name
      ticker
    }
  }
`;

export const appWallets = gql`
  query AppWallets {
    app_wallets {
      id
      app_id
      asset_name
      asset_type
      balance
      analytics_in
      analytics_out
      fiat_type
      token_type
      token_set
      created_at
      addresses {
        id
        address
        amount
      }
      token {
        name
        ticker
        contract_address
      }
      fiat {
        id
        name
        ticker
      }
    }
  }
`;

export const appWallet = gql`
  query AppWallet($id: String!) {
    app_wallet(id: $id) {
      id
      app_id
      asset_name
      asset_type
      balance
      analytics_in
      analytics_out
      fiat_type
      token_type
      token_set
      created_at
      addresses {
        id
        address
        amount
      }
      token {
        name
        ticker
        contract_address
      }
      fiat {
        id
        name
        ticker
      }
      transactions {
        id
        amount
        status
        created_at
        tx_hash
      }
    }
  }
`;

export const appWalletTransactions = gql`
  query AppWalletTransactions($appwallet: String!) {
    app_wallet_transactions(appwallet: $appwallet) {
      id
      amount
      amount_before
      amount_after
      created_at
      status
      type
      asset_type
      hash
      recipient
      reference
      tx_hash
      token {
        name
        ticker
        contract_address
      }
    }
  }
`;

export const customerVirtualAccount = gql`
  query CustomerVirtualAccount($id: String!) {
    customerVirtualAccount(id: $id) {
      id
      account_number
      account_name
      bank_name
      currency
      virtual_account_id
      active
      created_at
      account_holder_id
      account_holder {
        id
        first_name
        last_name
        email
        phone_no
        created_at
      }
    }
  }
`;

export const accountHolders = gql`
  query AccountHolders {
    accountHolders {
      id
      first_name
      last_name
      email
      phone_no
      created_at
      app_id
      customer_virtual_accounts {
        id
        account_number
        account_name
        bank_name
        currency
        active
      }
    }
  }
`;

export const transactionsQuery = gql`
  query Transactions($network: Network!, $token_name: String!) {
    transactions(network: $network, token_name: $token_name) {
      id
      amount
      amount_before
      amount_after
      created_at
      status
      type
      asset_type
      hash
      recipient
      reference
      tx_hash
      token {
        name
        ticker
        contract_address
      }
    }
  }
`;

export const events = gql`
  query Events($token: String, $address: String) {
    events(address: $address, token: $token) {
      id
      sender_address
      address {
        address
        amount
      }
      event
      token_set
      reference
      network
      token_name
      token {
        name
        ticker
        contract_address
      }
      transaction {
        id
        amount
        recipient
        reference
        tx_hash
        type
        amount
        status
        created_at
      }
      details
      amount
      created_at
      app_id
    }
  }
`;
export const transactions = gql``;

// mutations
export const createAddress = gql`
  mutation CREATE_NEW_ADDRESS(
    $network: Network!
    $token_set: TokenSet!
  ) {
    _createAddress(network: $network, token_set: $token_set) {
      id
      address
      created_at
      token_set
      organization {
        id
        name
      }
      token {
        name
        ticker
        contract_address
      }
      app_wallet {
        id
        asset_name
      }
    }
  }
`;

export const createAddressCollection = gql`
  mutation CREATE_ADDRESS_COLLECTION($uniqueId: String!) {
    _createAddressCollection(uniqueId: $uniqueId) {
      LITECOIN {
        id
        address
        created_at
      }
      BITCOIN {
        id
        address
        created_at
      }
      ETHEREUM {
        id
        address
        created_at
      }
      MULTI_ERC {
        id
        address
        created_at
      }
      MULTI_TRC {
        id
        address
        created_at
      }
    }
  }
`;

export const sendTokenCheck = gql`
  mutation sendTokenCheck(
    $recipient: String!
    $reference: String
    $amount: Float!
    $token: TokenCollection!
    $network: Network
  ) {
    _sendTokenCheck(
      recipient: $recipient
      amount: $amount
      reference: $reference
      token: $token
      network: $network
    ) {
      id
      recipient
      hash_ref
      amount
      fee
      network
      app_wallet {
        id
        asset_name
      }
      token {
        name
        ticker
        contract_address
      }
    }
  }
`;

export const sendTokens = gql`
  mutation _sendTokens(
    $recipient: String!
    $sender: String
    $reference: String!
    $amount: Float!
    $fee_rate: Float!
    $token: TokenCollection!
    $network: Network!
  ) {
    _sendTokens(
      recipient: $recipient
      sender: $sender
      amount: $amount
      fee_rate: $fee_rate
      reference: $reference
      token: $token
      network: $network
    ) {
      id
      tx_hash
      reference
      recipient
      hash
      amount
      status
      created_at
      type
      asset_type
      token {
        name
        ticker
        contract_address
      }
      address {
        address
        amount
      }
    }
  }
`;

export const processTransaction = gql`
  mutation processTransaction($hash_ref: String!) {
    _processTransaction(hash_ref: $hash_ref) {
      id
      tx_hash
      address {
        address
        amount
      }
      reference
      recipient
      hash
      amount
      status
      created_at
      type
      asset_type
      token {
        name
        ticker
        contract_address
      }
    }
  }
`;

export const getEstimateQuery = gql`
  mutation FEE_ESTIMATE(
    $token: TokenCollection!
    $value: Float!
    $network: Network!
    $recipient: String!
  ) {
    _getEstimate(
      token: $token
      value: $value
      network: $network
      recipient: $recipient
    ) {
      value
      token
      recipient
    }
  }
`;

export const generateClientSecret = gql`
  mutation GENERATE_CLIENT_SECRET {
    app_generateClientSecret {
      client_id
      client_secret
    }
  }
`;

export const updateAppDetails = gql`
  mutation UPDATE_APP_DETAILS(
    $name: String
    $api_key: String
    $webhook_url: String
  ) {
    app_updateAppDetails(
      name: $name
      api_key: $api_key
      webhook_url: $webhook_url
    ) {
      id
      name
      webhook_url
    }
  }
`;

export const createVirtualAccount = gql`
  mutation CREATE_VIRTUAL_ACCOUNT($customer_data: CustomerData!) {
    _createVirtualAccount(customer_data: $customer_data) {
      id
      bank_name
      account_name
      account_number
    }
  }
`;

export const generateAppWallet = gql`
  mutation GENERATE_APP_WALLET(
    $asset_type: AssetType!
    $fiat_type: FiatType
    $token_type: TokenCollection
    $network: Network
  ) {
    generateAppWallet(
      asset_type: $asset_type
      fiat_type: $fiat_type
      token_type: $token_type
      network: $network
    ) {
      id
      app_id
      asset_name
      asset_type
      balance
      analytics_in
      analytics_out
      fiat_type
      token_type
      token_set
      created_at
      token {
        name
        ticker
        contract_address
      }
      fiat {
        id
        name
        ticker
      }
    }
  }
`;

export const sendFiatFunds = gql`
  mutation SEND_FIAT_FUNDS(
    $currency: Currency!
    $bank_code: String!
    $account_number: String!
    $amount: Float!
  ) {
    _sendFiatFunds(
      currency: $currency
      bank_code: $bank_code
      account_number: $account_number
      amount: $amount
    ) {
      id
      amount
      status
      created_at
      recipient
      reference
      hash
    }
  }
`;

export const updateOrganization = gql`
  mutation UPDATE_ORGANIZATION(
    $name: String
    $webhook_url: String
  ) {
    updateOrganization(
      name: $name
      webhook_url: $webhook_url
    ) {
      id
      name
      webhook_url
      access_level
      created_at
    }
  }
`;
