require('dotenv').config()
import * as Bitcoin from "./bitcoin"
import * as Litecoin from "./litecoin"
import ERC20 from "./erc20"

export default {
    Bitcoin,
    Litecoin,
    ERC20
}