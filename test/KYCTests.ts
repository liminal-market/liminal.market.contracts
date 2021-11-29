
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { solidity } from "ethereum-waffle";

import ContractJson from "../artifacts/contracts/KYC.sol/KYC.json";
import { KYC } from '../typechain-types/KYC';

describe("KYC", function () {
  const hre = require('hardhat');
  const expect = chai.expect;
  const waffle = hre.waffle;
  const [owner] = hre.waffle.provider.getWallets();

  chai.use(chaiAsPromised);
  chai.use(solidity);
  let contract: KYC;
  const accountId: string = "aee548b2-b250-449c-8d0b-937b0b87ccef";

  before("compile", async function () {
    hre.run('compile');
    await redeployContract();
  })

  const redeployContract = async function () {
    contract = await waffle.deployContract(owner, ContractJson) as unknown as KYC;
  }


  it("validateAccount with valid account id", async function () {
    await expect(contract.validateAccount(accountId))
      .to.emit(contract, "AccountValidated")
      .withArgs(accountId);

  });
  it("validateAccount with invalid account id", async function () {
    await expect(contract.validateAccount("abc")).to.be.rejected;;
  });

  it("should return account Id by address", async function () {
    //    await redeployContract();
    let accountId = "aee548b2-b250-449c-8d0b-937b0b87ccef";
    var tx = await contract.validateAccount(accountId);
    tx.wait();

    console.log('waitdone', contract.kycAccount.length);
    let storeAccountId = await contract.getAccountId(owner.address);
    console.log('storeAccountId:', storeAccountId);
    expect(storeAccountId).to.be.equal(accountId);


  });
});