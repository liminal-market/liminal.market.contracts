import chai from "chai";
import hre, {waffle} from "hardhat";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import {smock} from "@defi-wonderland/smock";
import Deployment from "../../../scripts/deployment/Deployment";
import * as fs from "fs";
import ContractInfo from "../../../scripts/addresses/ContractInfo";
import {getImplementationAddress} from "@openzeppelin/upgrades-core";
import {AUSD, KYC, LiminalMarket, MarketCalendar} from "../../../typechain-types";


describe("Test Deployment script", () => {
    const expect = chai.expect;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);


    after("cleanup files", async () => {
        await removeGeneratedFiles("aUSD", "aUSD_V2");
        await removeGeneratedFiles("KYC", "KYC_V2");
        await removeGeneratedFiles("LiminalMarket", "LiminalMarket_V2");
        await removeGeneratedFiles("MarketCalendar", "MarketCalendar_V2");


        await hre.run('compile', '--force');
    })

    it("Deployment contract", async () => {
        let deployment = new Deployment(hre);
        let [, status] = await deployment.deployOrUpgradeContract("KYC", "");
        expect(status).to.be.equal(Deployment.Deployed);
    })

    it("KYC - Deploy and update contract", async () => {

        let contractName = "KYC";
        let newContractName = contractName + "_V2";

        let deployment = new Deployment(hre);
        let [contract, status] = await deployment.deployOrUpgradeContract(contractName, "");
        expect(status).to.be.equal(Deployment.Deployed);
        let implementationAddress = await getImplementationAddress(hre.ethers.provider, contract.address);
        expect(implementationAddress).not.to.be.equal(contract.address);

        //set some data to contract
        const brokerAccountId: string = "aee548b2-b250-449c-8d0b-937b0b87ccef";
        const userAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

        await (contract as KYC).validateAccount(brokerAccountId, userAddress);

        await copyContractCodeFakeV2(contractName, newContractName);
        await hre.run('compile');

        let [contractV2, statusV2] = await deployment.deployOrUpgradeContract(contractName, contract.address);
        expect(statusV2).to.be.equal(Deployment.Upgraded);
        expect(contractV2.address).to.be.equal(contract.address);

        let implementationAddressV2 = await getImplementationAddress(hre.ethers.provider, contractV2.address);
        expect(implementationAddressV2).not.to.be.equal(contract.address);

        let isValid = await (contractV2 as KYC).isValid(userAddress);
        expect(isValid).to.be.equal(brokerAccountId);

    });

    it("aUSD - Deploy and update contract", async () => {

        let contractName = "aUSD";
        let newContractName = contractName + "_V2";

        let deployment = new Deployment(hre);
        let [contract, status] = await deployment.deployOrUpgradeContract(contractName, "");
        expect(status).to.be.equal(Deployment.Deployed);
        let implementationAddress = await getImplementationAddress(hre.ethers.provider, contract.address);
        expect(implementationAddress).not.to.be.equal(contract.address);

        //set some data to contract
        const amount = 1000;
        const userAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

        await (contract as AUSD).setBalance(userAddress, amount);

        await copyContractCodeFakeV2(contractName, newContractName);
        await hre.run('compile');

        let [contractV2, statusV2] = await deployment.deployOrUpgradeContract(contractName, contract.address);
        expect(statusV2).to.be.equal(Deployment.Upgraded);
        expect(contractV2.address).to.be.equal(contract.address);

        let implementationAddressV2 = await getImplementationAddress(hre.ethers.provider, contractV2.address);
        expect(implementationAddressV2).not.to.be.equal(contract.address);
        expect(implementationAddressV2).not.to.be.equal(implementationAddress);

        let balance = await (contractV2 as AUSD).balanceOf(userAddress);
        expect(balance).to.be.equal(amount);


    });
    it("LiminalMarket - Deploy and update contract", async () => {

        let contractName = "LiminalMarket";
        let newContractName = contractName + "_V2";

        let deployment = new Deployment(hre);
        let [contract, status] = await deployment.deployOrUpgradeContract(contractName, "");
        expect(status).to.be.equal(Deployment.Deployed);
        let implementationAddress = await getImplementationAddress(hre.ethers.provider, contract.address);
        expect(implementationAddress).not.to.be.equal(contract.address);

        //set some data to contract
        const userAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
        await (contract as LiminalMarket).grantMintAndBurnRole(userAddress);

        await copyContractCodeFakeV2(contractName, newContractName);
        await hre.run('compile');

        let [contractV2, statusV2] = await deployment.deployOrUpgradeContract(contractName, contract.address);
        expect(statusV2).to.be.equal(Deployment.Upgraded);
        expect(contractV2.address).to.be.equal(contract.address);

        let implementationAddressV2 = await getImplementationAddress(hre.ethers.provider, contractV2.address);
        expect(implementationAddressV2).not.to.be.equal(contract.address);
        expect(implementationAddressV2).not.to.be.equal(implementationAddress);

        let hasRole = await (contractV2 as LiminalMarket).hasRole(await (contractV2 as LiminalMarket).MINTER_ROLE(), userAddress);
        expect(hasRole).to.be.true;

    });

    it("MarketCalendar - Deploy and update contract", async () => {

        let contractName = "MarketCalendar";
        let newContractName = contractName + "_V2";

        let deployment = new Deployment(hre);
        let [contract, status] = await deployment.deployOrUpgradeContract(contractName, "");
        expect(status).to.be.equal(Deployment.Deployed);
        let implementationAddress = await getImplementationAddress(hre.ethers.provider, contract.address);
        expect(implementationAddress).not.to.be.equal(contract.address);

        //set some data to contract
        const userAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
        await (contract as MarketCalendar).grantCalendarRole(userAddress);

        await copyContractCodeFakeV2(contractName, newContractName);
        await hre.run('compile');

        let [contractV2, statusV2] = await deployment.deployOrUpgradeContract(contractName, contract.address);
        expect(statusV2).to.be.equal(Deployment.Upgraded);
        expect(contractV2.address).to.be.equal(contract.address);

        let implementationAddressV2 = await getImplementationAddress(hre.ethers.provider, contractV2.address);
        expect(implementationAddressV2).not.to.be.equal(contract.address);
        expect(implementationAddressV2).not.to.be.equal(implementationAddress);

        let hasRole = await (contractV2 as MarketCalendar).hasRole(await (contractV2 as MarketCalendar).SET_CALENDAR_ROLE(), userAddress);
        expect(hasRole).to.be.true;

    });

    it("Check if contract exists on chain, first deploy then check, should be on chain", async () => {

        let deployment = new Deployment(hre);
        let [contract,] = await deployment.deployOrUpgradeContract("KYC", "");

        let result = await deployment.contractExistsOnChain("KYC", contract.address);
        expect(result).to.be.true;
    });

    it("Check if contract exists on chain, it should not be on chain", async () => {
        let contractInfo = ContractInfo.getContractInfo(hre.network.name);

        let deployment = new Deployment(hre);
        let result = await deployment.contractExistsOnChain("aUSD", contractInfo.LIMINAL_MARKET_ADDRESS);
        expect(result).to.be.false;
    });

    it("NOT Implemented - should set addresses on contracts", async () => {
        /*
        let aUsdContract = await smock.fake<AUSD>('aUSD');
        let liminalMarketContract = await smock.fake<LiminalMarket>('LiminalMarket');
        let contractInfo = ContractInfo.getContractInfo(hre.network.name);

        liminalMarketContract.setAddresses.returns();

        aUsdContract = aUsdContract.connect(liminalMarketContract.wallet);
        aUsdContract.setBalance.returns();

        let deployment = new Deployment(hre);
        await deployment.setAddresses(contractInfo, liminalMarketContract, aUsdContract);

        expect(liminalMarketContract.setAddresses).to.been.calledWith(contractInfo.AUSD_ADDRESS, contractInfo.KYC_ADDRESS, contractInfo.MARKET_CALENDAR_ADDRESS);
        expect(aUsdContract.setBalance).to.been.calledWith(contractInfo.LIMINAL_MARKET_ADDRESS);
*/
    })
    const tempFunction = 'function ble() public pure returns(bool) {return true;}';

    const copyContractCodeFakeV2 = async function (contractName: string, newContractName: string) {
        await fs.readFile('./contracts/' + contractName + '.sol', 'utf-8',
            function (err, contents) {
                if (err) {
                    console.log(err);
                    return;
                }
                let idx = contents.lastIndexOf("}");
                let replaced = contents.substring(0, idx);
                replaced += tempFunction + '}';
                //const replaced = contents.replace('contract ' + contractName, 'contract ' + newContractName);

                fs.writeFile('./contracts/' + contractName + '.sol', replaced, 'utf-8', function (err) {
                    console.log(err);
                });
            });
    }

    const removeGeneratedFiles = async function (contractName : string, newContractName: string) {
        await fs.readFile('./contracts/' + contractName + '.sol', 'utf-8',
            function (err, contents) {
                if (err) {
                    console.log(err);
                    return;
                }

                //const replaced = contents.replace('contract ' + newContractName, 'contract ' + contractName);
                let replaced = contents.replace(tempFunction, '');
                fs.writeFile('./contracts/' + contractName + '.sol', replaced, 'utf-8', function (err) {
                    console.log(err);
                });
            });

    }
})