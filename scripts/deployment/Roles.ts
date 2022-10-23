import ContractAddresses from "../addresses/ContractAddresses";
import {AUSD, KYC, LiminalMarket, MarketCalendar} from "../../typechain-types";
import {FakeContract} from "@defi-wonderland/smock";
import TaskHelper from "../TaskHelper";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ContractTransaction} from "ethers/lib/ethers";

export default class Roles {

    liminalMarket: LiminalMarket | FakeContract<LiminalMarket>;
    aUSD: AUSD | FakeContract<AUSD>;
    kyc: KYC | FakeContract<KYC>;
    marketCalendar: MarketCalendar | FakeContract<MarketCalendar>;

    constructor(
        liminalMarket: LiminalMarket | FakeContract<LiminalMarket>,
        aUSD: AUSD | FakeContract<AUSD>,
        kyc: KYC | FakeContract<KYC>,
        marketCalendar: MarketCalendar | FakeContract<MarketCalendar>) {
        this.liminalMarket = liminalMarket;
        this.aUSD = aUSD
        this.kyc = kyc;
        this.marketCalendar = marketCalendar;

    }

    public async grantRoles(hre: HardhatRuntimeEnvironment, contractInfo: ContractAddresses) {

        let signer = TaskHelper.GetSigner(hre);

        let relayerAddress = contractInfo.getRelayerAddress();

        let result : ContractTransaction;
        console.log('grant relayerAddress:' + relayerAddress + " to Liminal.market");
        result = await this.liminalMarket.connect(signer).grantMintAndBurnRole(relayerAddress);
        console.log(result.hash);
        console.log('grant liminalAddress:' + this.liminalMarket.address + " to aUSD");
        result = await this.aUSD.connect(signer).grantRoleForBalance(this.liminalMarket.address);
        console.log(result.hash);
        console.log('grant relayerAddress:' + relayerAddress + " to aUSD");
        result = await this.aUSD.connect(signer).grantRoleForBalance(relayerAddress);
        console.log(result.hash);

        console.log('grant relayerAddress:' + relayerAddress + " to KYC");
        result = await this.kyc.connect(signer).grantRoleForKyc(relayerAddress);
        console.log(result.hash);
        console.log('grant relayerAddress:' + relayerAddress + " to Calendar");
        result = await this.marketCalendar.connect(signer).grantCalendarRole(relayerAddress);
        console.log(result.hash);
    }

}