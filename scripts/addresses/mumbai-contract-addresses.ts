import ContractAddresses from "./ContractAddresses";
import RelayerAddress from "./RelayerAddress";

export default class mumbaiContractAddresses implements ContractAddresses {
    ChainId = "80001";
    NetworkName = "mumbai";
    IsTestNetwork = true;
    KYC_ADDRESS = "0x32D664603E45370E670BbB15bb40A4918468Bc93";
    AUSD_ADDRESS = "0xfF14E9C44e1Bf3894AD3173F9490b8a4823F2c63";
    LIMINAL_MARKET_ADDRESS = "0xf9c4C08740Ca619feB03c14F9bE1df734CB53eca";
    MARKET_CALENDAR_ADDRESS = "0x1c4e1F47Be6902ACE61E7C01C17901786B676ec8";

    getRelayerAddress(): string {
        return RelayerAddress.getAddress(this.NetworkName);
    }
}