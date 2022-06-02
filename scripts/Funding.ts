
import {HardhatRuntimeEnvironment} from "hardhat/types";

export default class Funding {
    hre : HardhatRuntimeEnvironment;
    constructor(hre : HardhatRuntimeEnvironment) {
        this.hre = hre;
    }

    public async fundAUSD(contractAddress : string, amount = "1000000000000000000000", userWallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") {

        const contract = await this.hre.ethers.getContractAt("aUSD", contractAddress);
        await contract.setBalance(userWallet, amount)
        console.log('Funded ' + amount + ' to wallet ' + userWallet);
    }
}