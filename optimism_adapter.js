const ethers = require("ethers");
import { abi } from "./abis/AaveProtocolDataProvider.json";

class GranaryOptimism {
    static async sync() {
        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/optimism");
        const CONTRACT_ADDRESS =  "0x9546F673eF71Ff666ae66d01Fd6E7C6Dae5a9995";
        const RAY = BigNumber.from("100000000000000000000");
        const SECONDS_PER_YEAR = 31536000;

        // AaveProtocolDataProvider
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

        // Fetches all reserves
        let allUnderlyingTokens = await contract.getAllReservesTokens();

        let rates: any[] = [];
        for (let i = 0; i < allUnderlyingTokens.length; i++) {
            let data = await contract.getReserveData(allUnderlyingTokens[i][1]); 
            let depositAPR = data.liquidityRate;
            let a = depositAPR.div(RAY).toNumber();
            let b = a / 10 ** 7;
            let humanReadableDepositAPY = (((1 + (b / SECONDS_PER_YEAR)) ** SECONDS_PER_YEAR) - 1) * 100;
            rates.push([allUnderlyingTokens[i][0], humanReadableDepositAPY]);
        }

        return rates;
    }
}

module.exports = GranaryOptimism;