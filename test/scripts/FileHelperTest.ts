import mock from 'mock-fs'
import FileHelper from "../../scripts/FileHelper";
import chai from "chai";
import hre from "hardhat";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import ContractInfo from "../../scripts/addresses/ContractInfo";
import * as fs from "fs";

describe("Test FileHelper", () => {
    const expect = chai.expect;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);


    it("test write contract files", async () => {

        mock({
            './scripts/templates/': {
                'ContractAddress.web.handlebars': '',
                'ContractAddress.contracts.handlebars': ''
            },
            '../liminal.market.web/src/contracts/': {
                'localhost-contract-addresses.ts' : ''
            },
            './scripts/addresses/' : {},
            './artifacts/contracts/LiminalMarket.sol/' : {
                'LiminalMarket.json' : ''
            },
            './artifacts/contracts/aUSD.sol/' : {
                'aUSD.json' : ''
            },
            './artifacts/contracts/KYC.sol/' : {
                'KYC.json' : ''
            },
            './artifacts/contracts/SecurityToken.sol/' : {
                'SecurityToken.json' : ''
            },
            './artifacts/contracts/MarketCalendar.sol/' : {
                'MarketCalendar.json' : ''
            },
            '../liminal.market.web/app/abi/' : {}
        });

        let contractInfo = ContractInfo.getContractInfo(hre.network.name);
        let fileHelper = new FileHelper(hre);
        await fileHelper.writeContractAddressesToJs(contractInfo)
expect(fs.copyFile).to.be.called;
        mock.restore();
    });

    it('should verify web constant file is valid', async () => {

        let contractInfo = ContractInfo.getContractInfo(hre.network.name);
        let fileHelper = new FileHelper(hre);
        let content = fileHelper.getConstantFile("web", contractInfo);

        expect(content).to.contain(contractInfo.LIMINAL_MARKET_ADDRESS);
        expect(content).to.contain(contractInfo.AUSD_ADDRESS);
        expect(content).to.contain(contractInfo.KYC_ADDRESS);
        expect(content).to.contain(contractInfo.MARKET_CALENDAR_ADDRESS);
        expect(content).to.contain(contractInfo.NetworkName);
        expect(content).not.to.contain('getRelayerAddress');
    });

    it('should verify contract constant file is valid', async () => {

        let contractInfo = ContractInfo.getContractInfo(hre.network.name);
        let fileHelper = new FileHelper(hre);
        let content = fileHelper.getConstantFile("contracts", contractInfo);

        expect(content).to.contain(contractInfo.LIMINAL_MARKET_ADDRESS);
        expect(content).to.contain(contractInfo.AUSD_ADDRESS);
        expect(content).to.contain(contractInfo.KYC_ADDRESS);
        expect(content).to.contain(contractInfo.MARKET_CALENDAR_ADDRESS);
        expect(content).to.contain(contractInfo.NetworkName);
        expect(content).to.contain('getRelayerAddress');
    });

})