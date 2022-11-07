import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from "ethereum-waffle";

import {Wallet} from 'ethers';
import {FakeContract, smock} from '@defi-wonderland/smock';
import hre, {upgrades} from "hardhat";
import {AUSD, KYC, LiminalMarket, MarketCalendar, SecurityToken} from "../../typechain-types";

describe("SecurityToken", function () {
    const waffle = hre.waffle;
    const expect = chai.expect;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);

    let owner: Wallet, wallet2: Wallet, wallet3: Wallet;
    let ownerContract: SecurityToken;
    let contract: SecurityToken;

    const symbol = 'AAPL';
    const name = "Liminal.market symbol";
    const userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const AddressZero = '0x0000000000000000000000000000000000000000';
    const brokerAccountId = "wfs5w8d2-b250-432c-8s3b-66b0b87addw";
    const OrderSell = 2;
    const OrderExecuted = 3;

    before("compile", async function () {
        await hre.run('compile');
        [owner, wallet2, wallet3] = waffle.provider.getWallets();
    })

    let liminalContract: LiminalMarket;
    let aUsdContract: FakeContract<AUSD>;

    beforeEach(async () => {
        const contractFactory = await hre.ethers.getContractFactory('LiminalMarket');
        liminalContract = await upgrades.deployProxy(contractFactory) as LiminalMarket;
        let kycContract = await smock.fake<KYC>('KYC');
        aUsdContract = await smock.fake<AUSD>('aUSD');
        let marketCalendarContract = await smock.fake<MarketCalendar>("MarketCalendar");
        await liminalContract.setAddresses(aUsdContract.address, kycContract.address, marketCalendarContract.address);

        kycContract.isValid.returns(brokerAccountId);
        marketCalendarContract.isMarketOpen.returns(true);

        await liminalContract.createToken(symbol);
        let securityTokenAddress = (await liminalContract.getSecurityToken(symbol))

        const contractFactory2 = await hre.ethers.getContractFactory('SecurityToken');
        ownerContract = contractFactory2.attach(securityTokenAddress) as unknown as SecurityToken

        //since owner will not normally interact with contract,
        // we switch to wallet2 to simplify testing
        contract = ownerContract.connect(wallet2);
    })

    it("should have correct symbol and name after deployment", async () => {
        expect(await contract.symbol()).equal(symbol);
        expect(await contract.name()).equal(name);
    });

    it("should get balance, should be 0, then setBalance and verify it", async () => {
        let balance = await contract.balanceOf(userAddress);
        expect(balance).equal(0);
        let qty = 100;
        let orderExecutedTx = await liminalContract.orderExecuted(userAddress, symbol, qty, 0, 1, 'buy', 2, 0, 10, AddressZero);

        expect(orderExecutedTx)
            .to.emit(ownerContract, "BalanceSet")
            .withArgs(userAddress, qty, OrderExecuted);

        balance = await contract.balanceOf(userAddress);
        expect(balance).equal(qty);
    })

    it("should set the balance, to decrease the balance of the account", async () => {
        let qty = 1000000;
        let orderExecutedTx = await liminalContract.orderExecuted(userAddress, symbol, qty, 0, 1, 'buy', 2, 0, 10, AddressZero);

        expect(orderExecutedTx)
            .to.emit(ownerContract, "BalanceSet")
            .withArgs(userAddress, qty, OrderExecuted);
        //emit Transfer(address(0), account, amount);
        expect(orderExecutedTx).emit(ownerContract, 'Transfer').withArgs(AddressZero, userAddress, qty);

        let balance = await contract.balanceOf(userAddress);
        expect(balance).equal(qty);

        let qty2 = 233430;
        let orderExecutedTx2 = await liminalContract.orderExecuted(userAddress, symbol, qty2, 0, 1, 'buy', 2, 0, 10, AddressZero);

        expect(orderExecutedTx2)
            .to.emit(ownerContract, "BalanceSet")
            .withArgs(userAddress, qty2, OrderExecuted);
        expect(orderExecutedTx2).emit(ownerContract, 'Transfer').withArgs(userAddress, AddressZero, qty - qty2);

        balance = await contract.balanceOf(userAddress);
        expect(balance).equal(qty2);

    });

    it("should set the balance what it already is, nothing should happen", async () => {
        let qty = 1000000;
        let orderExecutedTx = await liminalContract.orderExecuted(userAddress, symbol, qty, 0, 1, 'buy', 2, 0, 10, AddressZero);

        expect(orderExecutedTx)
            .to.emit(ownerContract, "BalanceSet")
            .withArgs(userAddress, qty, OrderExecuted);

        let balance = await contract.balanceOf(userAddress);
        expect(balance).equal(qty);

        let orderExecutedTx2 = await liminalContract.orderExecuted(userAddress, symbol, qty, 0, 1, 'buy', 2, 0, 10, AddressZero);
        expect(orderExecutedTx2)
            .not.to.emit(ownerContract, "BalanceSet");
        expect(orderExecutedTx2)
            .not.to.emit(ownerContract, "Transfer");
    });

    let setupLiminalContract = async (tsl: number): Promise<[LiminalMarket, FakeContract<AUSD>]> => {

        await liminalContract.orderExecuted(wallet2.address, symbol, tsl, 10, 10, "buy", 122, 0, 1200, AddressZero)

        return [liminalContract, aUsdContract];
    }

    it("should create order for user address, then transfer the token from the address", async () => {
        let qtyToTransfer = 100;
        let tsl = 2000;
        await setupLiminalContract(tsl);

        let transferTx = await contract.transfer(aUsdContract.address, qtyToTransfer);

        expect(transferTx).emit(liminalContract, "SellSecurityToken")
            .withArgs(brokerAccountId, wallet2.address, aUsdContract.address, symbol, qtyToTransfer, liminalContract.address)
        expect(transferTx).emit(contract, 'Transfer').withArgs(wallet2.address, AddressZero, qtyToTransfer);
        expect(transferTx).emit(contract, 'BalanceSet').withArgs(wallet2.address, tsl - qtyToTransfer, OrderSell);

    });

    it("do transfer, quantity is higher then balance, should revert, balance to low to transfer", async () => {
        let qtyToTransfer = 100;

        await setupLiminalContract(1);

        let reason = await liminalContract.QUANTITY_MORE_THEN_BALANCE();
        await expect(contract.transfer(aUsdContract.address, qtyToTransfer))
            .to.rejectedWith(reason);
    })


    it("allowance should be 0", async () => {
        let allowanceTx = await contract.allowance(owner.address, wallet2.address);
        await expect(allowanceTx).to.be.eq(0);
    });

    it("set approve for 100, get allowance, should be 100, then set to 90", async () => {
        let amount = 100;

        let approveTx = await contract.approve(owner.address, amount);
        expect(approveTx)
            .to.emit(contract, 'Approval').withArgs(wallet2.address, owner.address, amount)

        let allowance = await contract.allowance(wallet2.address, owner.address);
        await expect(allowance).to.be.eq(amount);

        amount = 90;
        let approveTx2 = await contract.approve(owner.address, amount);
        expect(approveTx2)
            .to.emit(contract, 'Approval').withArgs(wallet2.address, owner.address, amount)

        allowance = await contract.allowance(wallet2.address, owner.address);
        await expect(allowance).to.be.eq(amount);
    });

    it("transferFrom should be rejected, allowance is missing", async () => {
        await expect(contract.transferFrom(owner.address, wallet3.address, 10)).rejectedWith('insufficient allowance');
    })

    it("should execute transferFrom, first set allowance 100, transfer 20, allowance should be 80", async () => {
        let amount = 100;
        let transferAmount = 20;
        let tsl = 10000;

        await setupLiminalContract(tsl);

        let approveTx = await contract.approve(owner.address, amount);
        expect(approveTx).emit(contract, 'Approval').withArgs(wallet2.address, owner.address, amount)
        let allowance = await contract.allowance(wallet2.address, owner.address);
        await expect(allowance).to.be.eq(amount);

        let transferFromTx = await ownerContract.transferFrom(wallet2.address, aUsdContract.address, transferAmount);

        expect(transferFromTx).emit(contract, 'BalanceSet').withArgs(wallet2.address, tsl - transferAmount, OrderSell);
        expect(transferFromTx).emit(ownerContract, 'Transfer').withArgs(wallet2.address, AddressZero, transferAmount);
        // emit SellSecurityToken(accountId, walletAddress, aUsdAddress, symbol, quantity, spender);
        expect(transferFromTx).emit(liminalContract, 'SellSecurityToken')
            .withArgs(brokerAccountId, wallet2.address, aUsdContract.address, symbol, transferAmount, owner.address);

        allowance = await contract.allowance(wallet2.address, owner.address);
        expect(allowance).eq(amount - transferAmount);

    })

});