import hre, {upgrades} from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import {FakeContract, smock} from "@defi-wonderland/smock";
import {Wallet} from "ethers";
import {
    AUSD,
    KYC,
    LiminalMarket,
    MarketCalendar,
    SecurityToken,
    ServiceSettings,
    StakingPool
} from "../../typechain-types";
import exp from "constants";


describe("ServiceSettings", () => {

    const waffle = hre.waffle;
    const expect = chai.expect;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);


    let owner: Wallet, wallet2: Wallet, wallet3: Wallet, wallet4 : Wallet;
    let ownerContract: StakingPool;
    let contract: StakingPool;

    let liminalContract: LiminalMarket;
    let aUsdContract: AUSD;
    let serviceSettingsContract : ServiceSettings;

    let kycContract: FakeContract<KYC>;
    let marketCalendarContract: FakeContract<MarketCalendar>;

    const brokerAccountId = "wfs5w8d2-b250-432c-8s3b-66b0b87addw";
    const serviceAddress = "0x172A9DA328BC71f4354f4f17Db5630552cC9420d";



    before("compile", async function () {
        await hre.run('compile');
        [owner, wallet2, wallet3, wallet4] = waffle.provider.getWallets();
    })

    beforeEach(async () => {
        const contractFactory = await hre.ethers.getContractFactory('StakingPool');
        ownerContract = await upgrades.deployProxy(contractFactory) as StakingPool;

        const liminalMarketFactory = await hre.ethers.getContractFactory('LiminalMarket');
        liminalContract = await upgrades.deployProxy(liminalMarketFactory) as LiminalMarket;

        const aUsdFactory = await hre.ethers.getContractFactory('aUSD');
        aUsdContract = await upgrades.deployProxy(aUsdFactory) as AUSD;
        await aUsdContract.grantRoleForBalance(liminalContract.address);

        const serviceSettingsFactory = await hre.ethers.getContractFactory('ServiceSettings');
        serviceSettingsContract = await upgrades.deployProxy(serviceSettingsFactory) as ServiceSettings;

        await ownerContract.setAddresses(liminalContract.address, serviceSettingsContract.address);

        kycContract = await smock.fake<KYC>('KYC');
        marketCalendarContract = await smock.fake<MarketCalendar>("MarketCalendar");

        await liminalContract.setAddresses(aUsdContract.address, kycContract.address, marketCalendarContract.address, ownerContract.address);

        kycContract.isValid.returns(brokerAccountId);
        marketCalendarContract.isMarketOpen.returns(true);

        //since owner will not normally interact with contract,
        // we switch to wallet2 to simplify testing
        contract = ownerContract.connect(wallet2);
    })

    it('try to stake a symbol', async () => {
        let symbol = 'AAPL';
        let tsl = 100;
        let stakeQty = 50;

        //create contract, where smart contract that will call staking service has the wallet4 address.
        let serviceContract = serviceSettingsContract.connect(wallet4);
        let createContractTx = await serviceContract.createContract(wallet2.address, 'AAVESecurities', 'aave.com');
        expect(createContractTx).emit(serviceContract, 'ServiceContractCreated').withArgs(wallet4.address, wallet2.address, 'AAVESecurities', 'aave.com');
console.log('contract created');
        //buy 100 of symbol
        await liminalContract.orderExecuted(wallet3.address, symbol,
            tsl, tsl, 10, 'buy',
            12, 0, 100, owner.address);

        let securityTokenAddress = await liminalContract.getSecurityToken(symbol);
        const securityTokenFactory = await hre.ethers.getContractFactory('SecurityToken');
        let securityTokenContract = securityTokenFactory.attach(securityTokenAddress);
        let wallet3SecurityTokenContract = securityTokenContract.connect(wallet3);
        await wallet3SecurityTokenContract.approve(wallet2.address, stakeQty);


        //let's stake 50 of those
        let tx = await contract.stakeSecurityToken(wallet3.address, symbol, stakeQty);

        expect(tx).emit(contract, 'Staked').withArgs(wallet3.address, symbol, stakeQty, wallet2.address);

        let stakeInfo = await contract.getStakedInfo(wallet3.address, symbol);
        expect(stakeInfo.quantity).eq(stakeQty);
        expect(stakeInfo.status).eq(0);
        expect(stakeInfo.service).eq(wallet2.address);

        let canSell = await contract.canSellSymbol(wallet3.address, symbol, 750, 50);
        expect(canSell).true;

        let canSell2 = await contract.canSellSymbol(wallet3.address, symbol, 100, 50);
        expect(canSell2).true;

        let canSell3 = await contract.canSellSymbol(wallet3.address, symbol, 75, 50);
        expect(canSell3).false;

        let canSell4 = await contract.canSellSymbol(wallet3.address, symbol, 100, 51);
        expect(canSell4).false;

        let canSell5 = await contract.canSellSymbol(wallet3.address, symbol, 100, 49);
        expect(canSell5).true;

    })
});