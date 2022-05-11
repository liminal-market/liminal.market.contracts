/*
export const KYC_ADDRESS = "0xD5f071F2D8BF6E7d6BC25A1D89e9b1430AC78A58";
export const LIMINAL_ADDRESS = "0x3D7CD28EfD08FfE9Ce8cA329EC2e67822C756526";
export const AUSD_ADDRESS = "0x6854DC0e58Ef1029aA42Ba61ca1160527bBeC01E";
export const SECURITY_FACTORY_ADDRESS = "0x0c8Cd13ff68D41263E6937224B9e5c7fF54d72f9";
export const SECURITY_TOKEN_OWNER = "0x0c8Cd13ff68D41263E6937224B9e5c7fF54d72f9";
export const USDC_ADDRESS = "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b";
*/
import localhostContractAddresses from './localhost-contract-addresses';
import rinkebyContractAddresses from './rinkeby-contract-addresses';
import mumbaiContractAddresses from './mumbai-contract-addresses';
import fujiContractAddresses from './fuji-contract-addresses';
import ContractAddresses from "./ContractAddresses";
import NetworkInfo from "../networks/NetworkInfo";


export default class ContractInfo {


    public static getContractInfo(networkName?: string): ContractAddresses {
        let contractInfos: any = {
            localhostContractAddresses, rinkebyContractAddresses,
            mumbaiContractAddresses, fujiContractAddresses
        };

        if (!networkName) {
            networkName = NetworkInfo.getInstance().Name;
        }
        const contractInfoType = contractInfos[networkName + 'ContractAddresses'];
        return new contractInfoType();
    }


}
