// This software and its associated documentation are the exclusive property of Coincord.
// It is provided to authorized Coincord partners and clients under the terms of the Coincord Software License.
// Unauthorized use, copying, distribution, or modification of this software is strictly prohibited.
// © Coincord 2024. All rights reserved.

import { gql } from "graphql-request";

// list queries
export const app = gql`
  query APP {
    app {
      id
      name
      webhook_url
      app_wallet {
        id
        token_name
        token_set
        balance
        addresses {
          id
          address
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
      app {
        id
        name
      }
      token {
        name
        ticker
      }
      transactions {
        id
        address_id
        created_at
        tx_hash
        amount
        address {
          address
        }
      }
    }
  }
`;

export const tokens = gql`
  query Tokens {
    tokens {
      name
      token_set
      ticker
      contract_address
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
      }
      event
      token_set
      reference
      token_name
      token {
        id
        name
        token_set
      }
      transaction {
        id
        address_id
        recipient
        reference
        tx_hash
        type
        amount
        status
        address {
          address
          id
        }
      }
      details
      amount
    }
  }
`;
export const transactions = gql``;

// mutations
export const createAddress = gql`
  mutation CREATE_NEW_ADDRESS($token_set: TokenCollection!) {
    _createAddress(token_set: $token_set) {
      id
      address
      created_at
      token_set
      token {
        name
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
    }
  }
`;

export const sendTokens = gql`
  mutation _sendTokens(
    $recipient: String!
    $sender: String
    $reference: String
    $amount: Float!
    $fee_rate: Float!
    $token: TokenCollection!
    $network: NetworkCollection
  ) {
    address__sendTokens(
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
      token {
        token_set
        name
      }
    }
  }
`;

export const processTransaction = gql`
  mutation processTransaction($hash_ref: String!) {
    _processTransaction(hash_ref: $hash_ref) {
      id
      tx_hash
      reference
      hash
      amount
      status
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
