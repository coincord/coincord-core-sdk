require("dotenv").config()
// jest.useFakeTimers()
import CoreWalletSdk from "../lib"

// describe("Electrum tests", () => {
//     let newBitCoinWallet:any= null;
//     beforeEach(() => {
//         newBitCoinWallet = new Bitcoin.Electrum();
//     }) 

//     it("test if one can create an address", async () => {

//         let response = await newBitCoinWallet.createAddress()
//         // let result be checked
//         expect(typeof response.result).toBe('string');
//     })

//     it("test if one can get address balance", async () => {

//         let response = await newBitCoinWallet.createAddress()
//         // let result be checked
//         response = await newBitCoinWallet.getAddressBalance(response.result);
//         expect(response.result.confirmed).toBe("0");
//     })

//     it("test if address history can be generated", async () => {
//         // let response = await newBitCoinWallet.createAddress()
//         // let result be checked
//         let response = await newBitCoinWallet.getAddressLatestTransaction("tb1q0pqh78c8xkhm2vqgynk3uap6my4r9uhhy29a85");
//         if(response){
//             console.log(response)
//             expect(response).toMatchObject({"tx_hash": "something", "height":"another"});
//         }
//     })

//     it("if we can get transaction hash", async () => {
//         // let response = await newBitCoinWallet.createAddress()
//         // let result be checked
//         try {
//             let response = await newBitCoinWallet.getTransaction("062f7511f7776e27f33a7d620613b86b5c6a9dab9763177dffa3578fa151a55f");
//             console.log(response)
//             expect(response).toMatchObject({"tx_hash": "something", "height":"another"});
//         } catch (e) {
//             console.log(e)
//         }
//     })

//     it("get the most recent transaction on address", async () => {
//         // let response = await newBitCoinWallet.createAddress()
//         // let result be checked
//         try {
//             let response = await newBitCoinWallet.getRecentTransactionForAddress("tb1q0pqh78c8xkhm2vqgynk3uap6my4r9uhhy29a85");
//             console.log(response)
//             expect(response).toMatchObject({"tx_hash": "something", "height":"another"});
//         } catch (e) {
//             console.log(e)
//         }
//     })
// })
describe("Core SDK test", () => {
    let coreSDKLib: CoreWalletSdk
    beforeEach(() => {
        coreSDKLib = new CoreWalletSdk()
    })

    it("get the current app data", async () => {

        let response = await coreSDKLib.getApp()
        // let response = await coreSDKLib.createAddress("LITECOIN")
        console.log(response)
        expect(typeof response.id).toBe("string");
    })
    it("test if one can create a bitcoin address", async () => {

        let response = await coreSDKLib.createAddress("BITCOIN")
        // let response = await coreSDKLib.createAddress("LITECOIN")
        console.log(response)
        expect(typeof response.address).toBe("string");
    })

    it("test if one can create a litecoin address", async () => {

        let response = await coreSDKLib.createAddress("LITECOIN")
        // let response = await coreSDKLib.createAddress("LITECOIN")
        console.log(response)
        expect(typeof response.address).toBe("string");
    })
    it("test the sending of bitcoin tokens", async () => {

        let response = await coreSDKLib.sendTokens({
            sender: null,
            recipient: "tb1qxu0lgzldlk8dd443synme8mapf3y9zzystjq6t",
            amount: 0.0003,
            token: "BITCOIN"
        })
        // let response = await coreSDKLib.createAddress("LITECOIN")
        console.log(response)
        expect(typeof response.address).toBe("string");
    })
    it("test the sending of litecoin tokens", async () => {

        let response = await coreSDKLib.sendTokens({
            sender: null,
            recipient: "tltc1qe0mltkkvm5l5tl8r0u5uyxuygdxh63jamrmexh",
            amount: 0.3,
            token: "LITECOIN"
        })
        // let response = await coreSDKLib.createAddress("LITECOIN")
        console.log(response)
        expect(typeof response.address).toBe("string");
    })
})