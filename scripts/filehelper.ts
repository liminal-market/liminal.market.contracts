import * as fs from 'fs';
import * as Handlebars from "handlebars";


export const writeContractAddressesToJs = async function (href: any, kycAddress: string,
	aUsdAddress: string, liminalMarketAddress: string) {

	let fileContent = fs.readFileSync('./scripts/templates/ContractAddress.handlebars');

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

	await copyAbiFile('LiminalMarket');
	await copyAbiFile('aUSD');
	await copyAbiFile('SecurityToken');
	await copyAbiFile('KYC');
}

const copyAbiFile = async function(name: string) {
	let abiFrom = './artifacts/contracts/' + name + '.sol/' + name + '.json';
	let abiTo = '../liminal.market.web/app/abi/' + name + '.json';
	await fs.copyFile(abiFrom, abiTo, (err: any) => {
		if (err) throw err;
		console.log(abiFrom + ' was copied to ' + abiTo);
	});


}