import FileHelper from "../FileHelper";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import ContractInfo from "../addresses/ContractInfo";
import Deployment from "./Deployment";
import Roles from "./Roles";
import {AUSD, KYC, LiminalMarket, MarketCalendar} from "../../typechain-types";
import Verify from "./Verify";

export default class Release {
    hre : HardhatRuntimeEnvironment;
    constructor(hre : HardhatRuntimeEnvironment) {
        this.hre = hre;
    }

    public async Execute() {
        await this.hre.run('compile');

        const contractInfo = ContractInfo.getContractInfo(this.hre.network.name);

        console.log('starting to deploy or upgrade contracts');
        let deployment = new Deployment(this.hre);
        const [kycContract] = await deployment.deployOrUpgradeContract( "KYC", contractInfo.KYC_ADDRESS);
        const [aUsdContract] = await deployment.deployOrUpgradeContract( "aUSD", contractInfo.AUSD_ADDRESS);
        const [liminalMarketContract] = await deployment.deployOrUpgradeContract( "LiminalMarket", contractInfo.LIMINAL_MARKET_ADDRESS);
        const [marketCalendarContract] = await deployment.deployOrUpgradeContract( "MarketCalendar", contractInfo.MARKET_CALENDAR_ADDRESS);

        console.log('setting addresses to contractInfo. These only change on new deployment, not upgrade');
        contractInfo.LIMINAL_MARKET_ADDRESS = liminalMarketContract.address;
        contractInfo.AUSD_ADDRESS = aUsdContract.address;
        contractInfo.KYC_ADDRESS = kycContract.address;
        contractInfo.MARKET_CALENDAR_ADDRESS = marketCalendarContract.address;

        await deployment.setAddresses(contractInfo, liminalMarketContract as LiminalMarket, aUsdContract as AUSD)

        let fileHelper = new FileHelper(this.hre);
        await fileHelper.writeContractAddressesToJs(contractInfo);

        console.log('setAddresses');
        let roles = new Roles(liminalMarketContract as LiminalMarket,
            aUsdContract as AUSD, kycContract as KYC, marketCalendarContract as MarketCalendar);
        await roles.grantRoles(contractInfo);

        let verify = new Verify(this.hre);

        await verify.verifyContract(kycContract.address)
        await verify.verifyContract(aUsdContract.address)
        await verify.verifyContract(liminalMarketContract.address)
        await verify.verifyContract(marketCalendarContract.address);

        console.log('done:' + new Date());
    }
}