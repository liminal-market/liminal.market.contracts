import ContractAddresses from "./ContractAddresses";
import FixedAddresses from "./FixedAddresses";

export default class mumbaiContractAddresses implements ContractAddresses {
    ChainId = "80001";
    NetworkName = "mumbai";
    IsTestNetwork = true;

    KYC_ADDRESS = "0xA5C844558a93590A32D1110D7031531A0bBf0773";
    AUSD_ADDRESS = "0xc4d1f8D35DB0f0d3E91a3fc8485792F4Df60C387";
    LIMINAL_MARKET_ADDRESS = "0x0D8c3D4F4B29EfC3c54172803dA8a7f1CA2E6189";
    MARKET_CALENDAR_ADDRESS = "0x67Dad7E344C6137DF922924a0aAb26bba862BFDe";
    LM_ADDRESS = "0x808C2F1bBE4C7fE72F77e84F57C346603E63291e";
    SERVICE_CONTRACT_ADDRESS = "0x0827C71852ba59661aAd9f1fab25B377B3f39C40";
    NO_FEE_CONTRACT_ADDRESS = "0x3BBc034e9dC74749000fE384eD504E7d58281065";

    getRelayerAddress(): string {
        return FixedAddresses.getRelayerAddress(this.NetworkName);
    }
    getLMServiceFeeAddress(): string {
        return FixedAddresses.getLMServiceFeeAddress(this.NetworkName);
    }
}