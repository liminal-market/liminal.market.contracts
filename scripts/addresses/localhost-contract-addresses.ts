import ContractAddresses from "./ContractAddresses";
import FixedAddresses from "./FixedAddresses";

export default class localhostContractAddresses implements ContractAddresses {
    ChainId = "31337";
    NetworkName = "localhost";
    IsTestNetwork = true;

    KYC_ADDRESS = "0xA700528a2B9Bd3126c96378b76f2c99f5F0e0F76";
    AUSD_ADDRESS = "0x7ad1630b2E9F0e5401f220A33B473C7E5551dd3e";
    LIMINAL_MARKET_ADDRESS = "0x19d5ABE7854b01960D4911e6536b26F8A38C3a18";
    MARKET_CALENDAR_ADDRESS = "0x12bA221061255c11EA4895C363633bD43F28F9c3";
    LM_ADDRESS = "0x012c686711d9532f7fD68fe6a40d86477288F1dc";
    SERVICE_CONTRACT_ADDRESS = "0x9B946889657e8f2D943A3841282fBf5751241E85";
    NO_FEE_CONTRACT_ADDRESS = "0x0d82EF4e843c1ca7bd2aa9B2Aa4239bd70b306df";

    getRelayerAddress(): string {
        return FixedAddresses.getRelayerAddress(this.NetworkName);
    }
    getLMServiceFeeAddress(): string {
        return FixedAddresses.getLMServiceFeeAddress(this.NetworkName);
    }
}