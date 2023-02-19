import FixedAddresses from "../../../scripts/addresses/FixedAddresses";
import {expect} from "chai";

describe("Test RelayerAddress class", () => {
    it("test relayer addressses", async () => {

        expect(FixedAddresses.getRelayerAddress("mumbai")).to.equal("0x7aced305382ac47a901bfda45b9ee6935765708d")
        expect(FixedAddresses.getRelayerAddress("fuji")).to.equal("0x54577aff26c37383f33577753501c11c326f2d6f")
        expect(FixedAddresses.getRelayerAddress("bsctest")).to.equal("0xfbccca4821b953a29471b743837f6dd48a919d49")

    })
})