
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { solidity } from "ethereum-waffle";

import { Wallet } from 'ethers';
import ContractJson from "../../artifacts/contracts/aUSD.sol/aUSD.json";
import { AUSD }from '../../typechain-types/AUSD';
import { deployContract } from 'ethereum-waffle';


describe("aUsd", function () {
  const expect = chai.expect;
  const hre = require("hardhat");
  const waffle = hre.waffle;
  chai.use(chaiAsPromised);
  chai.use(solidity);

  let owner : Wallet, wallet2 : Wallet, wallet3 : Wallet;
  let contract: any;


  before("compile", async function () {
    hre.run('compile');

    [owner, wallet2, wallet3] = await waffle.provider.getWallets();

    await redeployContract();
  })

  const redeployContract = async function() {
    contract = await deployContract(owner, ContractJson);
  }

  it("Check balance of new deployment", async function () {
    await redeployContract();
    let balanceOf = await contract.balanceOf(owner.address);
    expect(balanceOf).to.equal(0);

  });

  it("set balance to wallet", async function() {

    await redeployContract();
    await contract.setBalance(wallet2.address, 199);

    await expect(await contract.balanceOf(wallet2.address)).to.be.equal(199);
  });

  it("Try to set balance, should fail", async function() {

    contract = await contract.connect(wallet3.address);
    await expect(contract.setBalance(wallet2.address, 199)).to.be.rejected;
  });

  it("give role", async function() {
    await redeployContract();
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