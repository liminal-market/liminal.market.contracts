
import {HardhatRuntimeEnvironment} from "hardhat/types";
import ContractInfo from "./addresses/ContractInfo";

export default class Funding {
    hre : HardhatRuntimeEnvironment;
    constructor(hre : HardhatRuntimeEnvironment) {
        this.hre = hre;
    }

    public async fundAUSD(amount = 1000, userWallet = "0x93da645082493bbd7116fc057c5b9adfd5363912") {
        const addresses = ContractInfo.getContractInfo(this.hre.network.name)
        const contract = await this.hre.ethers.getContractAt("aUSD", addresses.AUSD_ADDRESS);
        await contract.setBalance(userWallet, amount.toString() + "0".repeat(18))
        console.log('Funded ' + amount + ' to wallet ' + userWallet);
    }
}