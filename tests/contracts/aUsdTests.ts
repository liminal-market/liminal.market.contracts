
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { solidity } from "ethereum-waffle";

import { Wallet } from 'ethers';
import hre, {upgrades} from "hardhat";
import {AUSD} from "../../typechain-types";


describe("aUsd", function () {
  const expect = chai.expect;
  const hre = require("hardhat");
  const waffle = hre.waffle;
  chai.use(chaiAsPromised);
  chai.use(solidity);

  let owner : Wallet, wallet2 : Wallet, wallet3 : Wallet;
  let contract: AUSD;


  before("before running each test", async function () {
    await hre.run('compile');

    [owner, wallet2, wallet3] = waffle.provider.getWallets();

    await redeployContract();
  })

  const redeployContract = async function() {
   // contract = await deployContract(owner, ContractJson);

    const contractFactory = await hre.ethers.getContractFactory('aUSD');
    contract = await upgrades.deployProxy(contractFactory) as AUSD;
  }

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

    contract = await contract.connect(wallet3);
    await contract.setBalance(wallet2.address, amount);
    await expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount);
  });

  it("Try to set balance with wallet that doesnt have permission, should fail", async function() {
    contract = await contract.connect(wallet3);
    await expect(contract.setBalance(wallet2.address, 199)).to.be.rejected;
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
});