import ContractAddresses from "./ContractAddresses";
import RelayerAddress from "./RelayerAddress";

export default class polygonContractAddresses implements ContractAddresses {
    ChainId = "137";
    NetworkName = "polygon";
    IsTestNetwork = false;
    KYC_ADDRESS = "";
    AUSD_ADDRESS = "";
    LIMINAL_MARKET_ADDRESS = "";
    MARKET_CALENDAR_ADDRESS = "";

    getRelayerAddress(): string {
        return RelayerAddress.getAddress(this.NetworkName);
    }
}