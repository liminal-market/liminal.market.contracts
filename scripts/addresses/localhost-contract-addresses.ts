import ContractAddresses from "./ContractAddresses";
import RelayerAddress from "./RelayerAddress";

export default class localhostContractAddresses implements ContractAddresses {
    ChainId = "31337";
    NetworkName = "localhost";
    KYC_ADDRESS = "0x2856a0C8034bF887928845D05179847e0ADC2209";
    AUSD_ADDRESS = "0x6aCE712D412e99727aDf2272BE24f8e45aF76270";
    LIMINAL_MARKET_ADDRESS = "0xbd1270f3f8175927Fe427a220b9253b360Be52Bd";
    MARKET_CALENDAR_ADDRESS = "0x459239D96976440d68fd78e1401983376840d563";

    getRelayerAddress(): string {
        return RelayerAddress.getAddress(this.NetworkName);
    }
}