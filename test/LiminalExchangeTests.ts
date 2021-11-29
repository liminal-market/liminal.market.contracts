import chai, { should } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { solidity, MockProvider } from "ethereum-waffle";

import ContractJson from "../artifacts/contracts/LiminalExchange.sol/LiminalExchange.json";
import { LiminalExchange } from '../typechain-types/LiminalExchange';
import { SecurityFactory } from '../typechain-types/SecurityFactory';
import { Oracle } from '../typechain-types/Oracle';
import { AUSD } from '../typechain-types/AUSD';
import { KYC } from '../typechain-types/KYC';
import { BigNumber, Wallet } from 'ethers';
import { FakeContract, smock } from '@defi-wonderland/smock';
import { text } from 'stream/consumers';
import { ERC20 } from '../typechain-types/ERC20';

describe("LiminalExchange", function () {
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
	let contract: LiminalExchange;

	let kycContract: any;
	let securityFactory: any
	let oracleContract: Oracle;
	let aUsdContract: AUSD;
	let usdcContract: any;

	const liminalWalletAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
	const brokerAddress = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
	const linkTokenAddress = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';
	const usdcContractAddress = '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b';

	const accountId: string = "aee548b2-b250-449c-8d0b-937b0b87ccef";
	const symbol = "TST";

	before("compile", async function () {
		await hre.run('compile');
		[owner, wallet2, wallet3] = await waffle.provider.getWallets();

		await redeployContract();
	})

	const redeployContract = async function () {
		const securityFactoryFactory = await smock.mock('SecurityFactory');
		securityFactory = await smock.fake('SecurityFactory'); //await securityFactoryFactory.deploy() as unknown as SecurityFactory;

		const kycContractFactory = await smock.mock('KYC');
		kycContract = await smock.fake('KYC'); // await kycContractFactory.deploy() as unknown as KYC;

		const aUsdContractFactory = await smock.mock('aUSD');
		aUsdContract = await aUsdContractFactory.deploy() as unknown as AUSD;

		const oracleContractFactory = await smock.mock('Oracle');
		//oracleContract = await oracleContractFactory.deploy([linkTokenAddress]) as unknown as Oracle;


		const usdcContractFactory = await smock.mock('ERC20');
		usdcContract = await smock.fake('ERC20'); //await usdcContractFactory.deploy("USDC", "USDC2");


		contract = await deployContract(owner, ContractJson,
			[
				securityFactory.address,
				securityFactory.address, //should be oracleContract.address just while LINK hasnt been implemented
				kycContract.address,
				aUsdContract.address,
				liminalWalletAddress,
				brokerAddress,
				linkTokenAddress,
				usdcContract.address
			]) as unknown as LiminalExchange;
		contract = await contract.connect(owner);

	}


	it("calculate fee for $1000, since USDC has 6 decimal point it's 10**6", async function () {
		await redeployContract();
		await expect(await contract.callStatic.calculateFee(1000 * 10**6)).to.be.equal(5 * 10**6);
	});

	it("calculate fee for $100, since USDC has 6 decimal point it's 10**6, since we expecct 0.5 it's 10**5", async function () {
		await redeployContract();
		await expect(await contract.callStatic.calculateFee(100 * 10**6)).to.be.equal(5 * 10**5);
	});

	it("buy but symbol is empty, throw error", async function () {
		await expect(contract.buy("", 100)).to.be.reverted;
	})

	it("buy but amount is 0, throw error", async function () {
		await expect(contract.buy(symbol, 0)).to.be.reverted;
	})

	it("buy but balanceOf USDC is not enough, throw error", async function () {
		let amount = 100;

		contract = await contract.connect(wallet2);

		usdcContract.balanceOf(wallet2.address)
		usdcContract.balanceOf.returns(0);

		await expect(contract.buy(symbol, 10)).to.be.reverted;

	});


	it("buy but allowance for USDC is not enough, throw error", async function () {
		await redeployContract();
		let amount = 100;

		contract = await contract.connect(wallet2);

		usdcContract.balanceOf(wallet2.address)
		usdcContract.balanceOf.returns(1000);

		usdcContract.allowance(wallet2.address, owner.address);
		usdcContract.allowance.returns(2);

		await expect(contract.buy(symbol, 10)).to.be.reverted;

	});

	it("buy", async function () {
		await redeployContract();

		let amount = 10000;
		let amountAfterFee = 9950;
		let fee = 50;
		let accountId = "abc";
		let securityTokenAddress = "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a";

		contract = await contract.connect(wallet2);

		await usdcContract.balanceOf(wallet2.address)
		await usdcContract.balanceOf.returns(amount);

		await usdcContract.allowance(wallet2.address, owner.address);
		await usdcContract.allowance.returns(amount);

		await kycContract.isValid(wallet2.address);
		await kycContract.isValid.returns(accountId);

		await securityFactory.getSecurityToken(symbol);
		await securityFactory.getSecurityToken.returns(securityTokenAddress);

		await expect(contract.buy(symbol, amount))
			.to.emit(contract, "Bought")
			.withArgs(amountAfterFee, accountId, symbol, fee, securityTokenAddress)

		await expect(usdcContract.transferFrom).to.have.been.calledWith(wallet2.address, contract.address, amount);
		await expect(usdcContract.transfer).to.have.been.calledWith(brokerAddress, amountAfterFee);
		await expect(usdcContract.transfer).to.have.been.calledWith(liminalWalletAddress, fee);

	});
});