
import localhostContractAddresses from './addresses/localhost-contract-addresses';
import rinkebyContractAddresses from './addresses/rinkeby-contract-addresses';
import mumbaiContractAddresses from './addresses/mumbai-contract-addresses';
import fujiContractAddresses from './addresses/fuji-contract-addresses';
import bsctestContractAddresses from "./addresses/bsctest-contract-addresses";

export const getContractsByNetwork = function(hre : any) {

	switch (hre.network.name) {
		case 'localhost':
			return new localhostContractAddresses();
		case 'rinkeby':
			return new rinkebyContractAddresses();
		case 'mumbai':
			return new mumbaiContractAddresses();
		case 'fuji':
			return new fujiContractAddresses();
		case 'bsctest':
			return new bsctestContractAddresses();
		default:
			return new localhostContractAddresses();
	}


}
