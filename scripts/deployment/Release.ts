import FileHelper from "../FileHelper";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import ContractInfo from "../addresses/ContractInfo";
import Deployment from "./Deployment";
import Roles from "./Roles";
import {AUSD, KYC, LiminalMarket, LM, MarketCalendar, ServiceContract} from "../../typechain-types";
import Verify from "./Verify";
import {Contract} from "ethers";

export default class Release {
    hre: HardhatRuntimeEnvironment;

    constructor(hre: HardhatRuntimeEnvironment) {
        this.hre = hre;
    }

    static Update = true;
    public async Execute() {
        const contractInfo = ContractInfo.getContractInfo(this.hre.network.name);
        console.log('ContractInfo for network:' + contractInfo.NetworkName);
        await this.hre.run('compile');

        console.log('starting to deploy or upgrade contracts');
        let deployment = new Deployment(this.hre);
        const [kycContract, kycStatus] = await deployment.deployOrUpgradeContract("KYC", contractInfo.KYC_ADDRESS);
        console.log('-- KYC ' + kycStatus + '--')
        const [aUsdContract, aUsdStatus] = await deployment.deployOrUpgradeContract("aUSD", contractInfo.AUSD_ADDRESS);
        console.log('-- aUSD ' + aUsdStatus + '--')
        const [liminalMarketContract, liminalMarketStatus] = await deployment.deployOrUpgradeContract("LiminalMarket", contractInfo.LIMINAL_MARKET_ADDRESS);
        console.log('-- LiminalMarket ' + liminalMarketStatus + '--')
        const [marketCalendarContract, marketCalendarStatus] = await deployment.deployOrUpgradeContract("MarketCalendar", contractInfo.MARKET_CALENDAR_ADDRESS);
        console.log('-- MarketCalendar ' + marketCalendarStatus + '--');
        const [lmContract, lmStatus] = await deployment.deployOrUpgradeContract("LM", contractInfo.LM_ADDRESS);
        console.log('-- LM ' + lmStatus + '--');
        const [serviceContract, serviceContractStatus] = await deployment.deployOrUpgradeContract("ServiceContract", contractInfo.SERVICE_CONTRACT_ADDRESS);
        console.log('-- ServiceContract ' + serviceContractStatus + '--');
        console.log('\n\n');
        console.log('setting addresses to contractInfo. These only change on new deployment, not upgrade');
        contractInfo.LIMINAL_MARKET_ADDRESS = liminalMarketContract.address;
        contractInfo.AUSD_ADDRESS = aUsdContract.address;
        contractInfo.KYC_ADDRESS = kycContract.address;
        contractInfo.MARKET_CALENDAR_ADDRESS = marketCalendarContract.address;
        contractInfo.LM_ADDRESS = lmContract.address;
        contractInfo.SERVICE_CONTRACT_ADDRESS = serviceContract.address;
        if (!contractInfo.NO_FEE_CONTRACT_ADDRESS) {
            let contract = await deployment.deployContract("LiminalMarketExternalService", contractInfo.LIMINAL_MARKET_ADDRESS);
            contractInfo.NO_FEE_CONTRACT_ADDRESS = contract.address;
        }
        let fileHelper = new FileHelper(this.hre);
        await fileHelper.writeContractAddressesToJs(contractInfo);

        console.log('setAddresses');
        await deployment.setAddresses(contractInfo, liminalMarketContract as LiminalMarket, aUsdContract as AUSD, lmContract as LM, serviceContract as ServiceContract);

        //if (kycStatus == Deployment.Deployed)
        {
            let roles = new Roles(liminalMarketContract as LiminalMarket,
                aUsdContract as AUSD, kycContract as KYC, marketCalendarContract as MarketCalendar, lmContract as LM, serviceContract as ServiceContract);
            await roles.grantRoles(this.hre, contractInfo);
        }

        await this.verifyContracts(kycContract, aUsdContract, liminalMarketContract, marketCalendarContract, lmContract, serviceContract);
        console.log('done:' + new Date());
    }


    public async setValuesAndVerify() {
        const contractInfo = ContractInfo.getContractInfo(this.hre.network.name);
        let deployment = new Deployment(this.hre);

        let liminalMarketContract = await ContractInfo.getContract<LiminalMarket>(this.hre, "LiminalMarket", contractInfo.LIMINAL_MARKET_ADDRESS);
        let aUsdContract = await ContractInfo.getContract<AUSD>(this.hre, "aUSD", contractInfo.AUSD_ADDRESS);
        let kycContract = await ContractInfo.getContract<KYC>(this.hre, "KYC", contractInfo.KYC_ADDRESS);
        let marketCalendarContract = await ContractInfo.getContract<MarketCalendar>(this.hre, "MarketCalendar", contractInfo.MARKET_CALENDAR_ADDRESS);
        let lmContract = await ContractInfo.getContract<LM>(this.hre, "LM", contractInfo.LM_ADDRESS);
        let serviceContract = await ContractInfo.getContract<ServiceContract>(this.hre, "ServiceContract", contractInfo.SERVICE_CONTRACT_ADDRESS);

        console.log('setAddresses');
        await deployment.setAddresses(contractInfo, liminalMarketContract, aUsdContract, lmContract, serviceContract)

        let roles = new Roles(liminalMarketContract as LiminalMarket,
            aUsdContract as AUSD, kycContract as KYC, marketCalendarContract as MarketCalendar,
            lmContract, serviceContract);
        await roles.grantRoles(this.hre, contractInfo);

        await this.verifyContracts(kycContract, aUsdContract, liminalMarketContract, marketCalendarContract, lmContract, serviceContract);
    }


    private async verifyContracts(kycContract: Contract, aUsdContract: Contract, liminalMarketContract: Contract, marketCalendarContract: Contract, lmContract: Contract, serviceContract: Contract) {
        if (this.hre.network.name != 'localhost') {
            let verify = new Verify(this.hre);

            await verify.verifyContract(kycContract.address)
            await verify.verifyContract(aUsdContract.address)
            await verify.verifyContract(liminalMarketContract.address)
            await verify.verifyContract(marketCalendarContract.address);
            await verify.verifyContract(lmContract.address);
            await verify.verifyContract(serviceContract.address);
        } else {
            let date = new Date();
            date.setHours(13, 50);
            console.log('Setting block timestamp')
            // await timers.time.setNextBlockTimestamp( / 1000);
            let timestamp = parseInt((date.getTime() / 1000).toString());
            console.log('timestamp', timestamp, date);
            await this.hre.network.provider.send("evm_setNextBlockTimestamp", [timestamp])
            await this.hre.network.provider.send("evm_mine")
        }
    }
}

