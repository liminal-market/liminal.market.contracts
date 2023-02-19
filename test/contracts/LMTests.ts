import chai from "chai";
import {upgrades} from "hardhat";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import {smock} from "@defi-wonderland/smock";
import {Wallet} from "ethers";
import {LM, ServiceContract} from "../../typechain-types";
import TestHelper from "../TestHelper";


describe('LM tests', () => {

    const expect = chai.expect;
    const hre = require("hardhat");
    const waffle = hre.waffle;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);

    let owner: Wallet, wallet2: Wallet, wallet3: Wallet, wallet4: Wallet;
    let ownerContract: LM;
    let contract: LM;
    let serviceContract: ServiceContract;

    before("before running each test", async () => {
        await hre.run('compile');

        [owner, wallet2, wallet3, wallet4] = waffle.provider.getWallets();
    })

    beforeEach(async () => {
        await redeployContracts()
    })

    const redeployContracts = async () => {
        const lmFactory = await hre.ethers.getContractFactory('LM');
        ownerContract = await upgrades.deployProxy(lmFactory) as LM;

        const serviceContractFactory = await hre.ethers.getContractFactory('ServiceContract');
        serviceContract = await upgrades.deployProxy(serviceContractFactory) as ServiceContract;
        await serviceContract.setLMServiceFeeAddress(TestHelper.LMServiceFeeAddress);
        await serviceContract.createContract(wallet3.address, wallet4.address, 100, "DeFi Service", "https://defi.com")

        await ownerContract.setServiceContractAddress(serviceContract.address);
        await ownerContract.grantServiceFeeRole(wallet2.address);

        //since owner will not normally interact with contract,
        // we switch to wallet2 to simplify testing
        contract = ownerContract.connect(wallet2);
    }
    it('should call initialize, should be rejected', async () => {
        await TestHelper.initializeRejected(ownerContract);
    })

    it('should test grantServiceFeeRole', async () => {
        let result = await ownerContract.grantServiceFeeRole(wallet3.address);
        expect(result).emit(ownerContract, 'RoleGranted').withArgs(await ownerContract.SERVICE_FEE_ROLE(), wallet3.address, owner.address)
    })

    it('should test revokeServiceFeeRole', async () => {
        let result = await ownerContract.grantServiceFeeRole(wallet3.address);
        expect(result).emit(ownerContract, 'RoleGranted').withArgs(await ownerContract.SERVICE_FEE_ROLE(), wallet3.address, owner.address);

        let result2 = await ownerContract.revokeServiceFeeRole(wallet3.address);
        expect(result2).emit(ownerContract, 'RoleRevoked').withArgs(await ownerContract.SERVICE_FEE_ROLE(), wallet3.address, owner.address);
    })

    it('should try to revokeServiceFeeRole, but does not have access, should be rejected', async () => {
        await expect(contract.revokeServiceFeeRole(wallet3.address)).rejectedWith(TestHelper.AccessControlErrorMessage)
    })

    it('should test grantServiceFeeRole but not with access, should revert', async () => {
        await expect(contract.grantServiceFeeRole(wallet3.address)).rejectedWith(TestHelper.AccessControlErrorMessage)
    })
    it('should test revokeServiceFeeRole but not with access, should revert', async () => {
        await expect(contract.grantServiceFeeRole(wallet3.address)).rejectedWith(TestHelper.AccessControlErrorMessage)
    })

    it('should mint tokens', async () => {
        await ownerContract.mint(wallet2.address, 1000);
        let balance = await contract.balanceOf(wallet2.address);
        expect(balance).eq(1000);
    })

    it('should mint tokens but doesnt have access, should reject', async () => {
        await expect(contract.mint(wallet2.address, 1000)).rejectedWith(TestHelper.AccessControlErrorMessage);
    })

    it('should test setting service contract address', async () => {
        let result = ownerContract.setServiceContractAddress(wallet3.address);
        expect(result).emit(ownerContract, 'ServiceContractAddressSet').withArgs(wallet3.address)
    })
    it('should test setting service contract address, no access, should be rejected', async () => {
        await expect(contract.setServiceContractAddress(wallet3.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
    })

    it('should validate balance of wallet', async () => {
        await ownerContract.mint(wallet2.address, 1000 * 10 ** 5);
        await contract.validateBalance(wallet2.address, 15 * 10 ** 5, wallet3.address)
    })
    it('should validate balance of wallet, has exact amount for service fee', async () => {
        await ownerContract.mint(wallet2.address, 4500);
        await contract.validateBalance(wallet2.address, 15 * 10 ** 5, wallet3.address);
    })

    it('should validate balance of wallet, not enough amount, should be rejected', async () => {
        await ownerContract.mint(wallet2.address, 1);
        await expect(contract.validateBalance(wallet2.address, 15 * 10 ** 8, wallet3.address)).rejectedWith(await contract.NOT_ENOUGH_FOR_SERVICE_FEE())
    })

    it('should validate balance and pay outstanding service fee', async () => {
        let firstAmount = 15 * 10 ** 5;
        let secondAmount = 10 * 10 ** 5;

        let lmServiceFee = await serviceContract.getLMServiceFee(firstAmount);
        let lmServiceFeeAddress = await serviceContract.getLMServiceFeeAddress();
        let serviceServiceFee = await serviceContract.getServiceFee(firstAmount, wallet3.address);
        let serviceServiceFeeAddress = await serviceContract.getServiceFeeAddress(wallet3.address);

        let shouldPayTotalServiceFee = await contract.callStatic.payServiceFee(wallet2.address, firstAmount, wallet3.address);
        let result2 = await contract.payServiceFee(wallet2.address, firstAmount, wallet3.address);

        expect(result2).emit(contract, 'ServiceFeePaidFailed').withArgs(wallet2.address, lmServiceFeeAddress, lmServiceFee, serviceServiceFeeAddress, serviceServiceFee)
        expect(shouldPayTotalServiceFee).eq(lmServiceFee.add(serviceServiceFee))

        await ownerContract.mint(wallet2.address, 20 * 10 ** 5);
        let result = await contract.payOutstandingServiceFeeAndValidateBalance(wallet2.address, secondAmount, wallet3.address);

        expect(result).emit(contract, 'ServiceFeePaid').withArgs(wallet2.address, lmServiceFeeAddress, lmServiceFee, serviceServiceFeeAddress, serviceServiceFee);
    })

    it('should validate balance and pay outstanding service fee, liminal has 0 service fee', async () => {
        let firstAmount = 15 * 10 ** 5;
        let secondAmount = 10 * 10 ** 5;

        await serviceContract.setLMServiceFee(0);
        let lmServiceFee = await serviceContract.getLMServiceFee(firstAmount);
        expect(lmServiceFee).eq(0);

        let lmServiceFeeAddress = await serviceContract.getLMServiceFeeAddress();
        let serviceServiceFee = await serviceContract.getServiceFee(firstAmount, wallet3.address);
        let serviceServiceFeeAddress = await serviceContract.getServiceFeeAddress(wallet3.address);

        let shouldPayTotalServiceFee = await contract.callStatic.payServiceFee(wallet2.address, firstAmount, wallet3.address);
        let result2 = await contract.payServiceFee(wallet2.address, firstAmount, wallet3.address);

        expect(result2).emit(contract, 'ServiceFeePaidFailed').withArgs(wallet2.address, lmServiceFeeAddress, lmServiceFee, serviceServiceFeeAddress, serviceServiceFee)
        expect(shouldPayTotalServiceFee).eq(lmServiceFee.add(serviceServiceFee))

        await ownerContract.mint(wallet2.address, 20 * 10 ** 5);
        let result = await contract.payOutstandingServiceFeeAndValidateBalance(wallet2.address, secondAmount, wallet3.address);

        expect(result).emit(contract, 'ServiceFeePaid').withArgs(wallet2.address, lmServiceFeeAddress, lmServiceFee, serviceServiceFeeAddress, serviceServiceFee);
    })

    it('should validate balance and pay outstanding service fee, wallet does not have enough balance, should be rejected', async () => {
        let firstAmount = 15 * 10 ** 5;
        let secondAmount = 10 * 10 ** 5;

        let lmServiceFee = await serviceContract.getLMServiceFee(firstAmount);
        let lmServiceFeeAddress = await serviceContract.getLMServiceFeeAddress();
        let serviceServiceFee = await serviceContract.getServiceFee(firstAmount, wallet3.address);
        let serviceServiceFeeAddress = await serviceContract.getServiceFeeAddress(wallet3.address);

        let shouldPayTotalServiceFee = await contract.callStatic.payServiceFee(wallet2.address, firstAmount, wallet3.address);
        let result2 = await contract.payServiceFee(wallet2.address, firstAmount, wallet3.address);

        expect(result2).emit(contract, 'ServiceFeePaidFailed').withArgs(wallet2.address, lmServiceFeeAddress, lmServiceFee, serviceServiceFeeAddress, serviceServiceFee)
        expect(shouldPayTotalServiceFee).eq(lmServiceFee.add(serviceServiceFee))

        await ownerContract.mint(wallet2.address, 20);
        await expect(contract.payOutstandingServiceFeeAndValidateBalance(wallet2.address, secondAmount, wallet3.address))
            .rejectedWith(await contract.NOT_ENOUGH_FOR_PREV_SERVICE_FEE());
    })

    it('should try to pay service fee, spender does not have contract, should be rejected', async () => {
        let firstAmount = 15 * 10 ** 5;

        await expect(contract.payServiceFee(wallet2.address, firstAmount, wallet4.address))
            .rejectedWith(await contract.SPENDER_MISSING_SERVICE_FEE_ADDRESS())
    })
    it('should try to pay service outstanding fee, spender does not have contract, should be rejected', async () => {
        let firstAmount = 15 * 10 ** 5;

        await expect(contract.payOutstandingServiceFeeAndValidateBalance(wallet2.address, firstAmount, wallet4.address))
            .rejectedWith(await contract.SPENDER_MISSING_SERVICE_FEE_ADDRESS())
    })
    it('should have enough for prev service fee, but not current service fee, should be rejected', async () => {
        let firstAmount = 15 * 10 ** 5;
        let secondAmount = 10 * 10 ** 8;

        let lmServiceFee = await serviceContract.getLMServiceFee(firstAmount);
        let lmServiceFeeAddress = await serviceContract.getLMServiceFeeAddress();
        let serviceServiceFee = await serviceContract.getServiceFee(firstAmount, wallet3.address);
        let serviceServiceFeeAddress = await serviceContract.getServiceFeeAddress(wallet3.address);

        let shouldPayTotalServiceFee = await contract.callStatic.payServiceFee(wallet2.address, firstAmount, wallet3.address);
        let result2 = await contract.payServiceFee(wallet2.address, firstAmount, wallet3.address);

        expect(result2).emit(contract, 'ServiceFeePaidFailed').withArgs(wallet2.address, lmServiceFeeAddress, lmServiceFee, serviceServiceFeeAddress, serviceServiceFee)
        expect(shouldPayTotalServiceFee).eq(lmServiceFee.add(serviceServiceFee))

        await ownerContract.mint(wallet2.address, 30000);
        await expect(contract.payOutstandingServiceFeeAndValidateBalance(wallet2.address, secondAmount, wallet3.address))
            .rejectedWith(await contract.NOT_ENOUGH_FOR_SERVICE_FEE());
    })

    it('should pay for previous service fee, unpaid service fee should be 0 on next call', async () => {
        let firstAmount = 15 * 10 ** 5;
        let secondAmount = 10 * 10 ** 5;
        let thirdAmount = 23 * 10 ** 5;

        let lmServiceFee = await serviceContract.getLMServiceFee(firstAmount);
        let lmServiceFeeAddress = await serviceContract.getLMServiceFeeAddress();
        let serviceServiceFee = await serviceContract.getServiceFee(firstAmount, wallet3.address);
        let serviceServiceFeeAddress = await serviceContract.getServiceFeeAddress(wallet3.address);

        let shouldPayTotalServiceFee = await contract.callStatic.payServiceFee(wallet2.address, firstAmount, wallet3.address);
        let result2 = await contract.payServiceFee(wallet2.address, firstAmount, wallet3.address);

        expect(result2).emit(contract, 'ServiceFeePaidFailed').withArgs(wallet2.address, lmServiceFeeAddress, lmServiceFee, serviceServiceFeeAddress, serviceServiceFee)
        expect(shouldPayTotalServiceFee).eq(lmServiceFee.add(serviceServiceFee))

        await ownerContract.mint(wallet2.address, 20 * 10 ** 5);
        let result = await contract.payOutstandingServiceFeeAndValidateBalance(wallet2.address, secondAmount, wallet3.address);

        expect(result).emit(contract, 'ServiceFeePaid').withArgs(wallet2.address, lmServiceFeeAddress, lmServiceFee, serviceServiceFeeAddress, serviceServiceFee);

        let result3 = await contract.payOutstandingServiceFeeAndValidateBalance(wallet2.address, thirdAmount, wallet3.address);
        expect(result3).not.emit(contract, 'ServiceFeePaid');

    })

    it('should pay service fee', async () => {

        let amount = 15 * 10 ** 5;
        let lmServiceFee = await serviceContract.getLMServiceFee(amount);
        let lmServiceFeeAddress = await serviceContract.getLMServiceFeeAddress();
        let serviceServiceFee = await serviceContract.getServiceFee(amount, wallet3.address);
        let serviceServiceFeeAddress = await serviceContract.getServiceFeeAddress(wallet3.address);

        await ownerContract.mint(wallet2.address, 20 * 10 ** 5);
        let shouldPayTotalServiceFee = await contract.callStatic.payServiceFee(wallet2.address, amount, wallet3.address);
        let result2 = await contract.payServiceFee(wallet2.address, amount, wallet3.address);

        expect(result2).emit(contract, 'ServiceFeePaid').withArgs(wallet2.address, lmServiceFeeAddress, lmServiceFee, serviceServiceFeeAddress, serviceServiceFee)
        expect(shouldPayTotalServiceFee).eq(lmServiceFee.add(serviceServiceFee))

    })

    it('should pay service fee, both services fees are 0', async () => {

        let amount = 15 * 10 ** 5;
        await serviceContract.setLMServiceFee(0);
        await serviceContract.updateContract(wallet3.address, wallet2.address, 0, '', '');

        let lmServiceFee = await serviceContract.getLMServiceFee(amount);
        let lmServiceFeeAddress = await serviceContract.getLMServiceFeeAddress();
        let serviceServiceFee = await serviceContract.getServiceFee(amount, wallet3.address);
        let serviceServiceFeeAddress = await serviceContract.getServiceFeeAddress(wallet3.address);

        await ownerContract.mint(wallet2.address, 20 * 10 ** 5);
        let shouldPayTotalServiceFee = await contract.callStatic.payServiceFee(wallet2.address, amount, wallet3.address);
        let result2 = await contract.payServiceFee(wallet2.address, amount, wallet3.address);

        expect(result2).emit(contract, 'ServiceFeePaid').withArgs(wallet2.address, lmServiceFeeAddress, lmServiceFee, serviceServiceFeeAddress, serviceServiceFee)
        expect(shouldPayTotalServiceFee).eq(lmServiceFee.add(serviceServiceFee))

    })

    it('should pay service fee, serviceServiceFee is 0 and lmServiceFee is 0', async () => {

        let amount = 15 * 10 ** 5;
        let lmServiceFee = await serviceContract.getLMServiceFee(amount);
        let lmServiceFeeAddress = await serviceContract.getLMServiceFeeAddress();
        let serviceServiceFee = await serviceContract.getServiceFee(amount, wallet3.address);
        let serviceServiceFeeAddress = await serviceContract.getServiceFeeAddress(wallet3.address);

        await ownerContract.mint(wallet2.address, 20 * 10 ** 5);
        let shouldPayTotalServiceFee = await contract.callStatic.payServiceFee(wallet2.address, amount, wallet3.address);
        let result2 = await contract.payServiceFee(wallet2.address, amount, wallet3.address);

        expect(result2).emit(contract, 'ServiceFeePaid').withArgs(wallet2.address, lmServiceFeeAddress, lmServiceFee, serviceServiceFeeAddress, serviceServiceFee)
        expect(shouldPayTotalServiceFee).eq(lmServiceFee.add(serviceServiceFee))

    })

    it('should try to pay service fee, but is not service fee role, should be rejected', async () => {
        let amount = 1;
        let contract2 = ownerContract.connect(wallet3);
        await expect(contract2.payServiceFee(wallet2.address, amount, wallet3.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
    })
    it('should try to payOutstandingServiceFeeAndValidateBalance, but is not service fee role, should be rejected', async () => {
        let amount = 1;
        let contract2 = ownerContract.connect(wallet3);
        await expect(contract2.payOutstandingServiceFeeAndValidateBalance(wallet2.address, amount, wallet3.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
    })
    it("pause and unpause contract", async () => {
        await TestHelper.pauseContract(ownerContract, owner.address);
        await TestHelper.unPauseContract(ownerContract, owner.address)
    });

    it("try to pause contract but not owner, should be rejected", async () => {
        await TestHelper.pauseContractReject(contract)
    });

    it("try to unpause contract but not owner, should be rejected", async () => {
        await TestHelper.unPauseContractReject(contract)
    });

});