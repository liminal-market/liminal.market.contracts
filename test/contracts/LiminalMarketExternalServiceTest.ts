import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import {FakeContract, smock} from "@defi-wonderland/smock";
import {Wallet} from "ethers";
import {LiminalMarket, LiminalMarketExternalService} from "../../typechain-types";

describe('ServiceContract tests', () => {

    const expect = chai.expect;
    const hre = require("hardhat");
    const waffle = hre.waffle;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);

    let owner: Wallet, wallet2: Wallet, wallet3: Wallet;
    let ownerContract: LiminalMarketExternalService;
    let contract: LiminalMarketExternalService;


    before("before running each test", async () => {
        await hre.run('compile');

        [owner, wallet2, wallet3] = waffle.provider.getWallets();
    })

    beforeEach(async () => {
        await redeployContracts()
    })
    let liminalMarketContract: FakeContract<LiminalMarket>;
    const redeployContracts = async () => {
        liminalMarketContract =  await smock.fake<LiminalMarket>('LiminalMarket');

        const contractFactory = await hre.ethers.getContractFactory('LiminalMarketExternalService');
        ownerContract = await contractFactory.deploy(liminalMarketContract.address)

        //since owner will not normally interact with contract,
        // we switch to wallet2 to simplify testing
        contract = ownerContract.connect(wallet2);
    }

    it('should test buy', async () => {
        await contract.buySecurityToken(wallet3.address, 'AAPL', 100);
        expect(liminalMarketContract.buySecurityToken).to.be.callCount(1);
    })


    it('should test sell', async () => {
        await contract.sellSecurityToken(wallet3.address, 'AAPL', 32);
        expect(liminalMarketContract.sellSecurityToken).to.be.callCount(1);
    })
});