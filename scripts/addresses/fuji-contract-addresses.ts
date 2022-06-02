import ContractAddresses from "./ContractAddresses";
import RelayerAddress from "./RelayerAddress";

export default class fujiContractAddresses implements ContractAddresses {
    NetworkName = "fuji"
    KYC_ADDRESS = "0xc5C8ADea4d7b1E118198975A06dddEACDbFaEd0d";
    AUSD_ADDRESS = "0x645607b0E581bFa320A0B6c0D770F34099623D25";
    LIMINAL_MARKET_ADDRESS = "0x7125ECB12154bc238D91DF5bbee6FD26823307a6";
    MARKET_CALENDAR_ADDRESS = "";

    getRelayerAddress(): string {
        return RelayerAddress.getAddress(this.NetworkName);
    }
}