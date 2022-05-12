import {getContractsByNetwork} from "./networks";
import {writeContractAddressesToJs} from './filehelper'
import "@openzeppelin/hardhat-upgrades";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";

export const compileAndDeploy = async function (hre: HardhatRuntimeEnvironment) {
    await hre.run('compile');

    const contractInfo = getContractsByNetwork(hre);

    const kycContract = await deployContract(hre, "KYC", contractInfo.KYC_ADDRESS);
    const aUsdContract = await deployContract(hre, "aUSD", contractInfo.AUSD_ADDRESS);
    const liminalMarketContract = await deployContract(hre, "LiminalMarket", contractInfo.LIMINAL_MARKET_ADDRESS);

    console.log('Grand mint & burn role');
    await liminalMarketContract.grantMintAndBurnRole(contractInfo.liminalBackendAddress);
    await liminalMarketContract.setAddresses(aUsdContract.address, kycContract.address);

    console.log('grantRoleForBalance');
    await aUsdContract.grantRoleForBalance(liminalMarketContract.address);
    console.log('setAddresses');
    await aUsdContract.setLiminalMarketAddress(liminalMarketContract.address);
    //await aUsdContract.setBalance("0x93DA645082493BBd7116fC057c5b9aDfd5363912", BigNumber.from("1000" + "0".repeat(18)));
    //await aUsdContract.setBalance("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", BigNumber.from("1000" + "0".repeat(18)));
    let kycDefenderAddress = '0x7aced305382ac47a901bfda45b9ee6935765708d';
    await kycContract.grantRoleForKyc(kycDefenderAddress);

    await writeContractAddressesToJs(hre, kycContract.address,
        aUsdContract.address, liminalMarketContract.address);
    //await fundLink(hre, liminalContract.address);

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

const getContract = async function (href: HardhatRuntimeEnvironment, contractName: string, address: string) {
    const Contract = await href.ethers.getContractFactory(contractName);
    let contract = await Contract.attach(address);
    return contract;
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
                                       preexistingAddress: string, conArgs?: any[]) {

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

export const setRole = async function (hre: HardhatRuntimeEnvironment) {
    let relayerAddress = "0x7aced305382ac47a901bfda45b9ee6935765708d";

    let aUsdContract = await getContract(hre, "aUSD", "0xD1FCCdC474a3708B44C2F4F5C7De8C34328cD203");
    await aUsdContract.grantRoleForBalance(relayerAddress);

    let kycContract = await getContract(hre, "KYC", "0x0B263ab693FAB0CaA06EbbF33395eD90b6b0bCec");
    await kycContract.grantRoleForKyc(relayerAddress);

    let liminalMarketContract = await getContract(hre, "LiminalMarket", "0xcD5FD1e5A49F474d26c535962C0eb2a680250904");
    await liminalMarketContract.grantMintAndBurnRole(relayerAddress);
}

export const verifyContract = async function(hre : HardhatRuntimeEnvironment, address : string) {
    console.log('verify address:' + address);
    await hre.run("verify:verify", {
            address: address,
        }
    );
}