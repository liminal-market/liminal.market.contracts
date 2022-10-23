import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from "ethereum-waffle";

import {AUSD, KYC, LiminalMarket, MarketCalendar, SecurityToken__factory} from '../../typechain-types';
import {Wallet} from 'ethers';
import {FakeContract, smock} from '@defi-wonderland/smock';
import hre, {upgrades} from "hardhat";


describe("LiminalMarket", function () {
    const waffle = hre.waffle;

    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);

    let owner: Wallet, wallet2: Wallet, wallet3: Wallet;
    let contract: LiminalMarket;
    let ownerContract: LiminalMarket;

    let kycContract: FakeContract<KYC>;
    let aUsdContract: FakeContract<AUSD>;
    let marketCalendarContract: FakeContract<MarketCalendar>;

    const AddressZero = "0x0000000000000000000000000000000000000000";
    const userAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

    before("compile", async function () {
        await hre.run('compile');
        [owner, wallet2, wallet3] = waffle.provider.getWallets();
    })

    beforeEach(async () => {
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

    const setAddresses = async function () {
        kycContract = await smock.fake<KYC>('KYC');
        aUsdContract = await smock.fake<AUSD>('aUSD');
        marketCalendarContract = await smock.fake<MarketCalendar>("MarketCalendar");
        await ownerContract.setAddresses(aUsdContract.address, kycContract.address, marketCalendarContract.address);

        marketCalendarContract.isMarketOpen.returns(true);
    }

    it("check valid addresses", async () => {

        let kycContractAddress = await contract.kycContract();
        let aUsdContractAddress = await contract.aUsdContract();
        let marketCalContractAddress = await contract.marketCalendarContract();

        expect(kycContractAddress).to.be.equal(kycContract.address);
        expect(aUsdContractAddress).to.be.equal(aUsdContract.address);
        expect(marketCalContractAddress).to.be.equal(marketCalendarContract.address);

    });

    it("should try to get security token, but doesn't exist", async () => {
        let token = await contract.getSecurityToken("BLe");
        expect(token).to.be.equal(AddressZero);
    });

    it("creates new token, then fetches it", async () => {
        let symbol = "ABC";
        let result = await contract.createToken(symbol);
        let token = await contract.getSecurityToken(symbol);

        expect(token).to.be.not.equal(AddressZero);
        expect(result).to.emit(contract, "TokenCreated").withArgs(token, symbol);
    });

    it("creates new token, symbol is empty, should revert", async () => {
        let symbol = "";
        await expect(contract.createToken(symbol)).rejectedWith("Symbol cannot be empty");
    });

    it("creates new token, try to create same token, should revert", async () => {
        let symbol = "ABC";
        let result = await contract.createToken(symbol);
        let tokenAddress = await contract.getSecurityToken(symbol);

        expect(tokenAddress).to.not.be.equal(AddressZero);
        expect(result).to.emit(contract, "TokenCreated").withArgs(tokenAddress, symbol);

        let reason = await contract.TOKEN_ALREADY_EXISTS();
        await expect(contract.createToken(symbol)).rejectedWith(reason);
    });


    it("try to buy with aUSD, this is now allowed since it's not coming from aUSD contract, will revert", async () => {
        let reason = await contract.ONLY_AUSD_CAN_CALL_ME();
        await expect(contract.buyWithAUsd(userAddress, userAddress, 100, AddressZero))
            .rejectedWith(reason);
    })

    it("try to sell token, not aUSD address, will revert", async () => {
        let symbol = "ABC";
        let amount = 10;

        let reason = await contract.ONLY_SEND_TO_AUSD();
        await expect(contract.sellSecurityToken(userAddress, userAddress, symbol, amount, AddressZero))
            .rejectedWith(reason);
    });

    it("try to sell token, market is closed, will revert", async () => {

        let symbol = "ABC";
        let amount = 10;
        let reason = await contract.MARKET_CLOSED();

        marketCalendarContract.isMarketOpen.returns(false);
        await expect(contract.sellSecurityToken(userAddress, aUsdContract.address, symbol, amount, AddressZero))
            .rejectedWith(reason);
    })

    it("try to sell token, token address will be invalid, will revert", async () => {

        let symbol = "ABC";
        let amount = 10;
        let reason = await contract.NOT_VALID_TOKEN_ADDRESS();

        await expect(contract.sellSecurityToken(userAddress, aUsdContract.address, symbol, amount, AddressZero))
            .rejectedWith(reason);
    })

    it("try to execute order, userAddress is zero, should fail", async () => {
        let symbol = 'abc';
        let tsl = 10;
        let filledQty = 3;
        let filledAvgPrice = 10;
        let side = 'buy';
        let filledAt = new Date().getTime();
        let commission = 0;
        let aUsdBalance = 100;

        let reason = await ownerContract.ADDRESS_CANNOT_BE_ZERO();
        await expect(ownerContract.orderExecuted(AddressZero, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance, AddressZero))
            .rejectedWith(reason);

    });

    it("try to execute order, but symbol is address zero, should be create new token and add to securityTokens list", async () => {
        let symbol = 'abc';
        let tsl = 10;
        let filledQty = 3;
        let filledAvgPrice = 10;
        let side = 'buy';
        let filledAt = new Date().getTime();
        let commission = 0;
        let aUsdBalance = 100;
        let spender = wallet3.address;

        let symbolAddressZero = await contract.getSecurityToken(symbol);
        expect(symbolAddressZero).eq(AddressZero);

        let result = await ownerContract.orderExecuted(userAddress, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance, spender);
        let symbolAddress = await contract.getSecurityToken(symbol);
        expect(symbolAddress).not.be.eq(AddressZero);

        expect(result).to.emit(contract, "OrderExecuted")
            .withArgs(userAddress, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance, spender);
        expect(result).to.emit(contract, "TokenCreated")
            .withArgs(symbolAddress, symbol);
    })

    it("Order executed, token exists before orderExecuted is called", async () => {
        let recipient = userAddress;
        let symbol = "ABC";
        let qty = 1000;
        let filledQty = 900;
        let filledAvgPrice = 95;
        let side = 'buy';
        let filledAt = new Date('2022-08-04T12:23').getTime();
        let commission = 1;
        let aUsdBalance = 1000;
        let spender = wallet3.address;

        let tokenTx = await contract.createToken(symbol);
        let symbolAddress = await contract.getSecurityToken(symbol);

        expect(tokenTx).to.emit(contract, "TokenCreated")
            .withArgs(symbolAddress, symbol);

        let result = await ownerContract.orderExecuted(recipient, symbol, qty, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance, spender)

        let securityToken = SecurityToken__factory.connect(symbolAddress, wallet2);

        expect(await securityToken.balanceOf(recipient)).to.be.equal(qty);

        expect(aUsdContract.setBalance).to.be.calledWith(recipient, aUsdBalance);
        expect(result).to.emit(contract, "OrderExecuted")
            .withArgs(recipient, symbol, qty, filledQty, filledAvgPrice, side, filledAt, commission, aUsdBalance, spender);

    })


    it("should grant mint and burn role", async () => {
        let grantRoleTx = await ownerContract.grantMintAndBurnRole(wallet2.address);
        let mintAndBurnRole = await ownerContract.MINTER_ROLE();

        expect(grantRoleTx).emit(ownerContract, 'RoleGranted').withArgs(mintAndBurnRole, wallet2.address, owner.address)

        let orderFailTx = contract.orderFailed(wallet2.address, "ABC", 0, 0, 'Error', owner.address);
        expect(orderFailTx).emit(contract, 'OrderFailed');
    })

    it("should grant mint and burn role, then remove it and revert when trying to execute order", async () => {
        await ownerContract.grantMintAndBurnRole(wallet2.address);

        let orderFailTx = await contract.orderFailed(wallet3.address, "ABC", 0, 0, 'Error', owner.address);
        expect(orderFailTx).emit(contract, 'OrderFailed');

        await ownerContract.revokeMintAndBurnRole(wallet2.address);

        await expect(contract.orderExecuted(wallet3.address, "", 0, 0, 0, "buy", 0, 0, 0, AddressZero))
            .rejectedWith('missing role');
    })

    it("pause contract", async () => {
        await ownerContract.pause();
        let reason = "Pausable: paused";
        await expect(contract.orderExecuted(AddressZero, "", 0, 0, 0, "buy", 0, 0, 0, AddressZero))
            .rejectedWith(reason);

        await expect(contract.createToken("abc"))
            .rejectedWith(reason);

        await expect(contract.buyWithAUsd(userAddress, userAddress, 1, AddressZero))
            .rejectedWith(reason);

        await expect(contract.sellSecurityToken(aUsdContract.address, userAddress, "abc", 1, AddressZero))
            .rejectedWith(reason);
    })

    it("pause & unpause contract", async () => {
        await ownerContract.pause();
        let reason = "Pausable: paused";

        await expect(contract.createToken("abc"))
            .rejectedWith(reason);

        await ownerContract.unpause();

        expect(await contract.createToken("abc"))
            .to.emit(contract, "TokenCreated");
    })
});