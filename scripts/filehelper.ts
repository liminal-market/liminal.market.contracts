import * as fs from 'fs';
import * as Handlebars from "handlebars";


export const writeContractAddressesToJs = async function (href: any, kycAddress: string,
	aUsdAddress: string, liminalMarketAddress: string) {

	let fileContent = fs.readFileSync('./scripts/templates/ContractAddress.template');

	let networkName = (href.network.name == 'hardhat') ? 'localhost' : href.network.name;
	let obj = {
		networkName	: networkName,
		KYC_ADDRESS : kycAddress,
		AUSD_ADDRESS : aUsdAddress,
		LIMINAL_MARKET_ADDRESS : liminalMarketAddress
	};

	let template = Handlebars.compile(fileContent.toString());
	let constantFile = template(obj);

	await fs.writeFileSync('../liminal.market.web/src/contracts/' + networkName + '-contract-addresses.ts', constantFile, 'utf-8');
	await fs.writeFileSync('./scripts/addresses/' + networkName + '-contract-addresses.ts', constantFile, 'utf-8');

	copyAbiFile('LiminalMarket');
	copyAbiFile('aUSD');
	copyAbiFile('SecurityToken');
	copyAbiFile('KYC');
}

function copyAbiFile(name: string) {
	let abiFrom = './artifacts/contracts/' + name + '.sol/' + name + '.json';
	let abiTo = '../liminal.market.web/app/js/abi/' + name + '.json';
	fs.copyFile(abiFrom, abiTo, (err: any) => {
		if (err) throw err;
		console.log(abiFrom + ' was copied to ' + abiTo);
	});


}