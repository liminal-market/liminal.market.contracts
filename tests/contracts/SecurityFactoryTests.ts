/*
import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { solidity, MockProvider } from "ethereum-waffle";

import ContractJson from "../artifacts/contracts/SecurityFactory.sol/SecurityFactory.json";
import { SecurityFactory } from '../typechain-types/SecurityFactory';
import { SecurityToken } from '../typechain-types/SecurityToken';
import { Wallet } from 'ethers';
import { FakeContract, smock } from '@defi-wonderland/smock';
import { text } from 'stream/consumers';

describe("SecurityFactory", function () {
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
  let contract: SecurityFactory;

  let kycContract: any;
  let aUsdContract: any;
  let securityTokenContract : any;

  let name = 'Test Token';
  let symbol = 'TST';
  const accountId: string = "aee548b2-b250-449c-8d0b-937b0b87ccef";

  before("compile", async function () {
    await hre.run('compile');
    [owner, wallet2, wallet3] = await waffle.provider.getWallets();

    await redeployContract();
  })

  const redeployContract = async function () {
    kycContract = await smock.fake('KYC');

	  const AUSD = await smock.mock('aUSD');
		aUsdContract = await AUSD.deploy();

	  const SecurityTokenContract = await smock.mock('SecurityToken');
		securityTokenContract = await SecurityTokenContract.deploy(name, symbol, kycContract.address, aUsdContract.address);

    contract = await deployContract(owner, ContractJson, [aUsdContract.address, kycContract.address]) as unknown as SecurityFactory;
    contract = await contract.connect(owner);
  }


  it("createToken and getSecurityToken", async function () {
    await redeployContract();

    console.log('createToken');
    await expect(contract.createToken(name, symbol))
            .to.emit(contract, "TokenCreated")
            //.withArgs(String, symbol);
console.log('token created');
    await expect(contract.getSecurityToken("Test"))
            .to.not.be.undefined
    console.log('done');
  });

  it("SellToken event", async function() {
    await redeployContract();

    await expect(contract.sellSecurityToken("1", wallet2.address, wallet3.address, "2", 0))
      .to.emit(contract, "SellSecurityToken")
      .withArgs("1", wallet2.address, wallet3.address, "2", 0);


  })

  it("grantMintAndBurnRole", async function() {
      var tx = await contract.grantMintAndBurnRole(wallet2.address);
      tx.wait();

      let role = await contract.MINT_AND_BURN_ROLE;
      //await contract.hasRole(role, wallet2.address);
  });

   it("grantMintAndBurnRole, not owner so should fail", async function() {
      contract = contract.connect(wallet2.address);

      await expect(contract.grantMintAndBurnRole(wallet2.address)).to.be.reverted;
  });

  it("mintSecurityTokenAndSetAUsdBalance", async function() {
    await redeployContract();

    let tokenAmount = 100;
    let aUsd = 32;

    securityTokenContract.mint(wallet2.address, tokenAmount);
    aUsdContract.setBalance(wallet2.address, aUsd);

    let tx = await contract.createToken(name, symbol);
    tx.wait();

    tx = await aUsdContract.grantRoleForBalance(contract.address);
    tx.wait();

    tx = await contract.mintSecurityTokenAndSetAUsdBalance("TST", wallet2.address, tokenAmount, aUsd);
    tx.wait();

    await expect(securityTokenContract.mint).to.have.be.calledOnceWith(wallet2.address, tokenAmount);
    await expect(aUsdContract.setBalance).to.have.be.calledWith(wallet2.address, aUsd);

  })


});
*/