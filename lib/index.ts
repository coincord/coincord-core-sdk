// This software and its associated documentation are the exclusive property of Coincord.
// It is provided to authorized Coincord partners and clients under the terms of the Coincord Software License.
// Unauthorized use, copying, distribution, or modification of this software is strictly prohibited.
// © Coincord 2024. All rights reserved.

require("dotenv").config();
import { GraphQLClient } from "graphql-request";
import graphqlClient from "./requester";
import {
  createAddress,
  sendTokenCheck,
  processTransaction,
  app,
  organization,
  feeRate,
  addresses,
  events,
  getEstimateQuery,
  createAddressCollection,
  sendTokens,
  updateAppDetails,
  generateClientSecret,
  createVirtualAccount,
  generateAppWallet,
  sendFiatFunds,
  updateOrganization,
  appWallets,
  appWallet,
  appWalletTransactions,
  customerVirtualAccount,
  accountHolders,
  transactionsQuery,
  fiats,
  tokens,
  resolve_bank,
  orgBankingPartners,
  availableBankingPartners,
  effectiveBankingPartner,
  listBanks,
  setBankingPartner,
  removeBankingPartner,
  createBusinessCustomer,
  resubmitBusinessCustomerDocument,
  businessCustomerAccounts,
} from "./queries";

export type TokenCollectionType =
  | "BITCOIN"
  | "LITECOIN"
  | "ETHEREUM"
  | "DAI"
  | "USDC"
  | "USDT";
export type TokenSet = "NATIVE" | "ERC20" | "TRC20" | "ERC721";
export type NetworkCollection =
  | "BITCOIN"
  | "LITECOIN"
  | "ETHEREUM"
  | "POLYGON"
  | "BASE"
  | "TRON"
  | "SOLANA";

export type AssetType = "TOKEN" | "FIAT";
export type FiatType = "NGN" | "USD" | "GHS" | "KES" | "XAF";
export type Currency = "NGN" | "GHS";
export type AccessLevel = "PREMIUM" | "STANDARD";
export type TransactionFlow = "CREDIT" | "DEBIT";
export type TransactionState = "FAILED" | "PENDING" | "SUCCESSFUL";
export type TransactionType = "RECEIVING" | "REMITTANCE" | "SENDING" | "SWAP";
export type IdentityType =
  | "INTERNATIONAL_PASSPORT"
  | "DRIVERS_LICENSE"
  | "NIN"
  | "SSN"
  | "VOTERS_CARD"
  | "PASSPORT";
export type BankingPartnerOperation =
  | "VIRTUAL_ACCOUNTS"
  | "REMITTANCE"
  | "DEFAULT";

export type OfficerRole = "DIRECTOR" | "OWNER" | "SECRETARY";
export type AnchorDocType =
  | "FORM_CAC_3"
  | "RC_NUMBER"
  | "CERTIFICATE_OF_INCORPORATION"
  | "PROOF_OF_ADDRESS";

export interface BusinessCustomerAddress {
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
}

export interface BusinessCustomerContact {
  phoneNumber: string;
  emailGeneral: string;
  emailSupport?: string;
  emailDispute?: string;
}

export interface BusinessCustomerOfficer {
  role: OfficerRole;
  title?: string;
  nationality: string;
  bvn: string;
  email: string;
  phoneNumber: string;
  /** ISO 8601 date string e.g. 1990-01-15 */
  dateOfBirth: string;
  percentageOwned: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  maidenName?: string;
  address: BusinessCustomerAddress;
}

export interface BusinessCustomerDocument {
  type: AnchorDocType;
  /** Multipart file upload or a publicly accessible URL string */
  file: File | Blob | string;
}

export interface BusinessCustomerInput {
  business_name: string;
  business_bvn: string;
  industry: string;
  registration_type: string;
  country: string;
  /** ISO 8601 date string e.g. 2010-06-01 */
  date_of_registration: string;
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

export interface BusinessCustomerResult {
  id: string;
  business_name: string;
  anchor_reference_id: Nullable<string>;
  created_at: string;
}

export interface BusinessCustomerAccount {
  id: string;
  account_number: string;
  account_name: string;
  bank_name: string;
  currency: string;
  active: boolean;
  created_at: string;
}

export interface CustomerData {
  first_name: string;
  last_name: string;
  identity: {
    type: string;
    number: string;
    url: string;
  };
  country: string;
  email: string;
  phone_no: string;
  dob: string;
  bvn: string;
  metadata: string;
  address: {
    address1: string;
    address2: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
}

export type Nullable<T> = null | T;

export interface Transaction {
  amount: number;
  created_at: string;
  id: string;
  status: TransactionState;
  fiat_type: string;
  token_type: string;
  type: TransactionFlow;
  hash?: Nullable<string>;
  reference?: Nullable<string>;
  tx_hash?: Nullable<string>;
}

export default class CoincordCoreWallet {
  private graphqlClient: GraphQLClient;
  constructor() {
    this.graphqlClient = graphqlClient;
  }

  async getApp() {
    try {
      let appResponse = await graphqlClient.request(app);
      if (appResponse) {
        return appResponse.organization;
      }
    } catch (error) {
      throw new Error("Organization not found");
    }
  }

  async getOrganization() {
    try {
      let orgResponse = await graphqlClient.request(organization);
      if (orgResponse) {
        return orgResponse.organization;
      }
    } catch (error) {
      throw new Error("Organization not found");
    }
  }

  async getFeeRate() {
    try {
      let feeRateResponse = await graphqlClient.request(feeRate);
      if (feeRateResponse) {
        return feeRateResponse.fee_rate;
      }
    } catch (error) {
      throw error;
    }
  }

  async createAddress(network: NetworkCollection, token: TokenSet) {
    let address;
    try {
      address = await graphqlClient.request(createAddress, {
        network,
        token_set: token,
      });
      return address._createAddress;
    } catch (error) {
      throw error;
    }
  }

  async createAddressCollection(uniqueId: string) {
    try {
      let addressCollection = await graphqlClient.request(
        createAddressCollection,
        {
          uniqueId: uniqueId,
        },
      );

      return addressCollection._createAddressCollection;
    } catch (error) {
      throw error;
    }
  }

  async getFeeEstimate(
    token: TokenCollectionType,
    value: number,
    recipient: string,
    network: NetworkCollection,
  ) {
    let estimateObject;
    try {
      estimateObject = await graphqlClient.request(getEstimateQuery, {
        token: token,
        value: value,
        network: network,
        recipient: recipient,
      });
      return estimateObject._getEstimate;
    } catch (error) {
      throw error;
    }
  }

  async addresses() {
    let address;
    try {
      address = await graphqlClient.request(addresses);
      return address.addresses;
    } catch (error) {
      throw error;
    }
  }

  async getEvents(token: TokenCollectionType, address: string | null) {
    let eventsData;
    try {
      eventsData = await graphqlClient.request(events, {
        token: token,
        address: address,
      });
      return eventsData.events;
    } catch (error) {
      throw error;
    }
  }

  async sendTokenCheck(request: {
    recipient: string;
    reference?: string | null;
    amount: number;
    network: NetworkCollection;
    token: TokenCollectionType;
  }) {
    try {
      let response = await graphqlClient.request(sendTokenCheck, {
        ...request,
      });
      return response._sendTokenCheck;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendTokens(request: {
    recipient: string;
    sender?: string | null;
    reference?: string | null;
    amount: number;
    fee_rate: number;
    network: NetworkCollection;
    token: TokenCollectionType;
  }) {
    try {
      let response = await graphqlClient.request(sendTokens, {
        ...request,
      });
      return response._sendTokens;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async processTransaction(request: { hash_ref: string }) {
    try {
      let response = await graphqlClient.request(processTransaction, {
        ...request,
      });
      return response._processTransaction;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // App related Calls
  async updateAppDetails(request: {
    name?: string | undefined;
    api_key?: string | undefined;
    webhook_url?: string | undefined;
  }) {
    try {
      let response = await graphqlClient.request(updateAppDetails, {
        ...request,
      });
      return response.app_updateAppDetails;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async generateClientSecret() {
    try {
      let response = await graphqlClient.request(generateClientSecret, {});
      return response.app_generateClientSecret;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createVirtualAccount(customer_data: CustomerData) {
    try {
      let response = await graphqlClient.request(createVirtualAccount, {
        customer_data,
      });
      return response._createVirtualAccount;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async generateAppWallet(request: {
    asset_type: AssetType;
    fiat_type?: FiatType;
    token_type?: TokenCollectionType;
    network?: NetworkCollection;
  }) {
    try {
      let response = await graphqlClient.request(generateAppWallet, {
        ...request,
      });
      return response.generateAppWallet;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAppWallets() {
    try {
      let response = await graphqlClient.request(appWallets);
      return response.app_wallets;
    } catch (error) {
      throw error;
    }
  }

  async getAppWallet(id: string) {
    try {
      let response = await graphqlClient.request(appWallet, { id });
      return response.app_wallet;
    } catch (error) {
      throw error;
    }
  }

  async getAppWalletTransactions(appwallet: string) {
    try {
      let response = await graphqlClient.request(appWalletTransactions, {
        appwallet,
      });
      return response.app_wallet_transactions;
    } catch (error) {
      throw error;
    }
  }

  async sendFiatFunds(request: {
    currency: Currency;
    bank_code: string;
    account_number: string;
    amount: number;
    reference: string;
  }) {
    try {
      let response = await graphqlClient.request(sendFiatFunds, {
        ...request,
      });
      return response._sendFiatFunds as Transaction;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getCustomerVirtualAccount(id: string) {
    try {
      let response = await graphqlClient.request(customerVirtualAccount, {
        id,
      });
      return response.customerVirtualAccount;
    } catch (error) {
      throw error;
    }
  }

  async getAccountHolders() {
    try {
      let response = await graphqlClient.request(accountHolders);
      return response.accountHolders;
    } catch (error) {
      throw error;
    }
  }

  async getFiats() {
    try {
      let response = await graphqlClient.request(fiats);
      return response.fiats;
    } catch (error) {
      throw error;
    }
  }

  async getTokens() {
    try {
      let response = await graphqlClient.request(tokens);
      return response.tokens;
    } catch (error) {
      throw error;
    }
  }

  async resolveBankAccount(input: { code: string; account: string }) {
    try {
      let response = await graphqlClient.request(resolve_bank, {
        input: {
          bank_code: input.code,
          account_number: input.account,
        },
      });
      return response.resolveBankAccount;
    } catch (error) {}
  }

  async getTransactions(network: NetworkCollection, token_name: string) {
    try {
      let response = await graphqlClient.request(transactionsQuery, {
        network,
        token_name,
      });
      return response.transactions;
    } catch (error) {
      throw error;
    }
  }

  async updateOrganization(request: { name?: string; webhook_url?: string }) {
    try {
      let response = await graphqlClient.request(updateOrganization, {
        ...request,
      });
      return response.updateOrganization;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getOrgBankingPartners() {
    try {
      let response = await graphqlClient.request(orgBankingPartners);
      return response.orgBankingPartners;
    } catch (error) {
      throw error;
    }
  }

  async getAvailableBankingPartners() {
    try {
      let response = await graphqlClient.request(availableBankingPartners);
      return response.availableBankingPartners;
    } catch (error) {
      throw error;
    }
  }

  async getEffectiveBankingPartner(request: {
    operation: BankingPartnerOperation;
    currency?: FiatType;
  }) {
    try {
      let response = await graphqlClient.request(effectiveBankingPartner, {
        ...request,
      });
      return response.effectiveBankingPartner;
    } catch (error) {
      throw error;
    }
  }

  async listBanks() {
    try {
      let response = await graphqlClient.request(listBanks);
      return response.list_banks;
    } catch (error) {
      throw error;
    }
  }

  async setBankingPartner(request: {
    partner: string;
    operation: BankingPartnerOperation;
    currency?: FiatType;
  }) {
    try {
      let response = await graphqlClient.request(setBankingPartner, {
        ...request,
      });
      return response.setBankingPartner;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async removeBankingPartner(request: {
    operation: BankingPartnerOperation;
    currency?: FiatType;
  }) {
    try {
      let response = await graphqlClient.request(removeBankingPartner, {
        ...request,
      });
      return response.removeBankingPartner as boolean;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createBusinessCustomer(business_data: BusinessCustomerInput) {
    try {
      let response = await graphqlClient.request(createBusinessCustomer, {
        business_data,
      });
      return response.createBusinessCustomer as BusinessCustomerResult;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resubmitBusinessCustomerDocument(request: {
    business_customer_id: string;
    type: AnchorDocType;
    file: File | Blob | string;
  }) {
    try {
      let response = await graphqlClient.request(
        resubmitBusinessCustomerDocument,
        { ...request },
      );
      return response.resubmitBusinessCustomerDocument as boolean;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getBusinessCustomerAccounts(business_customer_id: string) {
    try {
      let response = await graphqlClient.request(businessCustomerAccounts, {
        business_customer_id,
      });
      return response.businessCustomerAccounts as BusinessCustomerAccount[];
    } catch (error) {
      throw error;
    }
  }
}
