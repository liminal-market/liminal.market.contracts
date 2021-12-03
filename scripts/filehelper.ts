import * as fs from 'fs';


export const writeContractAddressesToJs = async function (href: any, liminalAddress: string, kycAddress: string,
	aUsdAddress: string, securityFactoryAddress: string, usdcContractAddress: string) {

	let networkName = (href.network.name == 'hardhat') ? 'localhost' : href.network.name;
	let constantFile = 'export const ' + networkName + 'ContractAddresses = function() {\n\n';

	constantFile += '\tthis.KYC_ADDRESS = "' + kycAddress + '";\n';
	constantFile += '\tthis.LIMINAL_ADDRESS = "' + liminalAddress + '";\n';
	constantFile += '\tthis.AUSD_ADDRESS = "' + aUsdAddress + '";\n';
	constantFile += '\tthis.SECURITY_FACTORY_ADDRESS = "' + securityFactoryAddress + '";\n';
	constantFile += '\tthis.SECURITY_TOKEN_OWNER = "' + securityFactoryAddress + '";\n';
	constantFile += '\tthis.USDC_ADDRESS = "' + usdcContractAddress + '";\n';
	constantFile += '}';

	await fs.writeFileSync('../liminal.market.web/app/js/contracts/' + networkName + '-contract-addresses.js', constantFile, 'utf-8');

	copyAbiFile('LiminalExchange');
	copyAbiFile('SecurityFactory');
	copyAbiFile('aUSD');
	copyAbiFile('SecurityToken');
	copyAbiFile('KYC');

	await copyAbiFileForWeb('SecurityFactory', securityFactoryAddress);
	//console.log('constantFile', constantFile);
}


async function copyAbiFileForWeb(name: string, address: string) {
	let abiFrom = './artifacts/contracts/' + name + '.sol/' + name + '.json';
	let abiTo = '../liminal.web.bridge/' + name + '.json';
	fs.copyFile(abiFrom, abiTo, (err: any) => {
		if (err) throw err;
		console.log(abiFrom + ' was copied to ' + abiTo);
	});

	await fs.writeFileSync('../liminal.web.bridge/securityToken.txt', address, 'utf-8');

}
function copyAbiFile(name: string) {
	let abiFrom = './artifacts/contracts/' + name + '.sol/' + name + '.json';
	let abiTo = '../liminal.market.web/app/js/abi/' + name + '.json';
	fs.copyFile(abiFrom, abiTo, (err: any) => {
		if (err) throw err;
		console.log(abiFrom + ' was copied to ' + abiTo);
	});

	let jsonFrom = './artifacts/contracts/' + name + '.sol/' + name + '.json';
	let jsonTo = '../liminal.market.web/src/cloud-functions/abi/' + name + '.json';
	fs.copyFile(jsonFrom, jsonTo, (err: any) => {
		if (err) throw err;
		console.log(jsonFrom + ' was copied to ' + jsonTo);
	});
}