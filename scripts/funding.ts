
import {getContractsByNetwork} from './networks';


export const fundLink = async function (href: any, address: string) {
	const contractInfo = getContractsByNetwork(href);

	await href.network.provider.send("hardhat_impersonateAccount", [contractInfo.fromLINKAddress])
	const impersonatedSigner = await href.ethers.getSigner(contractInfo.fromLINKAddress)

	// create the token instance
	const contract = await href.ethers.getContractAt("ERC20", contractInfo.linkTokenAddress)

	// connect it to the impersonated signer and send it to your signer
	console.log('funding LINK to smart contract', address)
	var result = await contract.connect(impersonatedSigner).transfer(address, 2 * 10 ** 8)

  }

  export const fundUSDC = async function(hre : any) {
	const contractInfo = getContractsByNetwork(hre);
	const [signer] = await hre.ethers.getSigners()

	// impersonate account; replace with an address that actually has your token
	await hre.network.provider.send("hardhat_impersonateAccount", [contractInfo.fromUSDCAddress])
	const impersonatedSigner = await hre.ethers.getSigner(contractInfo.fromUSDCAddress)

	// create the token instance
	const contract = await hre.ethers.getContractAt("ERC20", contractInfo.usdcContractAddress)

	// connect it to the impersonated signer and send it to your signer
	var result = await contract.connect(impersonatedSigner).transfer(contractInfo.liminalUserAdress, 2000 * 10 ** 6)
	console.log('result', result);
  }
