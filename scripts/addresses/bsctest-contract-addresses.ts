import ContractAddresses from "./ContractAddresses";
import RelayerAddress from "./RelayerAddress";

export default class bsctestContractAddresses extends ContractAddresses {

    KYC_ADDRESS = "0x0B263ab693FAB0CaA06EbbF33395eD90b6b0bCec";
    AUSD_ADDRESS = "0xD1FCCdC474a3708B44C2F4F5C7De8C34328cD203";
    LIMINAL_MARKET_ADDRESS = "0xcD5FD1e5A49F474d26c535962C0eb2a680250904";

    public getRelayerAddress() : string {
        return RelayerAddress.getAddress("bsctest");
    }
}