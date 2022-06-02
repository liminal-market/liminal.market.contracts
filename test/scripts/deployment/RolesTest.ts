import Roles from "../../../scripts/deployment/Roles";
import chai from "chai";
import hre, {waffle} from "hardhat";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import {FakeContract, smock} from "@defi-wonderland/smock";
import {AUSD, KYC, LiminalMarket, MarketCalendar} from "../../../typechain-types";
import ContractInfo from "../../../scripts/addresses/ContractInfo";

describe("Validate Roles class", () => {
    const expect = chai.expect;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);


    it("NOT IMPLEMENTED - Should test & validate that all roles are set correctly", async () => {
        /*

         let liminalMarket = await smock.fake<LiminalMarket>("LiminalMarket");
         let aUSD = await smock.fake<AUSD>("aUSD");
         let kyc = await smock.fake<KYC>("KYC");
         let marketCalendar = await smock.fake<MarketCalendar>("MarketCalendar");
         let contractInfo = ContractInfo.getContractInfo(hre.network.name);

         let [wallet2] = waffle.provider.getWallets();
         liminalMarket.grantMintAndBurnRole.reset();
         liminalMarket.grantMintAndBurnRole.reverts("ble");
         liminalMarket.grantMintAndBurnRole.returns();



         let role = new Roles(liminalMarket, aUSD, kyc, marketCalendar);
         await role.grantRoles(contractInfo);

         expect((liminalMarket as FakeContract<LiminalMarket>).grantMintAndBurnRole).to.be.calledWith(contractInfo.getRelayerAddress());
         expect(aUSD.grantRoleForBalance).to.be.calledWith(contractInfo.LIMINAL_MARKET_ADDRESS);
         expect(aUSD.grantRoleForBalance).to.be.calledWith(contractInfo.getRelayerAddress());
         expect(kyc.grantRoleForKyc).to.be.calledWith(contractInfo.getRelayerAddress());
         expect(marketCalendar.grantCalendarRole).to.be.calledWith(contractInfo.getRelayerAddress());
         */

    })


})