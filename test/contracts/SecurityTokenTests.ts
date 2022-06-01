
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { solidity } from "ethereum-waffle";

import ContractJson from "../../artifacts/contracts/SecurityToken.sol/SecurityToken.json";
import { Wallet } from 'ethers';
import { smock } from '@defi-wonderland/smock';
import hre, {upgrades} from "hardhat";
import {AUSD, KYC, LiminalMarket, MarketCalendar, SecurityToken, SecurityToken__factory} from "../../typechain-types";

describe("SecurityToken", function () {
  const waffle = hre.waffle;
  const { deployContract } = hre.waffle;

  const expect = chai.expect;
  chai.should();
  chai.use(chaiAsPromised);
  chai.use(solidity);
  chai.use(smock.matchers);

  let owner: Wallet, wallet2: Wallet, wallet3: Wallet;
  let contract: SecurityToken;

  const symbol = 'AAPL';
  const name = "Apple Comp. Inc."
  const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  before("compile", async function () {
    await hre.run('compile');
    [owner, wallet2, wallet3] = waffle.provider.getWallets();

    await redeployContract();
  })

  const redeployContract = async function () {
    contract = await deployContract(owner, ContractJson, [name, symbol]) as unknown as SecurityToken;
  }

  it("should have symbol and name ABC", async () => {
    expect(await contract.symbol()).equal(symbol);
    expect(await contract.name()).equal(name);
  });

  it("should set the balance, to increase the balance of the account", async () => {
    let balance = await contract.balanceOf(userAddress);
    expect(balance).equal(0);

    let qty = 100;
    expect(await contract.setQuantity(userAddress, qty))
        .to.emit(contract, "BalanceSet")
        .withArgs(userAddress, qty);

    balance = await contract.balanceOf(userAddress);
    expect(balance).equal(qty);
  })

  it("should set the balance, to decrease the balance of the account", async () => {
    await redeployContract();

    let balance = await contract.balanceOf(userAddress);
    expect(balance).equal(0);

    let qty = 1000000;
    expect(await contract.setQuantity(userAddress, qty))
        .to.emit(contract, "BalanceSet")
        .withArgs(userAddress, qty);

    balance = await contract.balanceOf(userAddress);
    expect(balance).equal(qty);

    let qty2 = 233430;
    expect(await contract.setQuantity(userAddress, qty2))
        .to.emit(contract, "BalanceSet")
        .withArgs(userAddress, qty2);

    balance = await contract.balanceOf(userAddress);
    expect(balance).equal(qty2);

  });

  it("should set the balance what it already is, nothing should happen", async () => {
    await redeployContract();

    let balance = await contract.balanceOf(userAddress);
    expect(balance).equal(0);

    let qty = 1000000;
    expect(await contract.setQuantity(userAddress, qty))
        .to.emit(contract, "BalanceSet")
        .withArgs(userAddress, qty);

    balance = await contract.balanceOf(userAddress);
    expect(balance).equal(qty);

    expect(await contract.setQuantity(userAddress, balance))
        .not.to.emit(contract, "BalanceSet");

  });

  it("do transfer, call liminal.market contract", async () => {
    await redeployContract();

    let symbol = "TEST";

    const contractFactory = await hre.ethers.getContractFactory('LiminalMarket');
    let liminalContract = await upgrades.deployProxy(contractFactory) as LiminalMarket;
    let kycContract = await smock.fake<KYC>('KYC');
    let aUsdContract = await smock.fake<AUSD>('aUSD');
    let marketCalendarContract = await smock.fake<MarketCalendar>("MarketCalendar");
    await liminalContract.setAddresses(aUsdContract.address, kycContract.address, marketCalendarContract.address);

    kycContract.isValid.returns(true);

    marketCalendarContract.isMarketOpen.returns(true);

    await liminalContract.createToken(symbol, 123);
    await liminalContract.orderExecuted(wallet2.address, symbol, 2500, 10, 10, "buy", 122, 0, 1200)

    let tokenAddress = await liminalContract.getSecurityToken(symbol);
    let securityToken = SecurityToken__factory.connect(tokenAddress, wallet2);

    expect(await securityToken.transfer(aUsdContract.address, 100))
        .to.emit(liminalContract, "SellSecurityToken")

  });

  it("do transfer, quantity is higher then balance, should revert", async () => {
    await redeployContract();

    let symbol = "TEST";

    const contractFactory = await hre.ethers.getContractFactory('LiminalMarket');
    let liminalContract = await upgrades.deployProxy(contractFactory) as LiminalMarket;
    let kycContract = await smock.fake<KYC>('KYC');
    let aUsdContract = await smock.fake<AUSD>('aUSD');
    let marketCalendarContract = await smock.fake<MarketCalendar>("MarketCalendar");
    await liminalContract.setAddresses(aUsdContract.address, kycContract.address, marketCalendarContract.address);

    kycContract.isValid.returns(true);

    marketCalendarContract.isMarketOpen.returns(true);

    await liminalContract.createToken(symbol, 123);
    await liminalContract.orderExecuted(wallet2.address, symbol, 2, 10, 10, "buy", 122, 0, 1200)

    let tokenAddress = await liminalContract.getSecurityToken(symbol);
    let securityToken = SecurityToken__factory.connect(tokenAddress, wallet2);

    let reason = await liminalContract.QUANTITY_MORE_THEN_BALANCE();
    await expect(securityToken.transfer(aUsdContract.address, 100))
        .to.rejectedWith(reason);

  })


  it("allowance() should not be supported", async () => {
    await expect(contract.allowance(userAddress, userAddress))
        .to.be.rejected;
  })

  it("approve() should not be supported", async () => {
    await expect(contract.approve(userAddress, 11))
        .to.be.rejected;
  })
  it("allowance() should not be supported", async () => {
    await expect(contract.transferFrom(userAddress, userAddress, 11))
        .to.be.rejected;
  })
});