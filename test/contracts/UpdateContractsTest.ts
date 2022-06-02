import chai from 'chai';
import hre, {upgrades, waffle} from "hardhat";
import {AUSD } from "../../typechain-types";
import {Wallet} from "ethers";
import {expect} from "chai";
import {smock} from "@defi-wonderland/smock";
import {solidity} from "ethereum-waffle";
import chaiAsPromised from "chai-as-promised";
import {getImplementationAddress} from "@openzeppelin/upgrades-core";
import * as fs from "fs";

describe('Tests if upgrading contracts are working', function () {
    let owner: Wallet, wallet2: Wallet, wallet3: Wallet;
    chai.should();
    chai.use(chaiAsPromised);
    chai.use(solidity);
    chai.use(smock.matchers);

    [owner, wallet2, wallet3] = waffle.provider.getWallets();
    before("before running each test", async function () {
        await hre.run('compile');
    });

    const copyImplementation = async (name : string) => {
        await fs.readFile('./contracts/' + name + '.sol', 'utf-8', function (err, contents) {
            if (err) {
                console.log(err);
                return;
            }
            const replaced = contents.replace('contract ' + name, 'contract ' + name + 'v2');

            fs.writeFile('./contracts/' + name + 'v2.sol', replaced, 'utf-8', function (err) {
                console.log(err);
            });
        });
    }

    it("Upgrade aUSD", async () => {
        await copyImplementation('aUSD');
        await hre.run('compile');

        const contractFactory = await hre.ethers.getContractFactory('aUSD');
        let contract = await upgrades.deployProxy(contractFactory) as AUSD;
        await contract.deployed();
        let firstImplementationAddress = await getImplementationAddress(hre.network.provider, contract.address);
        console.log('firstImplementationAddress:', firstImplementationAddress);

        expect(await contract.grantRoleForBalance(wallet2.address))
            .to.emit(contract, "RoleGranted")
            .withArgs(contract.SET_BALANCE, wallet2.address, owner.address);

        await contract.setBalance(wallet3.address, 100);

        const contractFactory2 = await hre.ethers.getContractFactory('aUSDv2');
        let contract2 = await upgrades.upgradeProxy(contract.address, contractFactory2);

        let secondImplementationAddress = await getImplementationAddress(hre.network.provider, contract2.address);

        expect(firstImplementationAddress).not.to.be.equal(secondImplementationAddress);

        let hasRole = await contract2.hasRole(await contract2.SET_BALANCE(), wallet2.address);
        expect(hasRole).to.be.true;

        let balance = await contract2.balanceOf(wallet3.address);
        expect(balance).to.be.equal(100);

        fs.rm('./contracts/aUSDv2.sol', () => {});
    })

    it("Upgrade KYC", async () => {
        await copyImplementation('KYC');
        await hre.run('compile');

        const contractFactory = await hre.ethers.getContractFactory('aUSD');
        let contract = await upgrades.deployProxy(contractFactory) as AUSD;
        await contract.deployed();
        let firstImplementationAddress = await getImplementationAddress(hre.network.provider, contract.address);
        console.log('firstImplementationAddress:', firstImplementationAddress);

        expect(await contract.grantRoleForBalance(wallet2.address))
            .to.emit(contract, "RoleGranted")
            .withArgs(contract.SET_BALANCE, wallet2.address, owner.address);

        await contract.setBalance(wallet3.address, 100);

        const contractFactory2 = await hre.ethers.getContractFactory('aUSDv2');
        let contract2 = await upgrades.upgradeProxy(contract.address, contractFactory2);

        let secondImplementationAddress = await getImplementationAddress(hre.network.provider, contract2.address);

        expect(firstImplementationAddress).not.to.be.equal(secondImplementationAddress);

        let hasRole = await contract2.hasRole(await contract2.SET_BALANCE(), wallet2.address);
        expect(hasRole).to.be.true;

        let balance = await contract2.balanceOf(wallet3.address);
        expect(balance).to.be.equal(100);

        fs.rm('./contracts/aUSDv2.sol', () => {});
    })

});