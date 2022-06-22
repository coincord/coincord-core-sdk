require("dotenv").config()
// jest.useFakeTimers()
import * as Bitcoin from "../lib/bitcoin"
// import LegoCrypto from "../lib"
import ERC20 from "../lib/erc20"
import { ERC20Module } from "../lib/erc20/erc20-module"

const USDC_abi = require("../lib/abi/USDC_mainnet_abi.json")

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
describe("Erc20 tests", () => {
    let erc20Instance: ERC20Module
    beforeEach(() => {
        console.log(ERC20)
        erc20Instance = ERC20("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", USDC_abi.abi)
    })

    it("test if one can create an address", async () => {

        let response = await erc20Instance.createAddress()
        // let result be checked
        console.log(response)
        expect(typeof response.address).toBe("string");
    })


    it("test if one can get address balance", async () => {

        let response = await newBitCoinWallet.createAddress()
        // let result be checked
        console.log(response)
        // response = await newBitCoinWallet.getAddressBalance(response.result);
        expect(response).toBe("string");
    })

    it("test if address history can be generated", async () => {
        // let response = await newBitCoinWallet.createAddress()
        // let result be checked
        let response = await newBitCoinWallet.getAddressLatestTransaction("tb1q0pqh78c8xkhm2vqgynk3uap6my4r9uhhy29a85");
        if (response) {
            console.log(response)
            expect(response).toMatchObject({ "tx_hash": "something", "height": "another" });
        }
    })

    it("if we can get transaction hash", async () => {
        // let response = await newBitCoinWallet.createAddress()
        // let result be checked
        console.log(response)        // response = await newBitCoinWallet.getAddressBalance(response.result);
        expect(response).toBe(true);
    })

    it("get the most recent transaction on address", async () => {
        // let response = await newBitCoinWallet.createAddress()
        // let result be checked
        try {
            let response = await newBitCoinWallet.getTransaction("tb1q0pqh78c8xkhm2vqgynk3uap6my4r9uhhy29a85");
            console.log(response)
            expect(response).toMatchObject({ "tx_hash": "something", "height": "another" });
        } catch (e) {
            console.log(e)
        }
    })

    it("test we can send tokens to other addresses", async () => {

        let response = await newBitCoinWallet.sendTokensFromAddressTo(
            "tb1qwznrscjr3kzne4g7z6z76xc70emp6vegnzxde9",
            "tb1q37ql5pz4dnupan8p2srj4vutz6puxaepvwesgt",
            parseFloat("0.00005"),
            parseFloat("0.0001"),
        )
        // let result be checked
        expect(typeof response.result).toBe('string');
    })
})