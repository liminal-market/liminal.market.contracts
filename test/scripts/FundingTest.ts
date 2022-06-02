import Funding from "../../scripts/Funding";
import chai from "chai";
import hre from "hardhat";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import Deployment from "../../scripts/deployment/Deployment";
import {Wallet} from "ethers";
import {AUSD} from "../../typechain-types";

describe("Test funding", () => {
    const expect = chai.expect;
    const waffle = hre.waffle;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);

    let wallet2 : Wallet;
    [, wallet2] = waffle.provider.getWallets();


    it("Fund account", async () => {
        let amount = 100;
        let deployment = new Deployment(hre);
        let [contract,] = await deployment.deployOrUpgradeContract('aUSD', "");

        let fund = new Funding(hre);
        await fund.fundAUSD(amount, wallet2.address);

        let balance = await (contract as AUSD).balanceOf(wallet2.address)
        expect(balance).to.be.equal(amount);



    })

})