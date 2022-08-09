require('dotenv').config()
import { GraphQLClient } from "graphql-request"
import graphqlClient from "./requester"
import { createAddress, sendTokens, app, feeRate, addresses, events, getEstimateQuery } from "./queries"

export type TokenCollectionType = "BITCOIN" | "LITECOIN" | "ETHEREUM" | "DAI" | "USDC" | "DAI" | "USDT"

export default class CoincordCoreWallet {

    private graphqlClient: GraphQLClient
    constructor() {
        this.graphqlClient = graphqlClient
    }

    async getApp() {
        try {
            let appResponse = await graphqlClient.request(app)
            if (appResponse) {
                return appResponse.app
            }
        } catch (error) {
            throw new Error("Address not found")
        }
    }

    async getFeeRate() {
        try {
            let feeRateResponse = await graphqlClient.request(feeRate)
            if (feeRateResponse) {
                return feeRateResponse.fee_rate
            }
        } catch (error) {
            throw error
        }
    }

    async createAddress(token: TokenCollectionType) {
        let address;
        try {
            address = await graphqlClient.request(createAddress, {
                        token_set: token
                    })
                    // console.log(address)
            return address.address__createAddress
        } catch (error) {
            throw error
        }
    }

    async getFeeEstimate(token: TokenCollectionType, value: number, recipient: string) {
        let estimateObject;
        try {
            estimateObject = await graphqlClient.request(getEstimateQuery, {
                token: token,
                value: value,
                recipient: recipient
            })
            return estimateObject.address__getEstimate
        } catch (error) {
            throw error
        }
    }

    async addresses() {
        let address;
        try {
            address = await graphqlClient.request(addresses)
            return address.addresses
        } catch (error) {
            throw error
        }
    }

    async getEvents(token: TokenCollectionType, address: string | null) {
        let eventsData;
        try {
            eventsData = await graphqlClient.request(events, {
                token: token,
                address: address
            })
            return eventsData.events
        } catch (error) {
            throw error
        }
    }

    async sendTokens(request: {
        recipient: string,
        fee_rate: number,
        sender: string | null,
        reference: string | null,
        amount: number,
        token: TokenCollectionType
    }) {
        try {
            let response = await graphqlClient.request(sendTokens, {
                ...request
            })
            return response.address__sendTokens
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}