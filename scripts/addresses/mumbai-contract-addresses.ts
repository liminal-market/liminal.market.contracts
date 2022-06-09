import ContractAddresses from "./ContractAddresses";
import RelayerAddress from "./RelayerAddress";

export default class mumbaiContractAddresses implements ContractAddresses {
    ChainId = "80001";
    NetworkName = "mumbai";
    KYC_ADDRESS = "0x23c2d25Ba4E8dD2d465348A7039c8D5aaaa72c5B";
    AUSD_ADDRESS = "0xe65Fb29C8CeB720755D456233c971DDb11fcbb8d";
    LIMINAL_MARKET_ADDRESS = "0x2BFb0207BC88BA9e2Ac74F19c9e88EdCcdBbC2a9";
    MARKET_CALENDAR_ADDRESS = "0xcf979d53DF610944cA73CfEfe2F8AFdB9d42e88D";
    public getRelayerAddress() : string {
        return RelayerAddress.getAddress(this.NetworkName);
    }
}