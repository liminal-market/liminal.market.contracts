
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { solidity, MockProvider } from "ethereum-waffle";

import ContractJson from "../artifacts/contracts/SecurityToken.sol/SecurityToken.json";
import KYCContractJson from "../artifacts/contracts/KYC.sol/KYC.json";
import AUSDContractJson from "../artifacts/contracts/AUSD.sol/aUSD.json";
import SecurityFactoryContractJson from "../artifacts/contracts/SecurityFactory.sol/SecurityFactory.json";
import { SecurityToken } from '../typechain-types/SecurityToken';
import { KYC } from '../typechain-types/KYC';
import { AUSD } from '../typechain-types/AUSD';
import { Wallet } from 'ethers';
import { FakeContract, smock } from '@defi-wonderland/smock';

describe("SecurityToken", function () {
  const hre = require("hardhat");
  const waffle = hre.waffle;
  const { deployContract, deployMockContract } = hre.waffle;
  const [wallet] = new MockProvider().getWallets()

  const expect = chai.expect;
  chai.should();
  chai.use(chaiAsPromised);
  chai.use(solidity);
  chai.use(smock.matchers);

  let owner: Wallet, wallet2: Wallet, wallet3: Wallet;
  let contract: SecurityToken;

  const symbol = 'AAPL';
  const name = "Apple Comp. Inc."
  const accountId: string = "aee548b2-b250-449c-8d0b-937b0b87ccef";

  let kycContract: any;
  let aUsdContract: any;
  let securityFactoryContract: any;

  before("compile", async function () {
    await hre.run('compile');
    [owner, wallet2, wallet3] = await waffle.provider.getWallets();

    await redeployContract();
  })

  const redeployContract = async function () {
    kycContract = await smock.fake('KYC');
    aUsdContract = await smock.fake('aUSD');

    const securityFactoryFactory = await smock.mock('SecurityFactory');
    securityFactoryContract = await securityFactoryFactory.deploy(kycContract.address, aUsdContract.address);

    contract = await deployContract(owner, ContractJson,
      [name, symbol, kycContract.address, securityFactoryContract.address]) as unknown as SecurityToken;
    contract = await contract.connect(owner);
  }



  it("mint 2 times to get balance from event", async function () {
    await redeployContract();

    let mintAmount = 10;
    await expect(contract.mint(wallet3.address, mintAmount))
      .to.emit(contract, "Mint")
      .withArgs(wallet3.address, mintAmount, symbol, mintAmount);

    await expect(contract.mint(wallet3.address, mintAmount))
      .to.emit(contract, "Mint")
      .withArgs(wallet3.address, mintAmount, symbol, mintAmount * 2);

    await expect(await contract.balanceOf(wallet3.address)).to.be.equal(mintAmount * 2);
  });

  it("transfer", async function () {

    await redeployContract();

    let mintAmount = 100;

    await kycContract.isValid(wallet2.address);//.returns();
    await kycContract.isValid.returns(accountId);
    await securityFactoryContract.sellSecurityToken(accountId, securityFactoryContract.address,
      wallet2.address, symbol, mintAmount);


    await contract.mint(wallet2.address, mintAmount);
    contract = await contract.connect(wallet2);
    await expect(contract.transfer(owner.address, mintAmount))
      .to.emit(securityFactoryContract, "SellSecurityToken")
      .withArgs(accountId, owner.address, wallet2.address, symbol, mintAmount);

    expect(kycContract.isValid).to.have.been.called;
    expect(securityFactoryContract.sellSecurityToken).to.have.been.called;
  });

  it("transfer to wrong address", async function() {
    await expect(contract.transfer(wallet3.address, 10)).to.rejected;
  })

  it("allowance should be rejected", async function () {
    await redeployContract();
    await expect(contract.allowance(owner.address, wallet2.address)).to.be.reverted;
  })

  it("approve should be rejected", async function () {
    await expect(contract.approve(owner.address, 10)).to.be.rejected;
  })

  it("transferFrom should be rejected", async function () {

    await expect(contract.transferFrom(owner.address, wallet2.address, 10)).to.be.reverted;
  })
});