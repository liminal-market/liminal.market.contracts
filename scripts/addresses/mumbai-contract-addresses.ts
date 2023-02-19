import ContractAddresses from "./ContractAddresses";
import FixedAddresses from "./FixedAddresses";

export default class mumbaiContractAddresses implements ContractAddresses {
    ChainId = "80001";
    NetworkName = "mumbai";
    IsTestNetwork = true;

    KYC_ADDRESS = "0x9e2B28D9F841300bE3B64e505dEcA36c35250609";
    AUSD_ADDRESS = "0x38F2B1E9F11937dD276D64521535b15280A7F137";
    LIMINAL_MARKET_ADDRESS = "0x6e9C29e416dc9F7A6A03ffebaB3f02Ef62a1baE4";
    MARKET_CALENDAR_ADDRESS = "0xc6B29dfd4FD756EF94b3A3FF7a531F4467BDDA75";
    LM_ADDRESS: string = '';
    SERVICE_CONTRACT_ADDRESS: string = '';
    NO_FEE_CONTRACT_ADDRESS: string = '';

    getRelayerAddress(): string {
        return FixedAddresses.getRelayerAddress(this.NetworkName);
    }
    getLMServiceFeeAddress(): string {
        return FixedAddresses.getLMServiceFeeAddress(this.NetworkName);
    }


}