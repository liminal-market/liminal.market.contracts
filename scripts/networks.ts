
import localhostContractAddresses from '../../liminal.market.web/src/contracts/localhost-contract-addresses';
import rinkebyContractAddresses from '../../liminal.market.web/src/contracts/rinkeby-contract-addresses';
import mumbaiContractAddresses from '../../liminal.market.web/src/contracts/mumbai-contract-addresses';
import fujiContractAddresses from '../../liminal.market.web/src/contracts/fuji-contract-addresses';

export const getContractsByNetwork = function(hre : any) {

	switch (hre.network.name) {
		case 'localhost':
			return new LocalhostContractInfo();
		case 'rinkeby':
			return new RinkebyhostContractInfo();
		case 'mumbai':
			return new MumbaihostContractInfo();
		case 'fuji':
			return new FujihostContractInfo();
		default:
			return new LocalhostContractInfo();
	}


}

const contractInfos : any = { localhostContractAddresses, rinkebyContractAddresses, mumbaiContractAddresses, fujiContractAddresses  };

export const getContractsInfo = function(networkName : string) {

	const contractInfoType = contractInfos[networkName + 'ContractAddresses'];

	return new contractInfoType();
}
class LocalhostContractInfo {
	liminalUserAdress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

	//constructor parameters
	brokerAddress = '0x566B1014626B67Ca05C5426c04165070168756d5';
	liminalAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
	liminalBackendAddress = '0x90f79bf6eb2c4f870365e785982e1f101e93b906';

	constructor() {
		this.AUSD_ADDRESS = getContractsInfo('localhost').AUSD_ADDRESS;
		this.KYC_ADDRESS = getContractsInfo('localhost').KYC_ADDRESS;
		this.LIMINAL_MARKET_ADDRESS = getContractsInfo('localhost').LIMINAL_MARKET_ADDRESS;
	}

	AUSD_ADDRESS : string;
	KYC_ADDRESS : string;
	LIMINAL_MARKET_ADDRESS : string;
}

class RinkebyhostContractInfo {
	liminalUserAdress = '0x93DA645082493BBd7116fC057c5b9aDfd5363912';

	//constructor parameters
	brokerAddress = '0x566B1014626B67Ca05C5426c04165070168756d5';
	liminalAddress = '0xe552e721062cb1a8343840AeC5026cB7242d67ad'; //'0xe552e721062cb1a8343840AeC5026cB7242d67ad'; //rinkeby
	liminalBackendAddress = '0xa22610E72cF86f3ef1a2A1f34D89f9E5B0EFc0AA'; //'0x90f79bf6eb2c4f870365e785982e1f101e93b906'; local

	constructor() {
		this.AUSD_ADDRESS = getContractsInfo('rinkeby').AUSD_ADDRESS;
		this.KYC_ADDRESS = getContractsInfo('rinkeby').KYC_ADDRESS;
		this.LIMINAL_MARKET_ADDRESS = getContractsInfo('rinkeby').LIMINAL_MARKET_ADDRESS;
	}

	AUSD_ADDRESS : string;
	KYC_ADDRESS : string;
	LIMINAL_MARKET_ADDRESS : string;
}

class MumbaihostContractInfo {
	liminalUserAdress = '0x93DA645082493BBd7116fC057c5b9aDfd5363912'; //'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; hardhat local account

	//constructor parameters
	brokerAddress = '0x566B1014626B67Ca05C5426c04165070168756d5';//'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';- hardhat local accounts
	liminalAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; //'0xe552e721062cb1a8343840AeC5026cB7242d67ad'; //rinkeby
	liminalBackendAddress = '0xa22610E72cF86f3ef1a2A1f34D89f9E5B0EFc0AA'; //'0x90f79bf6eb2c4f870365e785982e1f101e93b906'; local


	constructor() {
		this.AUSD_ADDRESS = getContractsInfo('mumbai').AUSD_ADDRESS;
		this.KYC_ADDRESS = getContractsInfo('mumbai').KYC_ADDRESS;
		this.LIMINAL_MARKET_ADDRESS = getContractsInfo('mumbai').LIMINAL_MARKET_ADDRESS;
	}

	AUSD_ADDRESS : string;
	KYC_ADDRESS : string;
	LIMINAL_MARKET_ADDRESS : string;
}


class FujihostContractInfo {
	liminalUserAdress = '0x93DA645082493BBd7116fC057c5b9aDfd5363912'; //'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; hardhat local account

	//constructor parameters
	brokerAddress = '0x566B1014626B67Ca05C5426c04165070168756d5';//'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';- hardhat local accounts
	liminalAddress = '0xe552e721062cb1a8343840AeC5026cB7242d67ad'; //'0xe552e721062cb1a8343840AeC5026cB7242d67ad'; //rinkeby
	liminalBackendAddress = '0xa22610E72cF86f3ef1a2A1f34D89f9E5B0EFc0AA'; //'0x90f79bf6eb2c4f870365e785982e1f101e93b906'; local


	constructor() {
		this.AUSD_ADDRESS = getContractsInfo('fuji').AUSD_ADDRESS;
		this.KYC_ADDRESS = getContractsInfo('fuji').KYC_ADDRESS;
		this.LIMINAL_MARKET_ADDRESS = getContractsInfo('fuji').LIMINAL_MARKET_ADDRESS;
	}

	AUSD_ADDRESS : string;
	KYC_ADDRESS : string;
	LIMINAL_MARKET_ADDRESS : string;
}
