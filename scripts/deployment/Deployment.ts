import {HardhatRuntimeEnvironment} from "hardhat/types";
import ContractInfo from "../addresses/ContractInfo";
import { Contract, Signer} from "ethers";
import ContractAddresses from "../addresses/ContractAddresses";
import {AUSD, LiminalMarket} from "../../typechain-types";
import {FakeContract} from "@defi-wonderland/smock";
import TaskHelper from "../TaskHelper";

export default class Deployment {

    hre : HardhatRuntimeEnvironment;
    signer : Signer;
    static Deployed = 'deployed';
    static Upgraded = 'upgraded';

    constructor(hre : HardhatRuntimeEnvironment) {
        this.hre = hre;
        this.signer = TaskHelper.GetSigner(hre);

    }

    public async deployOrUpgradeContract(contractName: string,
                                         preexistingAddress: string) : Promise<[Contract, string]> {

        let Contract = await this.hre.ethers.getContractFactory(contractName);
        console.log('deployment for contractName:' + contractName + ' | preexistingAddress:' + preexistingAddress);
        if (this.hre.network.name == 'hardhat') {
            throw new Error("Should not deploy on hardhat. Did you forget to set --network localhost?")
        }

        Contract.connect(this.signer);

        let contract;
        let status = Deployment.Deployed;
        let upgrade = (preexistingAddress == '') ? false : await this.contractExistsOnChain(contractName, preexistingAddress);
        console.log('upgrade:', upgrade);
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
        let contract = await ContractInfo.getContract(this.hre, contractName, address);
        try {
            let result = await contract.deployed();
            console.log(result);
            return true;
        } catch (e: any) {
            return false;
        }
    }

    public async setAddresses(contractInfo: ContractAddresses, liminalMarketContract: LiminalMarket | FakeContract<LiminalMarket>, aUsdContract : AUSD | FakeContract<AUSD>) {
        await liminalMarketContract.connect(this.signer).setAddresses(contractInfo.AUSD_ADDRESS, contractInfo.KYC_ADDRESS, contractInfo.MARKET_CALENDAR_ADDRESS);
        await aUsdContract.connect(this.signer).setLiminalMarketAddress(contractInfo.LIMINAL_MARKET_ADDRESS);
    }

}