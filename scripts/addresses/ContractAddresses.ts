
export default interface ContractAddresses {
    ChainId : string;
    NetworkName : string;
    IsTestNetwork : boolean;
    KYC_ADDRESS :string;
    AUSD_ADDRESS : string;
    LIMINAL_MARKET_ADDRESS :string;
    MARKET_CALENDAR_ADDRESS : string;
    SERVICE_SETTINGS_ADDRESS : string;
    STAKING_POOL_ADDRESS : string;

    getRelayerAddress() : string;
}