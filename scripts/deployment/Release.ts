import FileHelper from "../FileHelper";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import ContractInfo from "../addresses/ContractInfo";
import Deployment from "./Deployment";
import Roles from "./Roles";
import {AUSD, KYC, LiminalMarket, MarketCalendar, ServiceSettings, StakingPool} from "../../typechain-types";
import Verify from "./Verify";
import RelayerAddress from "../addresses/RelayerAddress";

export default class Release {
    hre: HardhatRuntimeEnvironment;

    constructor(hre: HardhatRuntimeEnvironment) {
        this.hre = hre;
    }

    public async Execute() {
        const contractInfo = ContractInfo.getContractInfo(this.hre.network.name);
        console.log('ContractInfo for network:' + contractInfo.NetworkName);
        await this.hre.run('compile');

        //make sure relayer address exists for network before doing anything
        RelayerAddress.getAddress(this.hre.network.name);

        console.log('starting to deploy or upgrade contracts');
        let deployment = new Deployment(this.hre);
        const [kycContract, kycStatus] = await deployment.deployOrUpgradeContract("KYC", contractInfo.KYC_ADDRESS);
        const [aUsdContract] = await deployment.deployOrUpgradeContract("aUSD", contractInfo.AUSD_ADDRESS);
        const [liminalMarketContract] = await deployment.deployOrUpgradeContract("LiminalMarket", contractInfo.LIMINAL_MARKET_ADDRESS);
        const [marketCalendarContract] = await deployment.deployOrUpgradeContract("MarketCalendar", contractInfo.MARKET_CALENDAR_ADDRESS);
        const [serviceSettingsContract] = await deployment.deployOrUpgradeContract("ServiceSettings", contractInfo.SERVICE_SETTINGS_ADDRESS);
        const [stakingPoolContract] = await deployment.deployOrUpgradeContract("StakingPool", contractInfo.STAKING_POOL_ADDRESS);

        console.log('setting addresses to contractInfo. These only change on new deployment, not upgrade');
        contractInfo.LIMINAL_MARKET_ADDRESS = liminalMarketContract.address;
        contractInfo.AUSD_ADDRESS = aUsdContract.address;
        contractInfo.KYC_ADDRESS = kycContract.address;
        contractInfo.MARKET_CALENDAR_ADDRESS = marketCalendarContract.address;
        contractInfo.SERVICE_SETTINGS_ADDRESS = serviceSettingsContract.address;
        contractInfo.STAKING_POOL_ADDRESS = stakingPoolContract.address;

        if (kycStatus == Deployment.Deployed) {
            let fileHelper = new FileHelper(this.hre);
            await fileHelper.writeContractAddressesToJs(contractInfo);

            console.log('setAddresses');
            await deployment.setAddresses(contractInfo, liminalMarketContract as LiminalMarket, aUsdContract as AUSD,
                serviceSettingsContract as ServiceSettings, stakingPoolContract as StakingPool);

            let roles = new Roles(liminalMarketContract as LiminalMarket,
                aUsdContract as AUSD, kycContract as KYC, marketCalendarContract as MarketCalendar,
                serviceSettingsContract as ServiceSettings, stakingPoolContract as StakingPool);
            await roles.grantRoles(this.hre, contractInfo);
        }

        if (this.hre.network.name != 'localhost') {
            let verify = new Verify(this.hre);

            await verify.verifyContract(kycContract.address)
            await verify.verifyContract(aUsdContract.address)
            await verify.verifyContract(liminalMarketContract.address)
            await verify.verifyContract(marketCalendarContract.address);
        }
        console.log('done:' + new Date());
    }

    public async setValuesAndVerify() {
        const contractInfo = ContractInfo.getContractInfo(this.hre.network.name);
        let deployment = new Deployment(this.hre);

        let liminalMarketContract = await ContractInfo.getContract<LiminalMarket>(this.hre, "LiminalMarket", contractInfo.LIMINAL_MARKET_ADDRESS);
        let aUsdContract = await ContractInfo.getContract<AUSD>(this.hre, "aUSD", contractInfo.AUSD_ADDRESS);
        let kycContract = await ContractInfo.getContract<KYC>(this.hre, "KYC", contractInfo.KYC_ADDRESS);
        let marketCalendarContract = await ContractInfo.getContract<MarketCalendar>(this.hre, "MarketCalendar", contractInfo.MARKET_CALENDAR_ADDRESS);
        let serviceSettingsContract = await ContractInfo.getContract<ServiceSettings>(this.hre, "ServiceSettings", contractInfo.SERVICE_SETTINGS_ADDRESS);
        let stakingPoolContract = await ContractInfo.getContract<StakingPool>(this.hre, "StakingPool", contractInfo.STAKING_POOL_ADDRESS);
        console.log('setAddresses');
        await deployment.setAddresses(contractInfo, liminalMarketContract, aUsdContract, serviceSettingsContract, stakingPoolContract)

        let roles = new Roles(liminalMarketContract as LiminalMarket,
            aUsdContract as AUSD, kycContract as KYC, marketCalendarContract as MarketCalendar,
            serviceSettingsContract as ServiceSettings, stakingPoolContract as StakingPool);

        await roles.grantRoles(this.hre, contractInfo);


        if (this.hre.network.name != 'localhost') {
            let verify = new Verify(this.hre);

            await verify.verifyContract(kycContract.address)
            await verify.verifyContract(aUsdContract.address)
            await verify.verifyContract(liminalMarketContract.address)
            await verify.verifyContract(marketCalendarContract.address);
        }
    }
}

