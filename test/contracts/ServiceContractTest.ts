import chai from "chai";
import hre, {upgrades} from "hardhat";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import {smock} from "@defi-wonderland/smock";
import {ethers, Wallet} from "ethers";
import {AUSD, KYC, LiminalMarket, LM, MarketCalendar, ServiceContract} from "../../typechain-types";
import TestHelper from "../TestHelper";


describe('ServiceContract tests', () => {

    const expect = chai.expect;
    const hre = require("hardhat");
    const waffle = hre.waffle;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);

    let owner: Wallet, wallet2: Wallet, wallet3: Wallet;
    let ownerContract: ServiceContract;
    let contract: ServiceContract;

    let serviceAddress = '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec';
    let serviceFeeAddress = '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097'
    let name = 'DeFi service';
    let url = 'https://defi.com';

    before("before running each test", async () => {
        await hre.run('compile');

        [owner, wallet2, wallet3] = waffle.provider.getWallets();
    })

    beforeEach(async () => {
        await redeployContracts()
    })

    const redeployContracts = async () => {
        const contractFactory = await hre.ethers.getContractFactory('ServiceContract');
        ownerContract = await upgrades.deployProxy(contractFactory) as ServiceContract;

        await ownerContract.setLMServiceFeeAddress(TestHelper.LMServiceFeeAddress);

        //since owner will not normally interact with contract,
        // we switch to wallet2 to simplify testing
        contract = ownerContract.connect(wallet2);
    }
    it('should call initialize, should be rejected', async () => {
        await TestHelper.initializeRejected(ownerContract);
    })

    it('should update liminal LiminalMarket contract address', async () => {
        let newAddress = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
        let result = await ownerContract.setAddress(newAddress);

        expect(result).to.emit(ownerContract, 'LiminalMarketAddressSet').withArgs(newAddress);
    })
    it('try to update LiminalMarket address, doesnt have role, should be rejected', async () => {
        let newAddress = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
        await expect(contract.setAddress(newAddress)).rejectedWith(TestHelper.AccessControlErrorMessage)
    })
    it('should update liminal serviceFee address', async () => {
        let newAddress = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
        let result = await ownerContract.setLMServiceFeeAddress(newAddress);

        expect(result).to.emit(ownerContract, 'LMServiceFeeAddressSet').withArgs(newAddress);
    })
    it('try to update liminal serviceFee address, doesnt have role, should be rejected', async () => {
        let newAddress = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
        await expect(contract.setLMServiceFeeAddress(newAddress)).rejectedWith(TestHelper.AccessControlErrorMessage)
    })

    it('check default serviceFee, then update liminal serviceFee to 500 points', async () => {
        let points = 500;

        let serviceFee = await contract.getLMServiceFee(300000)
        let result = await ownerContract.setLMServiceFee(points);
        let newServiceFee = await contract.getLMServiceFee(300000)

        expect(serviceFee).to.be.eq(600);
        expect(newServiceFee).to.be.eq(1500);
        expect(result).to.emit(ownerContract, 'LMServiceFeePointsSet').withArgs(points);
    })

    it('tries to change LM service fee, doesnt have role, should be rejected', async () => {
        await expect(contract.setLMServiceFee(123)).rejectedWith(TestHelper.AccessControlErrorMessage);
    })

    it('tries to create contract, spenderAddress is Zero address, should create new smart contract', async () => {

        let result = await contract.createContract(TestHelper.AddressZero, serviceFeeAddress, 100, name, url);
        let receipt = await result.wait();

        expect(result).to.emit(contract, 'ServiceContractCreated')
            .withArgs(wallet2.address, receipt.events![0].args!.contractAddress, serviceFeeAddress, 100, name, url);
    })



    it('tries to create contract, serviceFeeAddress is Zero address, should be rejected', async () => {
        await expect(contract.createContract(wallet3.address, TestHelper.AddressZero, 100, name, url))
            .rejectedWith(await contract.ADDRESS_CANNOT_BE_ZERO())
    })
    it('should create a contract with a defi service', async () => {
        await createServiceContract();

        let serviceFee = await contract.getServiceFee(300000, serviceAddress);
        expect(serviceFee).eq(300);
    })

    it('should create a contract with a defi service, then try to create another contract with same service address, should be rejected', async () => {
        await createServiceContract();
        await expect(contract.createContract(serviceAddress, serviceFeeAddress, 10, name, url)).rejectedWith('This contract already exists. Use updateContract')
    })

    it('should update contract, get serviceFee with new serviceFee points', async () => {
        await createServiceContract();
        let name = 'NewName';
        let url = 'https://newdefi.com';
        let result = await contract.updateContract(serviceAddress, serviceFeeAddress, 500, name, url);

        expect(result).to.emit(contract, 'ServiceContractUpdated')
            .withArgs(wallet2.address, serviceAddress, serviceFeeAddress, 500, name, url);

        let serviceFee = await contract.getServiceFee(300000, serviceAddress);
        expect(serviceFee).eq(1500);
    })

    it('should try to update contract, contract does not exists, should be rejected', async () => {
        let name = 'NewName';
        let url = 'https://newdefi.com';
        await expect(contract.updateContract(serviceAddress, serviceFeeAddress, 500, name, url)).rejectedWith('This address does not have service agreement');
    })



    it('should try to update contract, wallet is not the one that created the contract, should be rejected', async () => {
        await createServiceContract();
        let name = 'NewName';
        let url = 'https://newdefi.com';
        await expect(ownerContract.updateContract(serviceAddress, serviceFeeAddress, 500, name, url)).rejectedWith('Only owner can change contract');

    })

    it('should validate total serviceFee for an amount', async () => {
        await createServiceContract();

        let totalServiceFee = await contract.getTotalServiceFee(300000, serviceAddress);
        expect(totalServiceFee).eq(900)
    })

    it("Pause contract, try to execute on it, should be rejected", async () => {
        await ownerContract.pause();
        await expect(createServiceContract()).rejectedWith('paused');
    });

    it("Pause contract, try to execute on it, then unpause and execute", async () => {
        await ownerContract.pause();
        await expect(createServiceContract()).rejectedWith('paused');
        await ownerContract.unpause();
        await createServiceContract();
    });
    it("Pause contract, try to update contract, then unpause and execute", async () => {

        await createServiceContract();
        await ownerContract.pause();
        await expect(contract.updateContract(wallet3.address, wallet2.address, 10, "", ""))
            .rejectedWith(TestHelper.PausedErrorMessage);
    });
    it("try to pause contract but not owner, should be rejected", async () => {
        await TestHelper.pauseContractReject(contract)
    });

    it("try to unpause contract but not owner, should be rejected", async () => {
        await TestHelper.unPauseContractReject(contract)
    });


    async function createServiceContract() {
        let result = await contract.createContract(serviceAddress, serviceFeeAddress, 100, name, url)

        expect(result).to.emit(contract, 'ServiceContractCreated')
            .withArgs(wallet2.address, serviceAddress, serviceFeeAddress, 100, name, url);
    }
})

