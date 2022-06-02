import ContractAddresses from "./ContractAddresses";

export default class localhostContractAddresses implements ContractAddresses {
    NetworkName = "localhost";
    KYC_ADDRESS = "0xe2688b3e95BbeAF105CDEEAac84E93861CecB3f2";
    AUSD_ADDRESS = "0x91554B9C8C64DA9220A9EF8FCc00EF4A0a941685";
    LIMINAL_MARKET_ADDRESS = "0x0008F6880a591c70C4A308f12F61CC96a830d1e3";
    MARKET_CALENDAR_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    getRelayerAddress(): string {
        return "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    }
}