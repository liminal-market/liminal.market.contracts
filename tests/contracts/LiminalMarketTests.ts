import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { solidity } from "ethereum-waffle";

import { LiminalMarket, AUSD, KYC } from '../../typechain-types';
import { Wallet } from 'ethers';
import {FakeContract, smock} from '@defi-wonderland/smock';
import hre, {upgrades} from "hardhat";
import {
	MarketCalendar,
	SecurityToken__factory
} from "../../typechain-types";


describe("LiminalMarket", function () {
	const waffle = hre.waffle;

	chai.should();
	chai.use(chaiAsPromised);
	chai.use(solidity);
	chai.use(smock.matchers);

	let owner: Wallet, wallet2: Wallet, wallet3: Wallet;
	let contract: LiminalMarket;
	let ownerContract : LiminalMarket;

	let kycContract: FakeContract<KYC>;
	let aUsdContract: FakeContract<AUSD>;
	let marketCalendarContract : FakeContract<MarketCalendar>;

	const AddressZero = "0x0000000000000000000000000000000000000000";
	const userAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
	let salt = 123344;

	before("compile", async function () {
		await hre.run('compile');
		[owner, wallet2, wallet3] = waffle.provider.getWallets();

		await redeployContract();
	})

	const redeployContract = async function () {
		const contractFactory = await hre.ethers.getContractFactory('LiminalMarket');
		ownerContract = await upgrades.deployProxy(contractFactory) as LiminalMarket;

		await setAddresses();
		//since owner will not normally interact with contract,
		// we switch to wallet2 to simplify testing
		contract = ownerContract.connect(wallet2);
	}

	const setAddresses = async function() {
		kycContract = await smock.fake<KYC>('KYC');
		aUsdContract = await smock.fake<AUSD>('aUSD');
		marketCalendarContract = await smock.fake<MarketCalendar>("MarketCalendar");
		await ownerContract.setAddresses(aUsdContract.address, kycContract.address, marketCalendarContract.address);
	}

	it("check valid addresses", async () => {

		let kycContractAddress = await contract.kycContract();
		let aUsdContractAddress = await contract.aUsdContract();
		let marketCalContractAddress = await contract.marketCalendarContract();

		expect(kycContractAddress).to.be.equal(kycContract.address);
		expect(aUsdContractAddress).to.be.equal(aUsdContract.address);
		expect(marketCalContractAddress).to.be.equal(marketCalendarContract.address);
	});

	it("should try to get security token, but doesn't exist", async ()=> {
		let token = await contract.getSecurityToken("BLe");
		expect(token).to.be.equal(AddressZero);
	});

	it("creates new token, then fetches it", async ()=> {
		let symbol = "ABC";
		let result = await contract.createToken(symbol, salt);
		let token = await contract.getSecurityToken(symbol);

		expect(token).to.be.not.equal(AddressZero);
		expect(result).to.emit(contract, "TokenCreated").withArgs(token, symbol);
	});

	it("creates new token, symbol is empty, should revert", async ()=> {
		let symbol = "";
		expect(contract.createToken(symbol, salt)).to.be.revertedWith("Symbol cannot be empty");
	});

	it("creates new token, try to create same token, should revert", async ()=> {
		await redeployContract();

		let symbol = "ABC";
		let result = await contract.createToken(symbol, salt);
		let tokenAddress = await contract.getSecurityToken(symbol);

		expect(tokenAddress).to.not.be.equal(AddressZero);
		expect(result).to.emit(contract, "TokenCreated").withArgs(tokenAddress, symbol);

		expect(contract.createToken(symbol, salt)).revertedWith("Security token already exists");
	});





	it("try to sell token, not aUSD address, will revert", async () => {
		await redeployContract();

		let symbol = "ABC";
		let amount = 10;

		let reason = await contract.ONLY_SEND_TO_AUSD();
		await expect(contract.sellSecurityToken(userAddress, userAddress, symbol, amount))
			.revertedWith(reason);
	});

	it("try to sell token, market is closed, will revert", async () => {
		await redeployContract();
		let symbol = "ABC";
		let amount = 10;
		let reason = await contract.MARKET_CLOSED();

		marketCalendarContract.isMarketOpen.returns(false);

		await expect(contract.sellSecurityToken(aUsdContract.address, userAddress, symbol, amount))
			.to.be.revertedWith(reason);
	})

	it("try to sell token, token address will be invalid, will revert", async () => {
		await redeployContract();
		let symbol = "ABC";
		let amount = 10;
		let reason = await contract.NOT_VALID_TOKEN_ADDRESS();

		marketCalendarContract.isMarketOpen.returns(true);

		await expect(contract.sellSecurityToken(aUsdContract.address, userAddress, symbol, amount))
			.to.be.revertedWith(reason);
	})

	it("try to sell token, no solution yet to test it :(", async () => {
		/*
		const myContractFactory = await smock.mock<LiminalMarket__factory>('LiminalMarket');
		const myContract = await myContractFactory.deploy()
		await myContract.setAddresses(aUsdContract.address, kycContract.address, marketCalendarContract.address);


		let symbol = "ABC";
		let amount = 10;
		let reason = await myContract.NOT_VALID_TOKEN_ADDRESS();
		await myContract.setVariable('securityTokens', {
			0 : wallet2.address,
			1 : symbol
		});

		marketCalendarContract.isMarketOpen.returns(true);

		await myContract.sellSecurityToken(aUsdContract.address, userAddress, symbol, amount);

		 */
	})

	it("should grant mint and burn role", async () => {
		await redeployContract();

		await ownerContract.grantMintAndBurnRole(wallet2.address);

		let reason = await contract.ADDRESS_CANNOT_BE_ZERO();

		await expect(contract.orderExecuted(AddressZero, "", 0, 0, 0, "buy", 0, 0, 0))
			.to.revertedWith(reason);

	})

	it("should grant mint and burn role, then remove it and revert when trying to execute order", async () => {
		await redeployContract();

		await ownerContract.grantMintAndBurnRole(wallet2.address);

		let reason = await contract.ADDRESS_CANNOT_BE_ZERO();

		await expect(contract.orderExecuted(AddressZero, "", 0, 0, 0, "buy", 0, 0, 0))
			.to.revertedWith(reason);

		await ownerContract.revokeMintAndBurnRole(wallet2.address);

		await expect(contract.orderExecuted(AddressZero, "", 0, 0, 0, "buy", 0, 0, 0))
			.to.not.be.revertedWith(reason);


	})

	it("try to execute order, but symbol is address zero, should be rejected", async () => {
		await redeployContract();

		let reason = await contract.ADDRESS_CANNOT_BE_ZERO();

		await expect(ownerContract.orderExecuted(userAddress, "ble", 0, 0, 0, "buy", 0, 0, 0))
			.to.revertedWith(reason);


	})

	it("Order executed", async () => {
		await redeployContract();

		let recipient = userAddress;
		let symbol = "ABC";
		let qty = 1000;
		let filledQty = 900;
		let filledAvgPrice = 95;
		let side = 'buy';
		let filledAt = new Date().getTime();
		let commission = 1;
		let aUsdBalance = 1000;

		await contract.createToken(symbol, salt);
		let result = await ownerContract.orderExecuted(recipient, symbol, qty, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance)

		let symbolAddress = await contract.getSecurityToken(symbol);
		let securityToken = SecurityToken__factory.connect(symbolAddress, wallet2);

		expect(await securityToken.balanceOf(recipient)).to.be.equal(qty);

		expect(aUsdContract.setBalance).to.be.calledWith(recipient, aUsdBalance);
		expect(result).to.emit(contract, "OrderExecuted")
			.withArgs(recipient, symbol, qty, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance);

	})

	it("pause contract", async () => {
		await redeployContract();

		await ownerContract.pause();
		let reason = "Pausable: paused";
		await expect(contract.orderExecuted(AddressZero, "", 0, 0, 0, "buy", 0, 0, 0))
			.to.revertedWith(reason);

		await expect(contract.createToken("abc", salt))
			.to.revertedWith(reason);

		await expect(contract.buyWithAUsd(userAddress, userAddress, 1))
			.to.revertedWith(reason);

		await expect(contract.sellSecurityToken(aUsdContract.address, userAddress, "abc", 1))
			.to.revertedWith(reason);
	})

	it("pause & unpause contract", async () => {
		await redeployContract();

		await ownerContract.pause();
		let reason = "Pausable: paused";

		await expect(contract.createToken("abc", salt))
			.to.revertedWith(reason);

		await ownerContract.unpause();

		expect(await contract.createToken("abc", salt))
			.to.emit(contract, "TokenCreated");
	})
});