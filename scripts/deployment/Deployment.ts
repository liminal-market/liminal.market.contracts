import {HardhatRuntimeEnvironment} from "hardhat/types";
import {BaseContract, Contract, ContractFactory, Signer} from "ethers";
import ContractAddresses from "../addresses/ContractAddresses";
import {AUSD, LiminalMarket, LM, ServiceContract} from "../../typechain-types";
import {FakeContract} from "@defi-wonderland/smock";
import TaskHelper from "../TaskHelper";

export default class Deployment {

    hre: HardhatRuntimeEnvironment;
    signer: Signer;
    contractFactory?: ContractFactory;
    static Deployed = 'deployed';
    static Upgraded = 'upgraded';

    constructor(hre: HardhatRuntimeEnvironment) {
        this.hre = hre;
        this.signer = TaskHelper.GetSigner(hre);

    }

    public async deployContract(contractName : string, constrArgs : any) : Promise<Contract> {
        this.contractFactory = await this.hre.ethers.getContractFactory(contractName);
        console.log('deployment for contractName:' + contractName);
        this.contractFactory = this.contractFactory.connect(this.signer);
        return await this.contractFactory.deploy(constrArgs);
    }

    public async deployOrUpgradeContract(contractName: string,
                                         preexistingAddress: string): Promise<[Contract, string]> {

        this.contractFactory = await this.hre.ethers.getContractFactory(contractName);
        console.log('deployment for contractName:' + contractName + ' | preexistingAddress:' + preexistingAddress);
        if (this.hre.network.name == 'hardhat') {
            //throw new Error("Should not deploy on hardhat. Did you forget to set --network localhost?")
        }

        this.contractFactory = this.contractFactory.connect(this.signer);
        let contract;
        let status = Deployment.Deployed;

        let upgrade = (preexistingAddress == "") ? false : await this.contractExistsOnChain(contractName, preexistingAddress);
        console.log('upgrade:', upgrade);
        if (upgrade) {
            contract = await this.hre.upgrades.upgradeProxy(preexistingAddress, this.contractFactory, {timeout: 0});
            status = Deployment.Upgraded;
        } else {
            contract = await this.hre.upgrades.deployProxy(this.contractFactory, undefined, {timeout: 0});
        }

        await contract.deployed();
        console.log(contractName + " " + status + ":", contract.address);
        if (status == Deployment.Upgraded && contract.address != preexistingAddress) {
            throw new Error("Upgraded contract doesn't have same address. This is BAD!!! preexistingAddress:" + preexistingAddress + " | new address:" + contract.address)
        }

        return [contract, status];
    }

    public async contractExistsOnChain(contractName: string, address: string): Promise<boolean> {

        let contract = await this.contractFactory?.attach(address) as BaseContract // ContractInfo.getContract(this.hre, contractName, address);
        if (!contract) return false;
        try {
            await contract.deployed();
            return true;
        } catch (e: any) {
            if (e.toString().indexOf('contract not deployed') != -1) {
                return false;
            }
            throw e;
        }
    }

    public async setAddresses(contractInfo: ContractAddresses, liminalMarketContract: LiminalMarket | FakeContract<LiminalMarket>,
                              aUsdContract: AUSD | FakeContract<AUSD>, LMContract: LM | FakeContract<LM>, ServiceContract : ServiceContract | FakeContract<ServiceContract>) {
        console.log('set addresses for LiminalMarket contract')
        await liminalMarketContract.connect(this.signer).setAddresses(contractInfo.AUSD_ADDRESS, contractInfo.KYC_ADDRESS, contractInfo.MARKET_CALENDAR_ADDRESS, contractInfo.LM_ADDRESS);
        console.log('set addresses for aUSD contract')
        await aUsdContract.connect(this.signer).setLiminalMarketAddress(contractInfo.LIMINAL_MARKET_ADDRESS);
        console.log('set address for serviceContract')
        await LMContract.connect(this.signer).setServiceContractAddress(contractInfo.SERVICE_CONTRACT_ADDRESS);
        await LMContract.connect(this.signer).transfer(contractInfo.getRelayerAddress(), '10000000' + '0'.repeat(18))
        console.log('set address for lm serviceFee')
        await ServiceContract.connect(this.signer).setAddress(contractInfo.LIMINAL_MARKET_ADDRESS);
        await ServiceContract.connect(this.signer).setLMServiceFeeAddress(contractInfo.getLMServiceFeeAddress());
    }

}