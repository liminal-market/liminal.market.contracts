
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { solidity } from "ethereum-waffle";
import {upgrades} from "hardhat";
import {KYC} from "../../typechain-types";

describe("KYC", function () {
  const hre = require('hardhat');
  const expect = chai.expect;
  const [owner, wallet2] = hre.waffle.provider.getWallets();

  chai.use(chaiAsPromised);
  chai.use(solidity);
  let contract: KYC;
  const brokerAccountId: string = "aee548b2-b250-449c-8d0b-937b0b87ccef";
  const userAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  const AddressZero = "0x0000000000000000000000000000000000000000";

  before("compile", async function () {
    await hre.run('compile');
    await redeployContract();
  })

  const redeployContract = async function () {
    const contractFactory = await hre.ethers.getContractFactory('KYC');
    contract = await upgrades.deployProxy(contractFactory) as KYC;
  }


  it("validateAccount with valid account id", async function () {
    console.log(wallet2.address);
    await expect(contract.validateAccount(brokerAccountId, wallet2.address))
      .to.emit(contract, "AccountValidated")
      .withArgs(brokerAccountId);

  });
  it("validateAccount with invalid account id", async function () {
    let reason = await contract.INVALID_ACCOUNT_ID();
    await expect(contract.validateAccount("abc", wallet2.address)).to.be.rejectedWith(reason);
  });

  it("should return account Id by address", async function () {
    //    await redeployContract();

    let tx = await contract.validateAccount(brokerAccountId, wallet2.address);
    await tx.wait();

    let storeAccountId = await contract.getAccountId(wallet2.address);

    expect(storeAccountId).to.be.equal(brokerAccountId);
  });

  it("should grant role", async () => {
    await redeployContract();

    expect(await contract.grantRoleForKyc(wallet2.address))
        .to.emit(contract, "RoleGranted")
        .withArgs(contract.SET_KYC, wallet2.address, owner.address);

    let contractW2 = contract.connect(wallet2);

    expect(await contractW2.validateAccount(brokerAccountId, userAddress))
        .to.emit(contractW2, "AccountValidated");

    let accountId = await contract.getAccountId(userAddress);
    expect(accountId).to.be.equal(brokerAccountId);
  })

  it("should grant role, then revoke it, should revert when trying to validate account", async () => {
    await redeployContract();

    expect(await contract.grantRoleForKyc(wallet2.address))
        .to.emit(contract, "RoleGranted");

    let contractW2 = contract.connect(wallet2);

    expect(await contract.revokeRoleForKyc(wallet2.address))
        .to.emit(contract, "RoleRevoked");

    await expect(contractW2.validateAccount(brokerAccountId, userAddress))
        .to.reverted;
  })

  it("should invalidate account", async () => {
    await redeployContract();

    await contract.validateAccount(brokerAccountId, userAddress);
    let accountId = await contract.getAccountId(userAddress);
    expect(accountId).to.be.equal(brokerAccountId);

    expect(await contract.invalidateAccount(userAddress))
        .to.emit(contract, "AccountInvalidated")
        .withArgs(userAddress);

    let reason = await contract.ADDRESS_NOT_VALID();
    await expect(contract.getAccountId(userAddress))
        .to.be.revertedWith(reason);
  })

  it("try to validate with zero address, should revert", async () => {
    await redeployContract();

    await expect(contract.validateAccount(brokerAccountId, AddressZero))
        .to.be.revertedWith("Address cannot be zero");
  });

  it("isValid account for hardhat wallet, should always be valid", async () => {
    await redeployContract();
    let address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    let brokerId = "aee548b2-b250-449c-8d0b-937b0b87ccef";

    await expect(await contract.isValid(address)).to.be.equal(brokerId);
  })
  it("isValid account, should be valid", async () => {
    await redeployContract();

    await contract.validateAccount(brokerAccountId, userAddress);
    await expect(await contract.isValid(userAddress)).to.be.equal(brokerAccountId);
  })

  it("isValid check, accountId is not valid, should revert", async () => {
    await expect(contract.validateAccount("abc", userAddress))
        .to.revertedWith(await contract.INVALID_ACCOUNT_ID());
  })

  it("isValid check, userAddress is not valid, should revert", async () => {
    await expect(contract.validateAccount(brokerAccountId, AddressZero))
        .to.revertedWith("Address cannot be zero");
  })

  it("check is address has valid kyc, should be invalid, revert", async () => {
    await redeployContract();

    let reason = await contract.ADDRESS_NOT_VALID();
    await expect(contract.isValid("0x90F79bf6EB2c4f870365E785982E1f101E93b906"))
        .to.be.revertedWith(reason)
  })

});