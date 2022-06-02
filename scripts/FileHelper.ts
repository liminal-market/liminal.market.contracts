import * as fs from 'fs';
import * as Handlebars from "handlebars";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import ContractAddresses from "./addresses/ContractAddresses";

export default class FileHelper {

	hre : HardhatRuntimeEnvironment;
	constructor(hre : HardhatRuntimeEnvironment) {
		this.hre = hre;
	}

	public async writeContractAddressesToJs(addresses : ContractAddresses) {
		let constantFile = this.getConstantFile('web', addresses)
		await fs.writeFileSync('./scripts/addresses/' + addresses.NetworkName + '-contract-addresses.ts', constantFile, 'utf-8');

		constantFile = this.getConstantFile('contracts', addresses)
		await fs.writeFileSync('../liminal.market.web/src/contracts/' + addresses.NetworkName + '-contract-addresses.ts', constantFile, 'utf-8');

		await this.copyAbiFile('LiminalMarket');
		await this.copyAbiFile('aUSD');
		await this.copyAbiFile('SecurityToken');
		await this.copyAbiFile('KYC');
	}

	public getConstantFile(name : string, addresses : ContractAddresses) {
		let fileContent = fs.readFileSync('./scripts/templates/ContractAddress.' + name + '.handlebars');
		let template = Handlebars.compile(fileContent.toString());
		return template(addresses);
	}

	public async copyAbiFile(name: string) {
		let abiFrom = './artifacts/contracts/' + name + '.sol/' + name + '.json';
		let abiTo = '../liminal.market.web/app/abi/' + name + '.json';
		await fs.copyFile(abiFrom, abiTo, (err: any) => {
			if (err) throw err;
			console.log(abiFrom + ' was copied to ' + abiTo);
		});
	}
}
