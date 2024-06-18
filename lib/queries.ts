import { gql } from "graphql-request";

// list queries
export const app = gql`
  query APP {
    app {
      id
      name
      client_id
      client_secret
      api_key
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
export const apps = gql`
  query APPS {
    apps {
      id
      name
      client_id
      client_secret
      api_key
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
        token_set
        contract_address
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
      id
      name
      token_set
      ticker
      contract_address
      app_wallet {
        id
        app {
          id
        }
      }
      addresses {
        id
        address
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
    address__createAddress(token_set: $token_set) {
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
    address__createAddressWithUniqueId(uniqueId: $uniqueId) {
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

export const sendTokens = gql`
  mutation SendTokens(
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
      reference: $reference
      fee_rate: $fee_rate
      token: $token
      network: $network
    ) {
      id
      recipient
      address_id
      created_at
      tx_hash
      type
      amount
      status
      address {
        id
        address
        token_set
        token {
          id
          name
        }
      }
      token {
        token_set
        name
        id
      }
    }
  }
`;
export const updateAppDetails = gql``;
export const generateClientSecret = gql``;
export const getEstimateQuery = gql`
  mutation FEE_ESTIMATE(
    $token: TokenCollection!
    $value: Float!
    $network: NetworkCollection!
    $recipient: String!
  ) {
    address__getEstimate(
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
export const generateAppWallet = gql`
  mutation GenerateAppWallet($token_id: String!) {
    app_generateAppWallet(token_id: $token_id) {
      id
      app_id
      token_name
      token_id
      created_at
      balance
    }
  }
`;
