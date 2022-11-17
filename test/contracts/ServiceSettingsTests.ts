import hre, {upgrades} from "hardhat";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {solidity} from "ethereum-waffle";
import {smock} from "@defi-wonderland/smock";
import {Wallet} from "ethers";
import {SecurityToken, ServiceSettings} from "../../typechain-types";


describe("ServiceSettings", () => {

    const waffle = hre.waffle;
    const expect = chai.expect;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);


    let owner: Wallet, wallet2: Wallet, wallet3: Wallet;
    let ownerContract: ServiceSettings;
    let contract: ServiceSettings;

    before("compile", async function () {
        await hre.run('compile');
        [owner, wallet2, wallet3] = waffle.provider.getWallets();
    })


    beforeEach(async () => {
        const contractFactory = await hre.ethers.getContractFactory('ServiceSettings');
        ownerContract = await upgrades.deployProxy(contractFactory) as ServiceSettings;

        //since owner will not normally interact with contract,
        // we switch to wallet2 to simplify testing
        contract = ownerContract.connect(wallet2);
    })

    it('should test creating new contract and then get serviceAddress', async () => {
        let serviceAddress = "0x172A9DA328BC71f4354f4f17Db5630552cC9420d";
        let name ="AAVESecurities";
        let url = 'aave.com';
        let tx = await contract.createContract(serviceAddress, name, url)

        expect(tx).emit(contract, 'ServiceContractCreated').withArgs(wallet2.address, serviceAddress, name, url);

        let signerAddress = await contract.getService(serviceAddress);
        expect(signerAddress).eq(wallet2.address);
    })
});