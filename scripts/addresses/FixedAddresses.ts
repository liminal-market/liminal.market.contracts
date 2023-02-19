export default class FixedAddresses {

    public static getRelayerAddress(network : string) : string {
        if (network == 'mumbai') {
            return "0x7aced305382ac47a901bfda45b9ee6935765708d";
        } else if (network == 'fuji') {
            return "0x54577aff26c37383f33577753501c11c326f2d6f";
        } else if (network == 'bsctest') {
            return "0xfbccca4821b953a29471b743837f6dd48a919d49";
        } else if (network == 'localhost') {
            return "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        }

        throw new Error("Could not find network:" + network);
    }

    static getLMServiceFeeAddress(network: string) {
        if (network == 'mumbai') {
            return "0x56341C4c90B11De4d26971BcaEf3B4D8c3bC0240";
        } else if (network == 'fuji') {
            return "";
        } else if (network == 'bsctest') {
            return "";
        } else if (network == 'localhost') {
            return "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
        }

        throw new Error("Could not find network:" + network);
    }
}