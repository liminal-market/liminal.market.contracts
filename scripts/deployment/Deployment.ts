import {HardhatRuntimeEnvironment} from "hardhat/types";
import ContractInfo from "../addresses/ContractInfo";
import {Contract} from "ethers";
import ContractAddresses from "../addresses/ContractAddresses";
import {AUSD, LiminalMarket} from "../../typechain-types";
import {FakeContract} from "@defi-wonderland/smock";

export default class Deployment {

    hre : HardhatRuntimeEnvironment;
    static Deployed = 'deployed';
    static Upgraded = 'upgraded';

    constructor(hre : HardhatRuntimeEnvironment) {
        this.hre = hre;
    }

    public async deployOrUpgradeContract(contractName: string,
                                         preexistingAddress: string) : Promise<[Contract, string]> {

        const Contract = await this.hre.ethers.getContractFactory(contractName);

        let contract;
        let status = Deployment.Deployed;
        let upgrade = await this.contractExistsOnChain(contractName, preexistingAddress);
        if (upgrade) {
            contract = await this.hre.upgrades.upgradeProxy(preexistingAddress, Contract);
            status = Deployment.Upgraded;
        } else {
            contract = await this.hre.upgrades.deployProxy(Contract);
        }

        await contract.deployed();
        console.log(contractName + " " + status + ":", contract.address);
        if (status == Deployment.Upgraded && contract.address != preexistingAddress) {
            throw new Error("Upgraded contract doesn't have same address. This is BAD!!! preexistingAddress:" + preexistingAddress + " | new address:" + contract.address)
        }

        return [contract, status];
    }

    public async contractExistsOnChain (contractName: string, address: string) : Promise<boolean> {
        let contract = await ContractInfo.getContract(this.hre, contractName, address)
        try {
            await contract.deployed()
            return true;
        } catch (e: any) {
            return false;
        }
    }

    public async setAddresses(contractInfo: ContractAddresses, liminalMarketContract: LiminalMarket | FakeContract<LiminalMarket>, aUsdContract : AUSD | FakeContract<AUSD>) {
        await liminalMarketContract.setAddresses(contractInfo.AUSD_ADDRESS, contractInfo.KYC_ADDRESS, contractInfo.MARKET_CALENDAR_ADDRESS);
        await aUsdContract.setLiminalMarketAddress(contractInfo.LIMINAL_MARKET_ADDRESS);
    }
}