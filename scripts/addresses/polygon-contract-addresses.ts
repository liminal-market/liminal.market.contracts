import ContractAddresses from "./ContractAddresses";
import FixedAddresses from "./FixedAddresses";

export default class polygonContractAddresses implements ContractAddresses {

    ChainId = "137";
    NetworkName = "polygon";
    IsTestNetwork = false;
    KYC_ADDRESS = "0xc7dA98E282cc30BD4fe0a7dE38372F876DB577E4";
    AUSD_ADDRESS = "0x9B780e71C2a8492E805e17616EB878f2e3874E21";
    LIMINAL_MARKET_ADDRESS = "0x8B4fc0bcaED76a6569525d8Fe51E57cAd32FDd94";
    MARKET_CALENDAR_ADDRESS = "0x77b54CbF3e1370af13da41196B4d99cd02eBcC44";
    LM_ADDRESS: string = '';
    NO_FEE_CONTRACT_ADDRESS = '';
    SERVICE_CONTRACT_ADDRESS = '';
    getRelayerAddress(): string {
        return FixedAddresses.getRelayerAddress(this.NetworkName);
    }
    getLMServiceFeeAddress(): string {
        return FixedAddresses.getLMServiceFeeAddress(this.NetworkName);
    }
}