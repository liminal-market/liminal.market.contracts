import {getContractsByNetwork} from './networks';
import {BigNumber} from "ethers";


export const fundAUSD = async function (hre: any) {
    const contractInfo = getContractsByNetwork(hre);
    const [signer] = await hre.ethers.getSigners()
    console.log('aUSD address:' + contractInfo.AUSD_ADDRESS);
    // create the token instance
    const contract = await hre.ethers.getContractAt("aUSD", contractInfo.AUSD_ADDRESS)

    let userWallet = contractInfo.liminalUserAdress;
    userWallet = "0x93da645082493bbd7116fc057c5b9adfd5363912";
    // connect it to the impersonated signer and send it to your signer

    var result = await contract.setBalance(userWallet, "10000" + "0".repeat(18))
    console.log('result', result);
}
