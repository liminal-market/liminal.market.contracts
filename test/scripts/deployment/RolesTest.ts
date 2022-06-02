import Roles from "../../../scripts/deployment/Roles";
import chai from "chai";
import hre from "hardhat";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import {smock} from "@defi-wonderland/smock";
import {AUSD, KYC, LiminalMarket, MarketCalendar} from "../../../typechain-types";
import ContractInfo from "../../../scripts/addresses/ContractInfo";

describe("Validate Roles class", () => {
    const expect = chai.expect;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);


    it("Should test & validate that all roles are set correctly", async () => {
        let liminalMarket = await smock.fake<LiminalMarket>("LiminalMarket");
        let aUSD = await smock.fake<AUSD>("aUSD");
        let kyc = await smock.fake<KYC>("KYC");
        let marketCalendar = await smock.fake<MarketCalendar>("MarketCalendar");
        let contractInfo = ContractInfo.getContractInfo(hre.network.name);

        await liminalMarket.grantMintAndBurnRole.whenCalledWith(contractInfo.getRelayerAddress());

        let role = new Roles(hre, liminalMarket, aUSD, kyc, marketCalendar);
        await role.grantRoles(contractInfo);

        expect(liminalMarket.grantMintAndBurnRole).to.be.calledWith(contractInfo.getRelayerAddress());
        expect(aUSD.grantRoleForBalance).to.be.calledWith(contractInfo.LIMINAL_MARKET_ADDRESS);
        expect(aUSD.grantRoleForBalance).to.be.calledWith(contractInfo.getRelayerAddress());
        expect(kyc.grantRoleForKyc).to.be.calledWith(contractInfo.getRelayerAddress());
        expect(marketCalendar.grantCalendarRole).to.be.calledWith(contractInfo.getRelayerAddress());
    })


})