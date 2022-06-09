import ContractAddresses from "../addresses/ContractAddresses";
import {AUSD, KYC, LiminalMarket, MarketCalendar} from "../../typechain-types";
import {FakeContract} from "@defi-wonderland/smock";
import TaskHelper from "../TaskHelper";
import {HardhatRuntimeEnvironment} from "hardhat/types";

export default class Roles {

    liminalMarket : LiminalMarket | FakeContract<LiminalMarket>;
    aUSD : AUSD | FakeContract<AUSD>;
    kyc : KYC | FakeContract<KYC>;
    marketCalendar : MarketCalendar | FakeContract<MarketCalendar>;

    constructor(
                liminalMarket : LiminalMarket | FakeContract<LiminalMarket>,
                aUSD : AUSD | FakeContract<AUSD>,
                kyc : KYC | FakeContract<KYC>,
                marketCalendar : MarketCalendar | FakeContract<MarketCalendar>) {
        this.liminalMarket = liminalMarket;
        this.aUSD = aUSD
        this.kyc = kyc;
        this.marketCalendar = marketCalendar;

    }

    public async grantRoles(hre : HardhatRuntimeEnvironment, contractInfo : ContractAddresses) {
        let signer = TaskHelper.GetSigner(hre);

        let relayerAddress = contractInfo.getRelayerAddress();

        console.log('grant relayerAddress:' + relayerAddress + " to Liminal.market");
        await this.liminalMarket.connect(signer).grantMintAndBurnRole(relayerAddress);

        console.log('grant liminalAddress:' + this.liminalMarket.address + " to aUSD");
        await this.aUSD.connect(signer).grantRoleForBalance(this.liminalMarket.address);
        console.log('grant relayerAddress:' + relayerAddress + " to aUSD");
        await this.aUSD.connect(signer).grantRoleForBalance(relayerAddress);


        console.log('grant relayerAddress:' + relayerAddress + " to KYC");
        await this.kyc.connect(signer).grantRoleForKyc(relayerAddress);

        await this.marketCalendar.connect(signer).grantCalendarRole(relayerAddress);
    }


}