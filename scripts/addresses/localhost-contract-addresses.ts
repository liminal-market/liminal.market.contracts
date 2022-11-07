import ContractAddresses from "./ContractAddresses";
import RelayerAddress from "./RelayerAddress";

export default class localhostContractAddresses implements ContractAddresses {
    ChainId = "31337";
    NetworkName = "localhost";
    IsTestNetwork = true;

    KYC_ADDRESS = "0x172A9DA328BC71f4354f4f17Db5630552cC9420d";
    AUSD_ADDRESS = "0xCd40ae7648E53B92e338CCaAF78734397D2Fe2A4";
    LIMINAL_MARKET_ADDRESS = "0x54eb4fA482d50e0369D333193De804898317A2A5";
    MARKET_CALENDAR_ADDRESS = "0xF5A39660A894698074593A5B1fBd33697dCa4091";

    getRelayerAddress(): string {
        return RelayerAddress.getAddress(this.NetworkName);
    }
}