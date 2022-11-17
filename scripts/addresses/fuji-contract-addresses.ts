import ContractAddresses from "./ContractAddresses";
import RelayerAddress from "./RelayerAddress";

export default class fujiContractAddresses implements ContractAddresses {
    ChainId = "43113";
    NetworkName = "fuji";
    IsTestNetwork = true;
    KYC_ADDRESS = "0x0594D04FDB5C98Fb7F777a799139424Ae2414AaD";
    AUSD_ADDRESS = "0xbAc482aE0b0d652854df377be566445984A021ED";
    LIMINAL_MARKET_ADDRESS = "0x098A512B017408008a23ECe22843788799CDebFd";
    MARKET_CALENDAR_ADDRESS = "0x77E6A62Be8398B18d2dA81CDB6Eb097bD8132ccB";
    SERVICE_SETTINGS_ADDRESS = "";
    STAKING_POOL_ADDRESS = "";

    getRelayerAddress(): string {
        return RelayerAddress.getAddress(this.NetworkName);
    }
}