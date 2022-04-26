
import {getContractsByNetwork} from './networks';


  export const fundAUSD = async function(hre : any) {
	const contractInfo = getContractsByNetwork(hre);
	const [signer] = await hre.ethers.getSigners()

	// create the token instance
	  const contract = await hre.ethers.getContractAt("ERC20", contractInfo.AUSD_ADDRESS)

	// connect it to the impersonated signer and send it to your signer
	var result = await contract.setBalance(contractInfo.liminalUserAdress, 1000 * 10 ** 18)
	console.log('result', result);
  }
