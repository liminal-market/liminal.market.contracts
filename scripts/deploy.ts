import {getContractsByNetwork} from "./networks";
import {writeContractAddressesToJs} from './filehelper'
import "@openzeppelin/hardhat-upgrades";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import { KYC, LiminalMarket} from "../typechain-types";
import ContractAddresses from "./addresses/ContractAddresses";

export const compile = async function(hre: HardhatRuntimeEnvironment) {
    await hre.run('compile');
}

export const compileAndDeploy = async function (hre: HardhatRuntimeEnvironment) {
    await hre.run('compile');

    const contractInfo = getContractsByNetwork(hre);

    const kycContract = await deployContract(hre, "KYC", contractInfo.KYC_ADDRESS);
    const aUsdContract = await deployContract(hre, "aUSD", contractInfo.AUSD_ADDRESS);
    const liminalMarketContract = await deployContract(hre, "LiminalMarket", contractInfo.LIMINAL_MARKET_ADDRESS);

    await writeContractAddressesToJs(hre, kycContract.address,
        aUsdContract.address, liminalMarketContract.address);

    console.log('setAddresses');
    await liminalMarketContract.setAddresses(aUsdContract.address, kycContract.address);
    await aUsdContract.setLiminalMarketAddress(liminalMarketContract.address);

    console.log('grantRoleForBalance');
    await grantRoles(hre, contractInfo);

    await verifyContract(hre, kycContract.address)
    await verifyContract(hre, aUsdContract.address)
    await verifyContract(hre, liminalMarketContract.address)


    console.log('done:' + new Date());
}

export const compileAndUpgradeLiminalMarket = async function (hre: HardhatRuntimeEnvironment) {
    const contractInfo = getContractsByNetwork(hre);
    const contract = await compileAndUpgrade(hre, "LiminalMarket", contractInfo.LIMINAL_MARKET_ADDRESS);

    await writeContractAddressesToJs(hre, contractInfo.KYC_ADDRESS,
        contractInfo.AUSD_ADDRESS, contract.address);
}
export const compileAndUpgradeKYC = async function (hre: HardhatRuntimeEnvironment) {
    const contractInfo = getContractsByNetwork(hre);
    const contract = await compileAndUpgrade(hre, "KYC", contractInfo.KYC_ADDRESS);

    await writeContractAddressesToJs(hre, contract.address,
        contractInfo.AUSD_ADDRESS, contractInfo.LIMINAL_MARKET_ADDRESS);
}
export const compileAndUpgradeAUSD = async function (hre: HardhatRuntimeEnvironment) {
    const contractInfo = getContractsByNetwork(hre);
    const contract = await compileAndUpgrade(hre, "aUSD", contractInfo.AUSD_ADDRESS);

    await writeContractAddressesToJs(hre, contractInfo.KYC_ADDRESS,
        contract.address, contractInfo.LIMINAL_MARKET_ADDRESS);
}
export const compileAndUpgradeAll = async function (hre: HardhatRuntimeEnvironment) {
    const contractInfo = getContractsByNetwork(hre);
    const kycContract = await compileAndUpgrade(hre, "KYC", contractInfo.KYC_ADDRESS);
    const aUsdContracct = await compileAndUpgrade(hre, "aUSD", contractInfo.AUSD_ADDRESS);
    const liminalContract = await compileAndUpgrade(hre, "LiminalMarket", contractInfo.LIMINAL_MARKET_ADDRESS);

    await writeContractAddressesToJs(hre, kycContract.address,
        aUsdContracct.address, liminalContract.address);


}
const compileAndUpgrade = async function (href: HardhatRuntimeEnvironment, contractName: string, preexistingAddress: string) {

    const Contract = await href.ethers.getContractFactory(contractName);
    let contract;

    contract = await href.upgrades.upgradeProxy(preexistingAddress, Contract);

    console.log(contractName + " upgraded address:", contract.address);

    return contract;
}

export const getContract = async function (href: HardhatRuntimeEnvironment, contractName: string, address: string) {
    const Contract = await href.ethers.getContractFactory(contractName);
    return Contract.attach(address);
}

export async function grantRoles(hre: HardhatRuntimeEnvironment, contractInfo : ContractAddresses) {
    let liminalMarketContract = await getContract(hre, "LiminalMarket",
        contractInfo.LIMINAL_MARKET_ADDRESS);
    let relayerAddress = contractInfo.getRelayerAddress();

    console.log('grant relayerAddress:' + relayerAddress + " to Liminal.market");
    await liminalMarketContract.grantMintAndBurnRole(relayerAddress);

    let aUsdContract = await getContract(hre, "aUSD", contractInfo.AUSD_ADDRESS);

    console.log('grant liminalAddress:' + liminalMarketContract.address + " to aUSD");
    await aUsdContract.grantRoleForBalance(liminalMarketContract.address);
    console.log('grant relayerAddress:' + relayerAddress + " to aUSD");
    await aUsdContract.grantRoleForBalance(relayerAddress);

    let kycContract = await getContract(hre, "KYC", contractInfo.KYC_ADDRESS);
    console.log('grant relayerAddress:' + relayerAddress + " to KYC");
    await kycContract.grantRoleForKyc(relayerAddress);

}


const contractExistsOnChain = async function (hre: HardhatRuntimeEnvironment, contractName: string, address: string)
    : Promise<boolean> {
    let contract = await getContract(hre, contractName, address)
    try {
        await contract.deployed()
        return true;
    } catch (e: any) {
        return false;
    }
}

const deployContract = async function (hre: HardhatRuntimeEnvironment, contractName: string,
                                       preexistingAddress: string) {

    const Contract = await hre.ethers.getContractFactory(contractName);

    let contract;
    let status = 'deployed';
    let upgrade = await contractExistsOnChain(hre, contractName, preexistingAddress);
    if (upgrade) {
        contract = await hre.upgrades.upgradeProxy(preexistingAddress, Contract);
        status = 'upgraded';
    } else {
        contract = await hre.upgrades.deployProxy(Contract);
    }

    await contract.deployed();
    console.log(contractName + " " + status + ":", contract.address);


    return contract;
}

export const verifyContract = async function(hre : HardhatRuntimeEnvironment, proxyAddress : string) {
    console.log(hre.network.name);

    const address = await getImplementationAddress(hre.network.provider, proxyAddress);

    console.log('verify address:' + address);
   await hre.run("verify:verify", {
            address: address,
        }
    );
}