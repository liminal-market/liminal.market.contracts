
export default interface ContractAddresses {
    ChainId : string;
    NetworkName : string;
    KYC_ADDRESS :string;
    AUSD_ADDRESS : string;
    LIMINAL_MARKET_ADDRESS :string;
    MARKET_CALENDAR_ADDRESS : string;
    getRelayerAddress() : string;
}