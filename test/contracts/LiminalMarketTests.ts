import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from "ethereum-waffle";

import {
    AUSD,
    KYC,
    LiminalMarket,
    LM,
    MarketCalendar,
    SecurityToken__factory,
    ServiceContract
} from '../../typechain-types';
import {BigNumber, Wallet} from 'ethers';
import {FakeContract, smock} from '@defi-wonderland/smock';
import hre, {upgrades} from "hardhat";
import TestHelper from "../TestHelper";


describe("LiminalMarket", function () {
    const waffle = hre.waffle;

    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);

    let owner: Wallet, wallet2: Wallet, wallet3: Wallet, wallet4: Wallet;
    let contract: LiminalMarket;
    let ownerContract: LiminalMarket;

    let kycContract: FakeContract<KYC>;
    let aUsdContract: FakeContract<AUSD>;
    let marketCalendarContract: FakeContract<MarketCalendar>;
    let lmContract: LM;
    let serviceContract: ServiceContract;
    const OrderExecuted = 3;

    const AddressZero = "0x0000000000000000000000000000000000000000";
    const userAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
    const lmServiceFeeAddress = TestHelper.LMServiceFeeAddress;
    const accountId = '123-456-789';
    before("compile", async function () {
        await hre.run('compile');
        [owner, wallet2, wallet3, wallet4] = waffle.provider.getWallets();
    })

    beforeEach(async () => {
        await redeployContract();
    })

    const redeployContract = async function () {
        const contractFactory = await hre.ethers.getContractFactory('LiminalMarket');
        ownerContract = await upgrades.deployProxy(contractFactory) as LiminalMarket;

        kycContract = await smock.fake<KYC>('KYC');
        kycContract.isValid.returns(accountId);

        aUsdContract = await smock.fake<AUSD>('aUSD');
        aUsdContract.balanceOf.returns(1000);
        marketCalendarContract = await smock.fake<MarketCalendar>("MarketCalendar");

        let lmContractFactory = await hre.ethers.getContractFactory('LM');
        lmContract = await upgrades.deployProxy(lmContractFactory) as LM;

        let serviceContractFactory = await hre.ethers.getContractFactory('ServiceContract');
        serviceContract = await upgrades.deployProxy(serviceContractFactory) as ServiceContract;

        await setAddresses();
        //since owner will not normally interact with contract,
        // we switch to wallet2 to simplify testing
        contract = ownerContract.connect(wallet2);
    }

    const setAddresses = async function () {

        await ownerContract.setAddresses(aUsdContract.address, kycContract.address, marketCalendarContract.address, lmContract.address);
        await lmContract.setServiceContractAddress(serviceContract.address);
        await serviceContract.setLMServiceFeeAddress(lmServiceFeeAddress)
        await lmContract.grantServiceFeeRole(ownerContract.address);
        await lmContract.mint(wallet2.address, 200 * 10 ** 5);

        await serviceContract.createContract(wallet3.address, wallet2.address, 100, 'Liminal.market', 'https://liminal.market')
        marketCalendarContract.isMarketOpen.returns(true);
    }

    it('should call setAddresses, does not have role, should be rejected', async () => {
        await expect(contract.setAddresses(aUsdContract.address, kycContract.address, marketCalendarContract.address, lmContract.address))
            .rejectedWith(TestHelper.AccessControlErrorMessage);
    })

    it('should call initialize, should be rejected', async () => {
        await TestHelper.initializeRejected(ownerContract);
    })
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

    it('should buySecurityToken', async () => {
        let createContractResult = await serviceContract.createContract(TestHelper.AddressZero, wallet4.address, 100, "ble", "bla")
        let ble = await createContractResult.wait();
        let contractAddress = ble.events![0].args!.contractAddress;
        console.log('contractAddress', contractAddress);
        await lmContract.mint(wallet4.address, 200 * 10 ** 5);

        let result = await contract.buySecurityToken(wallet3.address, 'AAPL', 100, contractAddress);
        let tx = await result.wait();
        let tokenAddress = TestHelper.getArgValueFromEvent(tx, 'TokenCreated', 'tokenAddress')
        expect(result).to.emit(contract, 'BuyWithAUsd')
            .withArgs(wallet3.address, 100, accountId, 'AAPL', tokenAddress, contractAddress)
    })


    it("try to buy with aUSD, this is not allowed since it's not coming from aUSD contract, will revert", async () => {
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
        let aUsdBalance = 100;

        let reason = await ownerContract.ADDRESS_CANNOT_BE_ZERO();
        await expect(ownerContract.orderExecuted(AddressZero, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, aUsdBalance, AddressZero))
            .rejectedWith(reason);

    });

    function getBigNumber(n: number, repeat = 18) {
        return BigNumber.from(n + '0'.repeat(repeat));
    }

    it("should execute order, with side = init, should work", async () => {
        let symbol = 'abc';
        let tsl = getBigNumber(10);
        let filledQty = getBigNumber(3);
        let filledAvgPrice = getBigNumber(10);
        let side = 'init';
        let filledAt = new Date().getTime();
        let aUsdBalance = getBigNumber(100);
        let spender = wallet3.address;
        let serviceFee = getBigNumber(0);
        let symbolAddressZero = await contract.getSecurityToken(symbol);
        expect(symbolAddressZero).eq(AddressZero);

        let result = await ownerContract.orderExecuted(userAddress, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, aUsdBalance, spender);
        let symbolAddress = await contract.getSecurityToken(symbol);
        expect(symbolAddress).not.be.eq(AddressZero);

        expect(result).to.emit(contract, "OrderExecuted")
            .withArgs(userAddress, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, serviceFee, aUsdBalance, spender);
        expect(result).to.emit(contract, "TokenCreated")
            .withArgs(symbolAddress, symbol);
        expect(aUsdContract.setBalance).to.be.calledWith(userAddress, aUsdBalance, OrderExecuted);
    })

    it("should execute order, with side = init, user already has this symbol amount, should fail", async () => {
        let symbol = 'abc';
        let tsl = getBigNumber(10);
        let filledQty = getBigNumber(3);
        let filledAvgPrice = getBigNumber(10);
        let side = 'buy';
        let filledAt = new Date().getTime();
        let aUsdBalance = getBigNumber(100);
        let spender = wallet3.address;
        let symbolAddressZero = await contract.getSecurityToken(symbol);
        expect(symbolAddressZero).eq(AddressZero);

        let result = await ownerContract.orderExecuted(userAddress, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, aUsdBalance, spender);
        await result.wait();
        await expect(ownerContract.orderExecuted(userAddress, symbol, tsl, filledQty, filledAvgPrice, 'init', filledAt, aUsdBalance, spender))
            .rejectedWith('init cannot be called on existing balance');

    })

    it("should execute 3 orders, first init, then buy, then sell", async () => {
        let symbol = 'abc';
        let filledAvgPrice = getBigNumber(10);
        let filledAt = new Date().getTime();
        let aUsdBalance = getBigNumber(100);
        let spender = wallet3.address;
        let serviceFee = getBigNumber(9, 16);
        let symbolAddressZero = await contract.getSecurityToken(symbol);
        expect(symbolAddressZero).eq(AddressZero);

        let result = await ownerContract.orderExecuted(userAddress, symbol, getBigNumber(10), getBigNumber(10), filledAvgPrice, 'init', filledAt, aUsdBalance, spender);
        await result.wait();
        let result2 = await ownerContract.orderExecuted(userAddress, symbol, getBigNumber(13), getBigNumber(3), filledAvgPrice, 'buy', filledAt, aUsdBalance, spender);
        await result2.wait();
        let result3 = await ownerContract.orderExecuted(userAddress, symbol, getBigNumber(11), getBigNumber(2), filledAvgPrice, 'sell', filledAt, aUsdBalance, spender);
        await result3.wait();

        let symbolAddress = await contract.getSecurityToken(symbol);
        expect(symbolAddress).not.be.eq(AddressZero);

        expect(result).to.emit(contract, "OrderExecuted")
            .withArgs(userAddress, symbol, getBigNumber(10), getBigNumber(10), filledAvgPrice, 'init', filledAt, 0, aUsdBalance, spender);
        expect(result).to.emit(contract, "TokenCreated")
            .withArgs(symbolAddress, symbol);

        expect(result2).to.emit(contract, "OrderExecuted")
            .withArgs(userAddress, symbol, getBigNumber(13), getBigNumber(3), filledAvgPrice, 'buy', filledAt, serviceFee, aUsdBalance, spender);
        expect(result2).to.not.emit(contract, "TokenCreated")

        expect(result3).to.emit(contract, "OrderExecuted")
            .withArgs(userAddress, symbol, getBigNumber(11), getBigNumber(2), filledAvgPrice, 'sell', filledAt, getBigNumber(6, 16), aUsdBalance, spender);
        expect(result3).to.not.emit(contract, "TokenCreated")
    })

    it("try to execute order, but symbol is address zero, should be create new token and add to securityTokens list", async () => {
        let symbol = 'abc';
        let tsl = getBigNumber(10);
        let filledQty = getBigNumber(3);
        let filledAvgPrice = getBigNumber(10);
        let side = 'buy';
        let filledAt = new Date().getTime();
        let aUsdBalance = getBigNumber(100);
        let spender = wallet3.address;
        let serviceFee = getBigNumber(9, 16);
        let symbolAddressZero = await contract.getSecurityToken(symbol);
        expect(symbolAddressZero).eq(AddressZero);

        let result = await ownerContract.orderExecuted(userAddress, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, aUsdBalance, spender);
        let symbolAddress = await contract.getSecurityToken(symbol);
        expect(symbolAddress).not.be.eq(AddressZero);

        expect(result).to.emit(contract, "OrderExecuted")
            .withArgs(userAddress, symbol, tsl, filledQty, filledAvgPrice, side, filledAt, serviceFee, aUsdBalance, spender);
        expect(result).to.emit(contract, "TokenCreated")
            .withArgs(symbolAddress, symbol);
        expect(aUsdContract.setBalance).to.be.calledWith(userAddress, aUsdBalance, OrderExecuted);
    })

    it("Order executed, token exists before orderExecuted is called", async () => {
        let recipient = userAddress;
        let symbol = "ABC";
        let qty = getBigNumber(1000);
        let filledQty = getBigNumber(900)
        let filledAvgPrice = getBigNumber(95)
        let side = 'buy';
        let filledAt = new Date('2022-08-04T12:23').getTime();
        let aUsdBalance = getBigNumber(1000);
        let spender = wallet3.address;
        let serviceFee = getBigNumber(2565, 17);
        let tokenTx = await contract.createToken(symbol);
        let symbolAddress = await contract.getSecurityToken(symbol);

        expect(tokenTx).to.emit(contract, "TokenCreated")
            .withArgs(symbolAddress, symbol);

        let result = await ownerContract.orderExecuted(recipient, symbol, qty, filledQty, filledAvgPrice, side, filledAt, aUsdBalance, spender)

        let securityToken = SecurityToken__factory.connect(symbolAddress, wallet2);

        expect(await securityToken.balanceOf(recipient)).to.be.equal(qty);

        expect(aUsdContract.setBalance).to.be.calledWith(recipient, aUsdBalance, OrderExecuted);
        expect(result).to.emit(contract, "OrderExecuted")
            .withArgs(recipient, symbol, qty, filledQty, filledAvgPrice, side, filledAt, serviceFee, aUsdBalance, spender);

    })


    it("should grant mint and burn role", async () => {
        let grantRoleTx = await ownerContract.grantMintAndBurnRole(wallet2.address);
        let mintAndBurnRole = await ownerContract.MINTER_ROLE();

        expect(grantRoleTx).emit(ownerContract, 'RoleGranted').withArgs(mintAndBurnRole, wallet2.address, owner.address)

        let orderFailTx = contract.orderFailed(wallet2.address, "ABC", 0, 'Error', owner.address);
        expect(orderFailTx).emit(contract, 'OrderFailed');
    })

    it("orderFailed called, does not have role, should be rejected", async () => {
        await expect(contract.orderFailed(wallet2.address, "ABC", 0, 'Error', owner.address))
            .rejectedWith(TestHelper.AccessControlErrorMessage);
    })
    it("orderFailed called, contract paused, should be rejected", async () => {
        await ownerContract.pause()
        await expect(contract.orderFailed(wallet2.address, "ABC", 0, 'Error', owner.address))
            .rejectedWith(TestHelper.PausedErrorMessage);
    })

    it("should grant mint and burn role, then remove it and revert when trying to execute order", async () => {
        await ownerContract.grantMintAndBurnRole(wallet2.address);

        let orderFailTx = await contract.orderFailed(wallet3.address, "ABC", 0, 'Error', owner.address);
        expect(orderFailTx).emit(contract, 'OrderFailed');

        await ownerContract.revokeMintAndBurnRole(wallet2.address);

        await expect(contract.orderExecuted(wallet3.address, "", 0, 0, 0, "buy", 0, 0, AddressZero))
            .rejectedWith('missing role');
    })

    it('should call grantMintAndBurnRole, does not have role, should be rejected', async () => {
        await expect(contract.grantMintAndBurnRole(wallet2.address)).rejectedWith(TestHelper.AccessControlErrorMessage)
    })
    it('should call revokeMintAndBurnRole, does not have role, should be rejected', async () => {
        await expect(contract.revokeMintAndBurnRole(wallet2.address)).rejectedWith(TestHelper.AccessControlErrorMessage)
    })
    it("pause contract", async () => {
        await ownerContract.pause();
        let reason = "Pausable: paused";
        await expect(contract.orderExecuted(AddressZero, "", 0, 0, 0, "buy", 0, 0, AddressZero))
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

    it("try to pause contract but not owner, should be rejected", async () => {
        await TestHelper.pauseContractReject(contract)
    });

    it("try to unpause contract but not owner, should be rejected", async () => {
        await TestHelper.unPauseContractReject(contract)
    });
});