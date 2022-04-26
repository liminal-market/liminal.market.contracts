import * as fs from 'fs';


export const writeContractAddressesToJs = async function (href: any, kycAddress: string,
	aUsdAddress: string, liminaMarketAddress: string) {

	let networkName = (href.network.name == 'hardhat') ? 'localhost' : href.network.name;
	let constantFile = 'import ContractAddresses from "./ContractAddresses";';
	constantFile += '\n\n\tdefault class ' + networkName + 'ContractAddresses extends ContractAddresses {\n\n';

	constantFile += '\t\tKYC_ADDRESS = "' + kycAddress + '";\n';
	constantFile += '\t\tAUSD_ADDRESS = "' + aUsdAddress + '";\n';
	constantFile += '\t\tLIMINAL_MARKET_ADDRESS = "' + liminaMarketAddress + '";\n';
	constantFile += '\t}';

	await fs.writeFileSync('../liminal.market.web/src/contracts/' + networkName + '-contract-addresses.ts', constantFile, 'utf-8');

	copyAbiFile('LiminalMarket');
	copyAbiFile('aUSD');
	copyAbiFile('SecurityToken');
	copyAbiFile('KYC');

	await copyAbiFileForWeb('LiminalMarket', liminaMarketAddress);

	let content = await fs.readFileSync('../liminal.web.bridge/appsettings.networks.json');
	let json = JSON.parse(content.toString());

	json[networkName].liminaMarketAddress = liminaMarketAddress;
	fs.writeFileSync('../liminal.web.bridge/appsettings.networks.json', JSON.stringify(json));

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