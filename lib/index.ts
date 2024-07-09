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
  feeRate,
  addresses,
  events,
  getEstimateQuery,
  createAddressCollection,
  sendTokens,
  updateAppDetails,
  generateClientSecret,
} from "./queries";

export type TokenCollectionType =
  | "BITCOIN"
  | "LITECOIN"
  | "ETHEREUM"
  | "DAI"
  | "USDC"
  | "USDT";
export type NetworkCollection =
  | "BITCOIN"
  | "LITECOIN"
  | "ETHEREUM"
  | "POLYGON"
  | "BASE"
  | "TRON"
  | "SOLANA";

export default class CoincordCoreWallet {
  private graphqlClient: GraphQLClient;
  constructor() {
    this.graphqlClient = graphqlClient;
  }

  async getApp() {
    try {
      let appResponse = await graphqlClient.request(app);
      if (appResponse) {
        return appResponse.app;
      }
    } catch (error) {
      throw new Error("Address not found");
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

  async createAddress(token: TokenCollectionType) {
    let address;
    try {
      address = await graphqlClient.request(createAddress, {
        token_set: token,
      });
      // console.log(address)
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
        }
      );

      return addressCollection._createAddressCollection;
      // console.log(address)
    } catch (error) {
      throw error;
    }
  }

  async getFeeEstimate(
    token: TokenCollectionType,
    value: number,
    recipient: string,
    network: NetworkCollection
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
}
