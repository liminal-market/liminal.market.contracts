
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { solidity} from "ethereum-waffle";
import { Wallet } from 'ethers';
import {upgrades} from "hardhat";
import {
  AUSD,
  KYC,
  LiminalMarket,
  MarketCalendar,
  SecurityToken__factory
} from "../../typechain-types";
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
  let kycContract: FakeContract<KYC>;
  let marketCalendarContract : FakeContract<MarketCalendar>;


  const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const brokerAccountId = "aee548b2-b250-449c-8d0b-937b0b87ccef";
  let salt = 123344;

  before("before running each test", async function () {
    await hre.run('compile');

    [owner, wallet2, wallet3] = waffle.provider.getWallets();

    await redeployContract();
  })

  const redeployContract = async function() {
    const contractFactory = await hre.ethers.getContractFactory('aUSD');
    contract = await upgrades.deployProxy(contractFactory) as AUSD;

    await initFakeContracts();
  }

  const initFakeContracts = async function() {
    kycContract = await smock.fake<KYC>('KYC');
    marketCalendarContract = await smock.fake<MarketCalendar>("MarketCalendar");
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

  it("should buy with aUSD", async () => {
    await redeployContract();

    let symbol = "ABC";
    const contractFactory = await hre.ethers.getContractFactory('LiminalMarket');
    let liminalContract = await upgrades.deployProxy(contractFactory) as LiminalMarket;
    await liminalContract.setAddresses(contract.address, kycContract.address, marketCalendarContract.address);

    await contract.setLiminalMarketAddress(liminalContract.address);
    await contract.grantRoleForBalance(liminalContract.address);

    await liminalContract.createToken(symbol, salt);
    let tokenAddress = await liminalContract.getSecurityToken(symbol);

    let amount = 100;
    let aUsdContractBalance = 1000;
    marketCalendarContract.isMarketOpen.returns(true);
    kycContract.isValid.returns(brokerAccountId);
    await contract.setBalance(wallet2.address, aUsdContractBalance);

    let contractW2 = contract.connect(wallet2);
    expect(await contractW2.transfer(tokenAddress, amount))
        .to.emit(liminalContract, "BuyWithAUsd")
        .withArgs(wallet2.address, amount, brokerAccountId, symbol, tokenAddress);

  })

  it("try to buy with aUSD, but token address is NOT liminal.market token, should revert", async () => {
    await redeployContract();

    let symbol = "ABC";

    const contractFactory = await hre.ethers.getContractFactory('LiminalMarket');
    let liminalContract = await upgrades.deployProxy(contractFactory) as LiminalMarket;
    await liminalContract.setAddresses(contract.address, kycContract.address, marketCalendarContract.address);

    await contract.setLiminalMarketAddress(liminalContract.address);
    await contract.grantRoleForBalance(liminalContract.address);

    let securityTokenFactory = await smock.mock<SecurityToken__factory>('SecurityToken');
    let securityToken = await securityTokenFactory.deploy(symbol, symbol);

    let tokenAddress = securityToken.address;

    let amount = 100;
    let aUsdContractBalance = 1000;
    marketCalendarContract.isMarketOpen.returns(true);
    kycContract.isValid.returns(brokerAccountId);
    await contract.setBalance(wallet2.address, aUsdContractBalance);

    let contractW2 = contract.connect(wallet2);
    await expect(contractW2.transfer(tokenAddress, amount))
        .to.revertedWith("This is not valid token address")

  })

  it("try to buy, but doesn't have enough aUSD, should revert", async () => {
    await redeployContract();

    const contractFactory = await hre.ethers.getContractFactory('LiminalMarket');
    let liminalContract = await upgrades.deployProxy(contractFactory) as LiminalMarket;
    await liminalContract.setAddresses(contract.address, kycContract.address, marketCalendarContract.address);

    await contract.setLiminalMarketAddress(liminalContract.address);
    await contract.grantRoleForBalance(liminalContract.address);

    let tokenAddress = userAddress;
    let amount = 100;
    let aUsdContractBalance = 1;
    marketCalendarContract.isMarketOpen.returns(true);
    kycContract.isValid.returns(brokerAccountId);
    await contract.setBalance(wallet2.address, aUsdContractBalance);

    let contractW2 = contract.connect(wallet2);
    await expect(contractW2.transfer(tokenAddress, amount))
        .to.be.revertedWith("You don't have enough aUSD");
  })

  it("try to buy, market is closed, should revert", async () => {

    const contractFactory = await hre.ethers.getContractFactory('LiminalMarket');
    let liminalContract = await upgrades.deployProxy(contractFactory) as LiminalMarket;
    await liminalContract.setAddresses(contract.address, kycContract.address, marketCalendarContract.address);

    await contract.setLiminalMarketAddress(liminalContract.address);
    await contract.grantRoleForBalance(liminalContract.address);

    let tokenAddress = userAddress;
    let amount = 100;
    marketCalendarContract.isMarketOpen.returns(false);

    let contractW2 = contract.connect(wallet2);
    let reason = await liminalContract.MARKET_CLOSED();
    await expect(contractW2.transfer(tokenAddress, amount))
        .to.be.revertedWith(reason);
  })


  it("Check balance of new deployment", async function () {
    let balanceOf = await contract.balanceOf(owner.address);
    expect(balanceOf).to.equal(0);

  });

  it("set balance to wallet", async function() {
    let amount = 199;
    expect(await contract.setBalance(wallet2.address, amount))
        .emit(contract, "BalanceSet").withArgs(wallet2.address, amount);
    await expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount);

  });

  it("set different balances to wallet", async function() {
    await redeployContract();

    let amount1 = 199;
    let amount2 = 3888;
    let amount3 = 23;
    expect(await contract.setBalance(wallet2.address, amount1))
        .to.emit(contract, "BalanceSet").withArgs(wallet2.address, amount1);
    expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount1);

    expect(await contract.setBalance(wallet2.address, amount2))
        .to.emit(contract, "BalanceSet").withArgs(wallet2.address, amount2);
    expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount2);

    expect(await contract.setBalance(wallet2.address, amount3))
        .to.emit(contract, "BalanceSet").withArgs(wallet2.address, amount3);
    expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount3);

  });

  it("set balance, then set same amount. It should test first if clause and not emit event", async function() {
    await redeployContract();

    let amount1 = 78936;
    expect(await contract.setBalance(wallet2.address, amount1))
        .to.emit(contract, "BalanceSet").withArgs(wallet2.address, amount1);
    expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount1);

    expect(await contract.setBalance(wallet2.address, amount1))
        .not.to.emit(contract, "BalanceSet");

  });

  it("grant role, connect new wallet, set balance to wallet", async function() {
    await contract.grantRoleForBalance(wallet3.address);
    let amount = 235;

    let contractW3 = contract.connect(wallet3);
    await contractW3.setBalance(wallet2.address, amount);
    await expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount);
  });

  it("grant role, connect new wallet, set balance to wallet, then remove role and try again, should be revered", async function() {
    await redeployContract();

    expect(await contract.grantRoleForBalance(wallet3.address))
        .to.emit(contract, "RoleGranted")
        .withArgs(contract.SET_BALANCE, wallet3.address, owner.address);

    let amount = 235;

    let contractW3 = contract.connect(wallet3);
    await contractW3.setBalance(wallet2.address, amount);
    await expect(await contract.balanceOf(wallet2.address)).to.be.equal(amount);

    expect(await contract.revokeRoleForBalance(wallet3.address))
        .to.emit(contract, "RoleRevoked")
        .withArgs(contract.SET_BALANCE, wallet3.address, owner.address);

    await expect(contractW3.setBalance(wallet2.address, 555)).to.be.rejected;
  });

  it("Try to set balance with wallet that doesnt have permission, should fail", async function() {
    await redeployContract();

    let contractW3 = contract.connect(wallet3);
    await expect(contractW3.setBalance(wallet2.address, 199)).to.be.rejected;
  });

  it("give role", async function() {
    await contract.grantRoleForBalance(wallet2.address);
  })

  it("allowance should be rejected", async function () {
    expect(contract.allowance(owner.address, wallet2.address)).to.be.reverted;
  });
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

  it("Pause contract, try to execute on it, then unpause contract and execute again", async function () {
    await redeployContract();

    await contract.pause();
    await expect(contract.setBalance(wallet2.address, 12)).to.be.reverted;
  });
});