export default class RelayerAddress {

    public static getAddress(network : string) : string {
        if (network == 'mumbai') {
            return "0x7aced305382ac47a901bfda45b9ee6935765708d";
        } else if (network == 'fuji') {
            return "0x54577aff26c37383f33577753501c11c326f2d6f";
        } else if (network == 'bsctest') {
            return "0xfbccca4821b953a29471b743837f6dd48a919d49";
        } else if (network == 'localhost') {
            return "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        } else if (network == 'polygon') {
            return "0xadab6bfac1c39591a25362015818ddb48b0fa207";
        }

        throw new Error("Could not find network:" + network);
    }

}