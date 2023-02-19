import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from "ethereum-waffle";
import {upgrades} from "hardhat";
import {KYC} from "../../typechain-types";
import {Wallet} from "ethers";
import TestHelper from "../TestHelper";

describe("KYC", () => {
    const hre = require('hardhat');
    const expect = chai.expect;
    const waffle = hre.waffle;
    chai.use(chaiAsPromised);
    chai.use(solidity);
    let contract: KYC;
    const brokerAccountId: string = "aee548b2-b250-449c-8d0b-937b0b87ccef";
    const userAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
    const AddressZero = "0x0000000000000000000000000000000000000000";
    let owner: Wallet, wallet2: Wallet, wallet3: Wallet;

    before("compile", async () => {
        await hre.run('compile');
        [owner, wallet2, wallet3] = waffle.provider.getWallets();
    })
    
    beforeEach(async () => {
        const contractFactory = await hre.ethers.getContractFactory('KYC');
        contract = await upgrades.deployProxy(contractFactory) as KYC;
    })

    it('should call initialize, should be rejected', async () => {
        await TestHelper.initializeRejected(contract);
    })
    it("validateAccount with valid account id", async () => {
        let validateTx = await contract.validateAccount(brokerAccountId, wallet2.address);
        await expect(validateTx).emit(contract, "AccountValidated").withArgs(brokerAccountId, wallet2.address);

        let accountId = await contract.isValid(wallet2.address);
        expect(accountId).eq(brokerAccountId);
    });
    it("check if address is valid kyc, should fail", async () => {
        let reason = await contract.ADDRESS_NOT_VALID()
        await expect(contract.isValid(wallet2.address)).rejectedWith(reason);
    });

    it('check is valid, address is zero address, should be rejected', async () => {
        let reason = await contract.ADDRESS_CANNOT_BE_ZERO()
        await expect(contract.isValid(AddressZero)).rejectedWith(reason);
    })
    it('getAccountId, address is zero address, should be rejected', async () => {
        let reason = await contract.ADDRESS_CANNOT_BE_ZERO()
        await expect(contract.getAccountId(AddressZero)).rejectedWith(reason);
    })
    it("validateAccount two time same account id", async () => {
        let validateTx = await contract.validateAccount(brokerAccountId, wallet2.address);
        await expect(validateTx).emit(contract, "AccountValidated").withArgs(brokerAccountId, wallet2.address);

        let validateTx2 = await contract.validateAccount(brokerAccountId, wallet2.address);
        await expect(validateTx2).emit(contract, "AccountValidated").withArgs(brokerAccountId, wallet2.address);
    });

    it("validateAccount, should fail, caller doesn't have role", async () => {
        let contract2 = contract.connect(wallet2);
        await expect(contract2.validateAccount(brokerAccountId, wallet2.address)).rejectedWith('missing role')
    });

    it("validateAccount, should fail, user address is zero address", async () => {
        let reason = await contract.ADDRESS_CANNOT_BE_ZERO();
        await expect(contract.validateAccount(brokerAccountId, AddressZero)).rejectedWith(reason)
    });

    it("validateAccount with invalid account id", async () => {
        let reason = await contract.INVALID_ACCOUNT_ID();
        await expect(contract.validateAccount("abc", wallet2.address)).to.be.rejectedWith(reason);
    });

    it("should return account Id by address", async () => {
        let validateTx = await contract.validateAccount(brokerAccountId, wallet2.address);
        expect(validateTx).emit(contract, 'AccountValidated').withArgs(brokerAccountId, wallet2.address);

        let accountId = await contract.getAccountId(wallet2.address);

        expect(accountId).to.be.equal(brokerAccountId);
    });

    it('try grant role, does not have permission, should be rejected', async () => {
        let contract2 = contract.connect(wallet3);
        await expect(contract2.grantRoleForKyc(wallet3.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
    })
    it('try revoke role, does not have permission, should be rejected', async () => {
        let contract2 = contract.connect(wallet3);
        await expect(contract2.revokeRoleForKyc(wallet3.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
    })
    it("should grant role, validate account and get that accountId by user address", async () => {
        let roleTx = await contract.grantRoleForKyc(wallet2.address);
        expect(roleTx)
            .to.emit(contract, "RoleGranted")
            .withArgs(contract.SET_KYC, wallet2.address, owner.address);

        let contractW2 = contract.connect(wallet2);

        let validateTx = await contractW2.validateAccount(brokerAccountId, userAddress);
        expect(validateTx).emit(contractW2, "AccountValidated").withArgs(brokerAccountId, userAddress);

        let accountId = await contract.getAccountId(userAddress);
        expect(accountId).to.be.equal(brokerAccountId);
    })

    it("should grant role, then revoke it, should revert when trying to validate account", async () => {
        let grantTx = await contract.grantRoleForKyc(wallet2.address);
        expect(grantTx).emit(contract, "RoleGranted");

        let contractW2 = contract.connect(wallet2);

        let revokeTx = await contract.revokeRoleForKyc(wallet2.address);

        //emit RoleRevoked(role, account, _msgSender());
        expect(revokeTx).emit(contract, "RoleRevoked").withArgs(contract.SET_KYC, wallet2.address, owner.address);

        await expect(contractW2.validateAccount(brokerAccountId, userAddress)).rejectedWith('missing role');
    })
    it('should try to invalidate account, does not have role, should be rejected', async () => {
        let contract3 = contract.connect(wallet3);
        await expect(contract3.invalidateAccount(wallet3.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
    })

    it("should invalidate account", async () => {
        await contract.validateAccount(brokerAccountId, userAddress);
        let accountId = await contract.getAccountId(userAddress);
        expect(accountId).to.be.equal(brokerAccountId);

        let invalidateTx = await contract.invalidateAccount(userAddress);
        expect(invalidateTx).emit(contract, "AccountInvalidated")
            .withArgs(userAddress);

        let reason = await contract.ADDRESS_NOT_VALID();
        await expect(contract.getAccountId(userAddress)).rejectedWith(reason);
    })

    it("should reject, invalidate account with zero address", async () => {
        await contract.validateAccount(brokerAccountId, userAddress);
        let accountId = await contract.getAccountId(userAddress);
        expect(accountId).to.be.equal(brokerAccountId);

        let reason = await contract.ADDRESS_CANNOT_BE_ZERO()
        await expect(contract.invalidateAccount(AddressZero)).rejectedWith(reason);
    })

    it("should reject, invalidate address that is not stored on chain", async () => {
        await contract.validateAccount(brokerAccountId, userAddress);
        let accountId = await contract.getAccountId(userAddress);
        expect(accountId).to.be.equal(brokerAccountId);

        let reason = await contract.ADDRESS_NOT_VALID()
        await expect(contract.invalidateAccount(wallet2.address)).rejectedWith(reason);
    })
});