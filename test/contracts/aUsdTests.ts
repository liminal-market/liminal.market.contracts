import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from "ethereum-waffle";
import {Wallet} from 'ethers';
import hre, {upgrades} from "hardhat";
import {AUSD, KYC, LiminalMarket, LM, MarketCalendar, ServiceContract} from "../../typechain-types";
import {FakeContract, smock} from '@defi-wonderland/smock';
import exp from "constants";
import TestHelper from "../TestHelper";

describe("aUsd", () => {
    const expect = chai.expect;
    const hre = require("hardhat");
    const waffle = hre.waffle;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);

    let owner: Wallet, wallet2: Wallet, wallet3: Wallet;
    let ownerContract: AUSD;
    let contract: AUSD;
    let liminalContract: LiminalMarket;
    let kycContract: FakeContract<KYC>;
    let marketCalendarContract: FakeContract<MarketCalendar>;
    let lmContract : LM;
    let serviceContract : ServiceContract;

    const AddressZero = '0x0000000000000000000000000000000000000000';
    let tokenAddress = '';
    let symbol = 'ABC';
    const brokerAccountId = "wfs5w8d2-b250-432c-8s0b-66b0b87addw";
    const lmServiceFeeAddress = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';
    const Fund = 0;
    const OrderBuy = 1;

    before("before running each test", async () => {
        await hre.run('compile');

        [owner, wallet2, wallet3] = waffle.provider.getWallets();
    })

    beforeEach(async () => {
        await redeployContracts()
    })

    const redeployContracts = async () => {
        const contractFactory = await hre.ethers.getContractFactory('aUSD');
        ownerContract = await upgrades.deployProxy(contractFactory) as AUSD;

        kycContract = await smock.fake<KYC>('KYC');
        marketCalendarContract = await smock.fake<MarketCalendar>("MarketCalendar");

        const liminalMarketFactory = await hre.ethers.getContractFactory('LiminalMarket');
        liminalContract = await upgrades.deployProxy(liminalMarketFactory) as LiminalMarket;

        const lmFactory = await hre.ethers.getContractFactory('LM');
        lmContract = await upgrades.deployProxy(lmFactory) as LM;

        const serviceContractFactory = await hre.ethers.getContractFactory('ServiceContract');
        serviceContract = await upgrades.deployProxy(serviceContractFactory) as ServiceContract;


        await initContracts();

        //since owner will not normally interact with contract,
        // we switch to wallet2 to simplify testing
        contract = ownerContract.connect(wallet2);
    }

    const initContracts = async () => {
        kycContract.isValid.returns(brokerAccountId);
        marketCalendarContract.isMarketOpen.returns(true);

        await liminalContract.setAddresses(ownerContract.address, kycContract.address, marketCalendarContract.address, lmContract.address);
        await ownerContract.setLiminalMarketAddress(liminalContract.address);
        await ownerContract.grantRoleForBalance(liminalContract.address);

        await lmContract.setServiceContractAddress(serviceContract.address);
        await lmContract.grantServiceFeeRole(liminalContract.address);


        await serviceContract.setLMServiceFeeAddress(TestHelper.LMServiceFeeAddress);
        await serviceContract.createContract(wallet3.address, wallet3.address, 100, "DeFi Service", "https://defi.com")
        await serviceContract.createContract(liminalContract.address, wallet3.address, 0, "Liminal.market Service", "https://liminal.market")

        await liminalContract.createToken(symbol);
        tokenAddress = await liminalContract.getSecurityToken(symbol);
    }

    let fundAccount = async (amount: number) => {
        return await ownerContract.setBalance(wallet2.address, amount, Fund);
    }
    let mintLMToWallet = async (amount: number) => {
        return await lmContract.mint(wallet2.address, amount);
    }

    it('should call initialize, should be rejected', async () => {
        await TestHelper.initializeRejected(ownerContract);
    })

    it('should try to setLiminalMarket address, does not have role, should be rejected', async () => {
        await expect(contract.setLiminalMarketAddress(wallet2.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
    })
    it('should try to grantRoleForBalance, does not have role, should be rejected', async () => {
        await expect(contract.grantRoleForBalance(wallet2.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
    })
    it('should try to revokeRoleForBalance, does not have role, should be rejected', async () => {
        await expect(contract.revokeRoleForBalance(wallet2.address)).rejectedWith(TestHelper.AccessControlErrorMessage);
    })

    it('Call transfer, user does not have LM token to pay for service fee, should revert', async () => {
        let fund = 150 * 10**5;
        let amount = 12 * 10**5;

        let fundResult = await fundAccount(fund);
        expect(fundResult).emit(ownerContract, 'BalanceSet').withArgs(wallet2.address, fund, Fund);

        await expect(contract.transfer(tokenAddress, amount))
            .rejectedWith(await lmContract.NOT_ENOUGH_FOR_SERVICE_FEE())

    })

    it('Call transfer method, should call buyWithAUsd on LiminalMarket contract', async () => {
        let fund = 150 * 10**5;
        let amount = 12 * 10**5;

        let fundResult = await fundAccount(fund);

        expect(fundResult).emit(ownerContract, 'BalanceSet').withArgs(wallet2.address, fund, Fund);

        await mintLMToWallet(100 * 10**5);

        let result = await contract.transfer(tokenAddress, amount);
        let balance = await contract.balanceOf(wallet2.address);

        expect(balance).eq(fund - amount)
        expect(result).emit(contract, 'Transfer').withArgs(wallet2.address, AddressZero, amount);
        expect(result).emit(liminalContract, 'BuyWithAUsd').withArgs(wallet2.address, amount, brokerAccountId, symbol, tokenAddress, liminalContract.address)
        expect(result).emit(contract, 'BalanceSet').withArgs(wallet2.address, balance, OrderBuy)
    })

    it('should fund account, then transfer all, balance should be 0', async () => {
        let fund = 34322;
        let amount = fund;

        await fundAccount(fund);
        await mintLMToWallet(100);

        await contract.transfer(tokenAddress, amount);
        let balance = await contract.balanceOf(wallet2.address);

        expect(balance).eq(0);

    })

    it("try to buy with aUSD, but token address is NOT liminal.market token, should revert", async () => {
        let fund = 200;
        let amount = 100;
        let invalidTokenAddress = wallet3.address;

        await fundAccount(fund);

        let contractW2 = ownerContract.connect(wallet2);

        await expect(contractW2.transfer(invalidTokenAddress, amount))
            .rejectedWith("unexpected amount of data")

    })

    it("try to buy, but doesn't have enough aUSD, should revert", async () => {
        let fund = 10;
        let amount = 100;

        await fundAccount(fund);

        await expect(contract.transfer(tokenAddress, amount))
            .rejectedWith("You don't have enough aUSD");
    })

    it("try to buy, market is closed, should revert", async () => {
        let fund = 110;
        let amount = 100;
        marketCalendarContract.isMarketOpen.returns(false);

        await fundAccount(fund);

        let reason = await liminalContract.MARKET_CLOSED();
        await expect(contract.transfer(tokenAddress, amount))
            .rejectedWith(reason);
    })


    it("Check balance of new deployment", async () => {
        let balanceOf = await contract.balanceOf(owner.address);
        expect(balanceOf).to.equal(0);
    });


    it("set balance to wallet, then set same balance, BalanceSet event should only happen once", async () => {
        let amount = 19456879;

        let result = await fundAccount(amount);
        expect(result).emit(ownerContract, "BalanceSet").withArgs(wallet2.address, amount, Fund);

        let balance = await contract.balanceOf(wallet2.address);
        expect(balance).to.be.equal(amount);

        let secondFunding = await fundAccount(amount);
        expect(secondFunding).not.emit(ownerContract, "BalanceSet");
    });

    it("set different balances to same wallet", async () => {
        let amount1 = 199;
        let amount2 = 3888;
        let amount3 = 23;

        let fund1 = await fundAccount(amount1);
        expect(fund1).emit(ownerContract, "BalanceSet").withArgs(wallet2.address, amount1, Fund);

        let balance1 = await ownerContract.balanceOf(wallet2.address);
        expect(balance1).to.be.equal(amount1);

        let fund2 = await fundAccount(amount2);
        expect(fund2).emit(ownerContract, "BalanceSet").withArgs(wallet2.address, amount2, Fund);

        let balance2 = await ownerContract.balanceOf(wallet2.address);
        expect(balance2).to.be.equal(amount2);

        let fund3 = await fundAccount(amount3);
        expect(fund3).emit(ownerContract, "BalanceSet").withArgs(wallet2.address, amount3, Fund);

        let balance3 = await ownerContract.balanceOf(wallet2.address);
        expect(balance3).to.be.equal(amount3);

    });

    it("grant role, connect new wallet, set balance to wallet", async () => {
        let amount = 235;
        let roleSetBalance = await ownerContract.SET_BALANCE();

        let grantRoleTx = await ownerContract.grantRoleForBalance(wallet3.address);

        let contractW3 = ownerContract.connect(wallet3);
        let setBalanceTx = await contractW3.setBalance(wallet2.address, amount, Fund);
        let balance = await ownerContract.balanceOf(wallet2.address);

        expect(balance).to.be.equal(amount);
        expect(grantRoleTx).emit(ownerContract, 'RoleGranted').withArgs(roleSetBalance, wallet3.address, owner.address)
        expect(setBalanceTx).emit(contractW3, 'BalanceSet').withArgs(wallet2.address, amount, Fund);
    });

    it("grant role, connect new wallet, set balance to wallet, then remove role and try again, should be revered", async () => {
        let amount = 4678;
        let roleSetBalance = await ownerContract.SET_BALANCE();

        let grantRoleTx = await ownerContract.grantRoleForBalance(wallet3.address);

        let contractW3 = ownerContract.connect(wallet3);
        let setBalanceTx = await contractW3.setBalance(wallet2.address, amount, Fund);
        let balance = await ownerContract.balanceOf(wallet2.address);
        let revokeTx = await ownerContract.revokeRoleForBalance(wallet3.address);
        let setBalanceReject = contractW3.setBalance(wallet2.address, 555, Fund);

        expect(balance).to.be.equal(amount);
        expect(grantRoleTx).emit(ownerContract, 'RoleGranted').withArgs(roleSetBalance, wallet3.address, owner.address)
        expect(setBalanceTx).emit(contractW3, 'BalanceSet').withArgs(wallet2.address, amount, Fund);

        expect(revokeTx)
            .to.emit(ownerContract, "RoleRevoked")
            .withArgs(roleSetBalance, wallet3.address, owner.address);

        expect(setBalanceReject).to.be.rejected;
    });

    it("Try to set balance with wallet that doesnt have permission, should fail", async () => {
        let contractW3 = ownerContract.connect(wallet3);
        let setBalanceTx = contractW3.setBalance(wallet2.address, 199, Fund);
        await expect(setBalanceTx).to.be.rejected;
    });

    it("allowance should be 0", async () => {
        let allowanceTx = await ownerContract.allowance(owner.address, wallet2.address);

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

    it("Transfer should be rejected, wallet has 0 aUSD, not enough aUsd", async () => {
        let reason = await liminalContract.NOT_ENOUGH_AUSD();
        await expect(ownerContract.transfer(owner.address, 10)).rejectedWith(reason);
    });
    it("Transfer should be rejected, fund 100, try to transfer 101, not enough aUsd", async () => {
        let reason = await liminalContract.NOT_ENOUGH_AUSD();
        await fundAccount(100);
        await expect(ownerContract.transfer(owner.address, 101)).rejectedWith(reason);
    });

    it("approve allowance, retrieve allowance to confirm", async () => {
        let amount = 100;
        let approveTx = await ownerContract.approve(wallet2.address, amount)

        let allowance = await ownerContract.allowance(owner.address, wallet2.address);
        expect(allowance).to.be.eq(amount);

        //emit Approval(owner, spender, amount);
        expect(approveTx).emit(ownerContract, 'Approval').withArgs(owner.address, wallet2.address, amount);
    })

    it("transferFrom should be rejected, allowance is missing", async () => {
        await expect(ownerContract.transferFrom(owner.address, wallet2.address, 10)).rejectedWith('insufficient allowance');
    })

    it("should execute transferFrom, first set allowance 100, transfer 20, allowance should be 80", async () => {
        let allowanceAmount = 100 * 10**5;
        let transferAmount = 20 * 10**5;
        let fundAmount = 500 * 10**5;
        await fundAccount(fundAmount);
        await mintLMToWallet(100 * 10**5)
        await serviceContract.createContract(owner.address, wallet3.address, 0, "Liminal.market Service", "https://liminal.market")

        let approveTx = await contract.approve(owner.address, allowanceAmount);
        expect(approveTx).emit(contract, 'Approval').withArgs(wallet2.address, owner.address, allowanceAmount)

        let allowance = await contract.allowance(wallet2.address, owner.address);
        await expect(allowance).to.be.eq(allowanceAmount);

        let transferFromTx = await ownerContract.transferFrom(wallet2.address, tokenAddress, transferAmount);

        expect(transferFromTx).emit(ownerContract, 'Transfer').withArgs(wallet2.address, AddressZero, transferAmount);
        expect(transferFromTx).emit(liminalContract, 'BuyWithAUsd')
            .withArgs(wallet2.address, transferAmount, brokerAccountId, symbol, tokenAddress, owner.address);
        expect(transferFromTx).emit(ownerContract, 'BalanceSet').withArgs(wallet2.address, fundAmount - transferAmount, OrderBuy);

        allowance = await contract.allowance(wallet2.address, owner.address);
        expect(allowance).eq(allowanceAmount - transferAmount);
    })

    it("Pause contract, try to execute on it", async () => {
        await ownerContract.pause();
        await expect(ownerContract.transfer(wallet2.address, 12)).rejectedWith('paused');
    });

    it("try to pause contract but not owner, should be rejected", async () => {
        await TestHelper.pauseContractReject(contract)
    });

    it("try to unpause contract but not owner, should be rejected", async () => {
        await TestHelper.unPauseContractReject(contract)
    });

    it("Pause contract, try to execute on it, then unpause contract and execute again", async () => {
        let amount = 1244 * 10**5;
        await fundAccount(amount);
        await mintLMToWallet(100 * 10**5);
        await ownerContract.pause();
        await expect(ownerContract.transfer(wallet2.address, 12)).rejectedWith('paused');

        await ownerContract.unpause();

        let transferTx = await contract.transfer(tokenAddress, amount);

        expect(transferTx).emit(contract, 'Transfer').withArgs(wallet2.address, AddressZero, amount);
        expect(transferTx).emit(liminalContract, 'BuyWithAUsd')
            .withArgs(wallet2.address, amount, brokerAccountId, symbol, tokenAddress, liminalContract.address);
        expect(transferTx).emit(contract, 'BalanceSet').withArgs(wallet2.address, 0, OrderBuy);
    });

    it("Pause contract, try to execute all function that are pausable, all should fail", async () => {
        let amount = 84687;

        await fundAccount(amount);

        await ownerContract.pause();
        await expect(ownerContract.setBalance(wallet2.address, 12, Fund)).rejectedWith('paused');
        await expect(contract.transfer(tokenAddress, amount)).rejectedWith('paused');
        await expect(contract.transferFrom(owner.address, tokenAddress, amount)).rejectedWith('paused');
    });
});