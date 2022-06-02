import chai from "chai";
import hre from "hardhat";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import {smock} from "@defi-wonderland/smock";
import Deployment from "../../../scripts/deployment/Deployment";
import * as fs from "fs";
import ContractInfo from "../../../scripts/addresses/ContractInfo";
import {getImplementationAddress} from "@openzeppelin/upgrades-core";
import {AUSD, LiminalMarket} from "../../../typechain-types";


describe("Test Deployment script", () => {
    const expect = chai.expect;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);


    it("Deployment contract", async () => {
        let deployment = new Deployment(hre);
        let [, status] = await deployment.deployOrUpgradeContract("KYC", "");
        expect(status).to.be.equal(Deployment.Deployed);
    })

    it("Deploy and update contract", async () => {

        let contractName = "KYC";

        let deployment = new Deployment(hre);
        let [contract, status] = await deployment.deployOrUpgradeContract(contractName, "");
        expect(status).to.be.equal(Deployment.Deployed);
        let implementationAddress = await getImplementationAddress(hre.ethers.provider, contract.address);
        expect(implementationAddress).not.to.be.equal(contract.address);

        await copyContractCodeFakeV2(contractName);
        await hre.run('compile');

        let [contractV2, statusV2] = await deployment.deployOrUpgradeContract(contractName + "V2", contract.address);
        expect(statusV2).to.be.equal(Deployment.Upgraded);
        expect(contractV2.address).to.be.equal(contract.address);

        let implementationAddressV2 = await getImplementationAddress(hre.ethers.provider, contractV2.address);
        expect(implementationAddressV2).not.to.be.equal(contract.address);

        fs.rm('./contracts/' + contractName + 'V2.sol', () => {});

    });

    it("Check if contract exists on chain, first deploy then check, should be on chain", async () => {

        let deployment = new Deployment(hre);
        let [contract, ] = await deployment.deployOrUpgradeContract("KYC", "");

        let result = await deployment.contractExistsOnChain("KYC", contract.address);
        expect(result).to.be.true;
    });

    it("Check if contract exists on chain, it should not be on chain", async () => {
        let contractInfo = ContractInfo.getContractInfo(hre.network.name);

        let deployment = new Deployment(hre);
        let result = await deployment.contractExistsOnChain("aUSD", contractInfo.LIMINAL_MARKET_ADDRESS);
        expect(result).to.be.false;
    });

    it("should set addresses on contracts", async () => {
        let aUsdContract = await smock.fake<AUSD>('aUSD');

        let liminalMarketContract = await smock.fake<LiminalMarket>('LiminalMarket');
        let contractInfo = ContractInfo.getContractInfo(hre.network.name);

        let deployment = new Deployment(hre);
        await deployment.setAddresses(contractInfo, liminalMarketContract, aUsdContract);

        expect(liminalMarketContract.setAddresses).to.been.calledWith(contractInfo.AUSD_ADDRESS, contractInfo.KYC_ADDRESS, contractInfo.MARKET_CALENDAR_ADDRESS);
        expect(aUsdContract).to.been.calledWith(contractInfo.LIMINAL_MARKET_ADDRESS);

    })

    const copyContractCodeFakeV2 = async function(name : string) {
        await fs.readFile('./contracts/' + name + '.sol', 'utf-8', function (err, contents) {
            if (err) {
                console.log(err);
                return;
            }

            const replaced = contents.replace('contract ' + name, 'contract ' + name + 'V2');

            fs.writeFile('./contracts/' + name + 'V2.sol', replaced, 'utf-8', function (err) {
                console.log(err);
            });
        });
    }
})