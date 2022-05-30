
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { solidity } from "ethereum-waffle";
import hre, {upgrades} from "hardhat";
import {KYC} from "../../typechain-types";

describe("KYC", function () {
  const hre = require('hardhat');
  const expect = chai.expect;
  const waffle = hre.waffle;
  const [owner, wallet2] = hre.waffle.provider.getWallets();

  chai.use(chaiAsPromised);
  chai.use(solidity);
  let contract: KYC;
  const accountId: string = "aee548b2-b250-449c-8d0b-937b0b87ccef";

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
    await expect(contract.validateAccount(accountId, wallet2.address))
      .to.emit(contract, "AccountValidated")
      .withArgs(accountId);

  });
  it("validateAccount with invalid account id", async function () {
    await expect(contract.validateAccount("abc", wallet2.address)).to.be.rejected;;
  });

  it("should return account Id by address", async function () {
    //    await redeployContract();
    let accountId = "aee548b2-b250-449c-8d0b-937b0b87ccef";
    let tx = await contract.validateAccount(accountId, wallet2.address);
    await tx.wait();

    console.log('wait done', contract.kycAccount.length);
    let storeAccountId = await contract.getAccountId(wallet2.address);
    console.log('storeAccountId:', storeAccountId);
    expect(storeAccountId).to.be.equal(accountId);


  });
});