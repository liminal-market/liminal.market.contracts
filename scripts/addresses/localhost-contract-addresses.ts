import ContractAddresses from "./ContractAddresses";
import RelayerAddress from "./RelayerAddress";

export default class localhostContractAddresses implements ContractAddresses {
    ChainId = "31337";
    NetworkName = "localhost"
    KYC_ADDRESS = "0x5407C97F6991E52206e039C0353141db5239cd1d";
    AUSD_ADDRESS = "0x9aD101eabDc5dEc6AF911Bc131694D0AC62b742a";
    LIMINAL_MARKET_ADDRESS = "0x28f44D2e4254cB80603Aed7e98AcDCE6F52A4387";
    MARKET_CALENDAR_ADDRESS = "0xA9fAB3a875B346E69689489d67d51C9aa05910E6";

    getRelayerAddress(): string {
        return RelayerAddress.getAddress(this.NetworkName);
    }
}