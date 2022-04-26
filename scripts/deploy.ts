import { getContractsByNetwork } from "./networks";
import { writeContractAddressesToJs } from './filehelper'


export const compileAndDeploy = async function (hre: any) {
	await hre.run('compile');

	const contractInfo = getContractsByNetwork(hre);

	const kycContract = await deployContract(hre, "KYC", contractInfo.KYC_ADDRESS);
	const aUsdContract = await deployContract(hre, "aUSD", contractInfo.AUSD_ADDRESS);
	const liminaMarketContract = await deployContract(hre, "LiminalMarket",
		contractInfo.LIMINAL_MARKET_ADDRESS,
		[aUsdContract.address, kycContract.address]);

	console.log('Grand mint & burn role');
	await liminaMarketContract.grantMintAndBurnRole(contractInfo.liminalBackendAddress);
	await liminaMarketContract.setAddresses(aUsdContract.address, kycContract.address);

	console.log('grantRoleForBalance');
	await aUsdContract.grantRoleForBalance(liminaMarketContract.address);
	console.log('setAddresses');
	await aUsdContract.setAddresses(liminaMarketContract.address);
	//await aUsdContract.setBalance("0x93DA645082493BBd7116fC057c5b9aDfd5363912", BigNumber.from("1000" + "0".repeat(18)));
	//await aUsdContract.setBalance("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", BigNumber.from("1000" + "0".repeat(18)));

	await writeContractAddressesToJs(hre, kycContract.address,
		aUsdContract.address, liminaMarketContract.address);
	//await fundLink(hre, liminalContract.address);

	console.log('done:' + new Date());
}

export const compileAndUpgradeLiminalMarket = async function(hre : any) {
	const contractInfo = getContractsByNetwork(hre);
	const contract = await compileAndUpgrade(hre, "LiminalMarket", contractInfo.LIMINAL_MARKET_ADDRESS);

	await writeContractAddressesToJs(hre, contractInfo.KYC_ADDRESS,
		contractInfo.AUSD_ADDRESS, contract.address);
}
export const compileAndUpgradeKYC = async function (hre: any) {
	const contractInfo = getContractsByNetwork(hre);
	const contract = await compileAndUpgrade(hre, "KYC", contractInfo.KYC_ADDRESS);

	await writeContractAddressesToJs(hre, contract.address,
		contractInfo.AUSD_ADDRESS, contractInfo.LIMINAL_MARKET_ADDRESS);
}
export const compileAndUpgradeAUSD = async function (hre: any) {
	const contractInfo = getContractsByNetwork(hre);
	const contract = await compileAndUpgrade(hre, "aUSD", contractInfo.AUSD_ADDRESS);

	await writeContractAddressesToJs(hre, contractInfo.KYC_ADDRESS,
		contract.address, contractInfo.LIMINAL_MARKET_ADDRESS);
}
export const compileAndUpgradeAll = async function (hre: any) {
	const contractInfo = getContractsByNetwork(hre);
	const kycContract = await compileAndUpgrade(hre, "KYC", contractInfo.KYC_ADDRESS);
	const aUsdContracct = await compileAndUpgrade(hre, "aUSD", contractInfo.AUSD_ADDRESS);
	const liminalContract = await compileAndUpgrade(hre, "LiminalMarket", contractInfo.LIMINAL_MARKET_ADDRESS);

	await writeContractAddressesToJs(hre, kycContract.address,
		aUsdContracct.address, liminalContract.address);


}
const compileAndUpgrade = async function (href: any, contractName: string, preexistingAddress: string) {

	const Contract = await href.ethers.getContractFactory(contractName);
	let contract;

	contract = await href.upgrades.upgradeProxy(preexistingAddress, Contract);

	console.log(contractName + " upgraded address:", contract.address);

	return contract;
}

const getContract = async function(href: any, contractName : string, address : string) {
	const Contract = await href.ethers.getContractFactory(contractName);
	return Contract.attach(address);
}

const deployContract = async function (href: any, contractName: string,
				preexistingAddress: string, conArgs?: any[]) {

	const Contract = await href.ethers.getContractFactory(contractName);

	let contract;


	if (conArgs != null) {
		let [...args] = Array.prototype.slice.call(conArgs);
		contract = await href.upgrades.deployProxy(Contract, ...args);
	} else {
		contract = await href.upgrades.deployProxy(Contract);
	}
	await contract.deployed();
	console.log(contractName + " deployed:", contract.address);

	return contract;
}