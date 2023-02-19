
export default interface ContractAddresses {
    ChainId : string;
    NetworkName : string;
    IsTestNetwork : boolean;
    KYC_ADDRESS :string;
    AUSD_ADDRESS : string;
    LIMINAL_MARKET_ADDRESS :string;
    MARKET_CALENDAR_ADDRESS : string;
    LM_ADDRESS : string;
    SERVICE_CONTRACT_ADDRESS : string;
    NO_FEE_CONTRACT_ADDRESS : string;

    getRelayerAddress() : string;
    getLMServiceFeeAddress(): string;
}