
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {MockContract, solidity} from "ethereum-waffle";
import LiminalMarketJson from '../../artifacts/contracts/LiminalMarket.sol/LiminalMarket.json';
import { Wallet } from 'ethers';
import hre, {upgrades} from "hardhat";
import {AUSD, LiminalMarket} from "../../typechain-types";
import { FakeContract, smock } from '@defi-wonderland/smock';


describe("aUsd", function () {
  const expect = chai.expect;
  const hre = require("hardhat");
  const waffle = hre.waffle;
  chai.should();
  chai.use(chaiAsPromised);
  chai.use(solidity);
  chai.use(smock.matchers);

  let owner : Wallet, wallet2 : Wallet, wallet3 : Wallet;
  let contract: AUSD;
  let liminalMarketContract : FakeContract<LiminalMarket>;


  before("before running each test", async function () {
    await hre.run('compile');

    [owner, wallet2, wallet3] = waffle.provider.getWallets();

    await redeployContract();
  })

  const redeployContract = async function() {
    const contractFactory = await hre.ethers.getContractFactory('aUSD');
    contract = await upgrades.deployProxy(contractFactory) as AUSD;
  }

  it('Call transfer method, should call buyWithAUsd on LiminalMarket contract', async function() {
    let tokenAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    let amount = 12;
    let expectedResult = true;

    liminalMarketContract = await smock.fake<LiminalMarket>('LiminalMarket');
    await liminalMarketContract.buyWithAUsd.returns(expectedResult);

    await contract.setLiminalMarketAddress(liminalMarketContract.address);

    let contractW2 = contract.connect(wallet2);
    await contractW2.transfer(tokenAddress, amount);

    expect(liminalMarketContract.buyWithAUsd).to.have.been.calledWith(wallet2.address, tokenAddress, amount);
  })

  it("Check balance of new deployment", async function () {
    let balanceOf = await contract.balanceOf(owner.address);
    expect(balanceOf).to.equal(0);

  });

  it("set balance to wallet", async function() {
    await contract.setBalance(wallet2.address, 199);
    await expect(await contract.balanceOf(wallet2.address)).to.be.equal(199);
  });

  it("set different balances to wallet", async function() {
    let amount1 = 199;
    let amount2 = 3888;
    let amount3 = 23;
    await contract.setBalance(wallet2.address, amount1);
    await expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount1);

    await contract.setBalance(wallet2.address, amount2);
    await expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount2);

    await contract.setBalance(wallet2.address, amount3);
    await expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount3);

  });

  it("grant role, connect new wallet, set balance to wallet", async function() {
    await contract.grantRoleForBalance(wallet3.address);
    let amount = 235;

    let contractW3 = contract.connect(wallet3);
    await contractW3.setBalance(wallet2.address, amount);
    await expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount);
  });

  it("Try to set balance with wallet that doesnt have permission, should fail", async function() {
    await redeployContract();

    let contractW3 = contract.connect(wallet3);
    await expect(contractW3.setBalance(wallet2.address, 199)).to.be.rejected;
  });

  it("give role", async function() {
    await contract.grantRoleForBalance(wallet2.address);
  })

  it("Transfer should be rejected", async function () {
    expect(contract.transfer(owner.address, 10)).to.be.reverted;
  });


  it("allowance should be rejected", async function () {
    expect(contract.allowance(owner.address, wallet2.address)).to.be.reverted;
  })

  it("approve should be rejected", async function () {
    expect(contract.approve(owner.address, 10)).to.be.rejected;
  })

  it("transferFrom should be rejected", async function () {
    expect(contract.transferFrom(owner.address, wallet2.address, 10)).to.be.reverted;
  })


  it("Pause contract, try to execute on it", async function () {
    await contract.pause();
    await expect(contract.transfer(wallet2.address, 12)).to.be.reverted;
  });

  it("Pause contract, try to execute on it, then unpause contract and execute again", async function () {
    await redeployContract();

    liminalMarketContract = await smock.fake<LiminalMarket>('LiminalMarket');
    await liminalMarketContract.buyWithAUsd.returns(true);
    await contract.setLiminalMarketAddress(liminalMarketContract.address);

    await contract.pause();
    await expect(contract.transfer(wallet2.address, 12)).to.be.reverted;

    await contract.unpause();
    let tokenAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    let amount = 1244;
    await contract.transfer(tokenAddress, amount);

    expect(liminalMarketContract.buyWithAUsd).to.have.been.calledWith(owner.address, tokenAddress, amount);
  });
});